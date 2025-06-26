/**
 * Backup Manager - Gestisce backup automatici e manuali dei dati
 */
class BackupManager {
    constructor() {
        this.backupPrefix = 'cronologia_backup_';
        this.maxBackups = 5;
        this.autoBackupInterval = 300000; // 5 minuti
        this.autoBackupTimer = null;
        this.init();
    }

    /**
     * Inizializza il backup manager
     */
    init() {
        this.startAutoBackup();
        this.setupBeforeUnloadBackup();
        logger?.info('Backup Manager inizializzato');
    }

    /**
     * Avvia il backup automatico
     */
    startAutoBackup() {
        if (this.autoBackupTimer) {
            clearInterval(this.autoBackupTimer);
        }
        
        this.autoBackupTimer = setInterval(() => {
            this.createAutoBackup();
        }, this.autoBackupInterval);
        
        logger?.debug('Auto-backup avviato', { interval: this.autoBackupInterval });
    }

    /**
     * Ferma il backup automatico
     */
    stopAutoBackup() {
        if (this.autoBackupTimer) {
            clearInterval(this.autoBackupTimer);
            this.autoBackupTimer = null;
            logger?.debug('Auto-backup fermato');
        }
    }

    /**
     * Configura backup prima della chiusura della pagina
     */
    setupBeforeUnloadBackup() {
        window.addEventListener('beforeunload', () => {
            this.createBackup('before_unload');
        });
    }

    /**
     * Crea un backup completo
     */
    createBackup(type = 'manual') {
        try {
            const timestamp = new Date().toISOString();
            const backupData = {
                metadata: {
                    version: '1.0.0',
                    timestamp: timestamp,
                    type: type,
                    userAgent: navigator.userAgent,
                    url: window.location.href
                },
                data: this.collectAllData()
            };

            const backupKey = `${this.backupPrefix}${timestamp}`;
            localStorage.setItem(backupKey, JSON.stringify(backupData));
            
            // Pulisci vecchi backup
            this.cleanOldBackups();
            
            logger?.info('Backup creato', { type, timestamp, size: JSON.stringify(backupData).length });
            return backupKey;
        } catch (error) {
            logger?.error('Errore nella creazione del backup', error);
            return null;
        }
    }

    /**
     * Crea un backup automatico
     */
    createAutoBackup() {
        // Verifica se ci sono stati cambiamenti dall'ultimo backup
        if (this.hasDataChanged()) {
            return this.createBackup('auto');
        }
        return null;
    }

    /**
     * Raccoglie tutti i dati dell'applicazione
     */
    collectAllData() {
        const data = {};
        
        // Raccoglie dati dal storage
        const storageKeys = ['events', 'people', 'settings'];
        storageKeys.forEach(key => {
            const fullKey = `cronologia_${key}`;
            const value = localStorage.getItem(fullKey);
            if (value) {
                try {
                    data[key] = JSON.parse(value);
                } catch (error) {
                    data[key] = value;
                }
            }
        });
        
        return data;
    }

    /**
     * Verifica se i dati sono cambiati dall'ultimo backup
     */
    hasDataChanged() {
        const lastBackup = this.getLatestBackup();
        if (!lastBackup) return true;
        
        const currentData = this.collectAllData();
        const lastData = lastBackup.data;
        
        return JSON.stringify(currentData) !== JSON.stringify(lastData);
    }

    /**
     * Ottiene l'ultimo backup
     */
    getLatestBackup() {
        const backups = this.getAllBackups();
        return backups.length > 0 ? backups[0] : null;
    }

    /**
     * Ottiene tutti i backup
     */
    getAllBackups() {
        const backups = [];
        
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(this.backupPrefix)) {
                try {
                    const backup = JSON.parse(localStorage.getItem(key));
                    backup.key = key;
                    backups.push(backup);
                } catch (error) {
                    logger?.warn('Backup corrotto trovato', { key, error });
                }
            }
        }
        
        // Ordina per timestamp (più recente prima)
        return backups.sort((a, b) => 
            new Date(b.metadata.timestamp) - new Date(a.metadata.timestamp)
        );
    }

    /**
     * Pulisce i backup vecchi
     */
    cleanOldBackups() {
        const backups = this.getAllBackups();
        
        if (backups.length > this.maxBackups) {
            const toDelete = backups.slice(this.maxBackups);
            toDelete.forEach(backup => {
                localStorage.removeItem(backup.key);
                logger?.debug('Backup vecchio eliminato', { key: backup.key });
            });
        }
    }

    /**
     * Ripristina da un backup
     */
    restoreFromBackup(backupKey) {
        try {
            const backupData = localStorage.getItem(backupKey);
            if (!backupData) {
                throw new Error('Backup non trovato');
            }
            
            const backup = JSON.parse(backupData);
            const data = backup.data;
            
            // Ripristina i dati
            Object.keys(data).forEach(key => {
                const fullKey = `cronologia_${key}`;
                localStorage.setItem(fullKey, JSON.stringify(data[key]));
            });
            
            logger?.info('Dati ripristinati da backup', { 
                backupKey, 
                timestamp: backup.metadata.timestamp 
            });
            
            // Ricarica la pagina per applicare i cambiamenti
            window.location.reload();
            
            return true;
        } catch (error) {
            logger?.error('Errore nel ripristino del backup', error);
            return false;
        }
    }

    /**
     * Elimina un backup
     */
    deleteBackup(backupKey) {
        try {
            localStorage.removeItem(backupKey);
            logger?.info('Backup eliminato', { backupKey });
            return true;
        } catch (error) {
            logger?.error('Errore nell\'eliminazione del backup', error);
            return false;
        }
    }

    /**
     * Esporta un backup come file
     */
    exportBackup(backupKey) {
        try {
            const backupData = localStorage.getItem(backupKey);
            if (!backupData) {
                throw new Error('Backup non trovato');
            }
            
            const backup = JSON.parse(backupData);
            const filename = `cronologia_backup_${backup.metadata.timestamp.split('T')[0]}.json`;
            
            const blob = new Blob([backupData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
            
            URL.revokeObjectURL(url);
            
            logger?.info('Backup esportato', { backupKey, filename });
            return true;
        } catch (error) {
            logger?.error('Errore nell\'esportazione del backup', error);
            return false;
        }
    }

    /**
     * Importa un backup da file
     */
    importBackup(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const backupData = JSON.parse(e.target.result);
                    
                    // Valida la struttura del backup
                    if (!backupData.metadata || !backupData.data) {
                        throw new Error('Formato backup non valido');
                    }
                    
                    // Crea una nuova chiave per il backup importato
                    const timestamp = new Date().toISOString();
                    const backupKey = `${this.backupPrefix}imported_${timestamp}`;
                    
                    // Aggiorna i metadati
                    backupData.metadata.importedAt = timestamp;
                    backupData.metadata.originalTimestamp = backupData.metadata.timestamp;
                    backupData.metadata.timestamp = timestamp;
                    backupData.metadata.type = 'imported';
                    
                    localStorage.setItem(backupKey, JSON.stringify(backupData));
                    
                    logger?.info('Backup importato', { backupKey, originalTimestamp: backupData.metadata.originalTimestamp });
                    resolve(backupKey);
                } catch (error) {
                    logger?.error('Errore nell\'importazione del backup', error);
                    reject(error);
                }
            };
            
            reader.onerror = () => {
                const error = new Error('Errore nella lettura del file');
                logger?.error('Errore nella lettura del file di backup', error);
                reject(error);
            };
            
            reader.readAsText(file);
        });
    }

    /**
     * Ottiene statistiche sui backup
     */
    getBackupStats() {
        const backups = this.getAllBackups();
        
        const stats = {
            total: backups.length,
            totalSize: 0,
            byType: {},
            oldestBackup: null,
            newestBackup: null,
            averageSize: 0
        };
        
        backups.forEach(backup => {
            const size = JSON.stringify(backup).length;
            stats.totalSize += size;
            
            const type = backup.metadata.type;
            stats.byType[type] = (stats.byType[type] || 0) + 1;
        });
        
        if (backups.length > 0) {
            stats.newestBackup = backups[0];
            stats.oldestBackup = backups[backups.length - 1];
            stats.averageSize = Math.round(stats.totalSize / backups.length);
        }
        
        return stats;
    }
}

// Istanza globale del backup manager
const backupManager = new BackupManager();

// Esporta per uso in altri moduli
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BackupManager;
}