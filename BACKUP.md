# 💾 Guida al Backup e Ripristino

> Procedure complete per il backup e ripristino del Sistema di Appunti con Analytics Avanzate

## 📋 Panoramica

Questo documento fornisce procedure dettagliate per:
- Backup completo dei dati applicazione
- Ripristino da backup
- Migrazione dati tra dispositivi
- Backup automatico e programmato
- Gestione versioni backup

## 🎯 Tipi di Backup

### 1. Backup Completo
Include tutti i dati dell'applicazione:
- Eventi storici
- Persone e biografie
- Configurazioni utente
- Log di sistema
- Dati analytics
- Preferenze UI

### 2. Backup Incrementale
Solo i dati modificati dall'ultimo backup:
- Nuovi eventi
- Modifiche esistenti
- Nuove configurazioni
- Log recenti

### 3. Backup Selettivo
Backup di specifiche categorie:
- Solo eventi
- Solo persone
- Solo configurazioni
- Solo analytics

## 🔧 Metodi di Backup

### Metodo 1: Backup Manuale via Interface

#### Procedura Guidata
1. **Accesso alla funzione backup**:
   ```javascript
   // Apri il menu backup
   document.querySelector('#backup-menu').click();
   ```

2. **Selezione tipo backup**:
   - Completo (raccomandato)
   - Incrementale
   - Selettivo

3. **Configurazione backup**:
   ```javascript
   const backupConfig = {
       includeEvents: true,
       includePeople: true,
       includeConfig: true,
       includeLogs: true,
       includeAnalytics: true,
       compression: true,
       encryption: false // Opzionale
   };
   ```

4. **Esecuzione backup**:
   - Cliccare "Avvia Backup"
   - Attendere completamento
   - Scaricare file generato

### Metodo 2: Backup Programmatico

#### Script di Backup Completo
```javascript
class BackupManager {
    constructor() {
        this.version = '1.1.0';
        this.timestamp = new Date().toISOString();
    }
    
    // Backup completo di tutti i dati
    createFullBackup() {
        const backup = {
            metadata: {
                version: this.version,
                timestamp: this.timestamp,
                type: 'full',
                source: 'manual'
            },
            data: {
                events: this.getEvents(),
                people: this.getPeople(),
                config: this.getConfig(),
                logs: this.getLogs(),
                analytics: this.getAnalytics(),
                ui: this.getUIState()
            }
        };
        
        return this.compressBackup(backup);
    }
    
    // Estrai eventi da localStorage
    getEvents() {
        try {
            return JSON.parse(localStorage.getItem('appunti_events') || '[]');
        } catch (error) {
            console.error('Errore lettura eventi:', error);
            return [];
        }
    }
    
    // Estrai persone da localStorage
    getPeople() {
        try {
            return JSON.parse(localStorage.getItem('appunti_people') || '[]');
        } catch (error) {
            console.error('Errore lettura persone:', error);
            return [];
        }
    }
    
    // Estrai configurazioni
    getConfig() {
        const config = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('appunti_config_')) {
                config[key] = localStorage.getItem(key);
            }
        }
        return config;
    }
    
    // Estrai log di sistema
    getLogs() {
        try {
            return JSON.parse(localStorage.getItem('appunti_logs') || '[]');
        } catch (error) {
            console.error('Errore lettura log:', error);
            return [];
        }
    }
    
    // Estrai dati analytics
    getAnalytics() {
        const analytics = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('appunti_analytics_')) {
                analytics[key] = localStorage.getItem(key);
            }
        }
        return analytics;
    }
    
    // Estrai stato UI
    getUIState() {
        return {
            theme: localStorage.getItem('appunti_theme'),
            language: localStorage.getItem('appunti_language'),
            layout: localStorage.getItem('appunti_layout'),
            preferences: localStorage.getItem('appunti_preferences')
        };
    }
    
    // Comprimi backup (opzionale)
    compressBackup(backup) {
        // Implementazione compressione se necessaria
        return backup;
    }
    
    // Salva backup su file
    downloadBackup(backup, filename) {
        const dataStr = JSON.stringify(backup, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = filename || `appunti_backup_${this.timestamp.split('T')[0]}.json`;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(link.href);
    }
    
    // Backup incrementale
    createIncrementalBackup(lastBackupDate) {
        const backup = {
            metadata: {
                version: this.version,
                timestamp: this.timestamp,
                type: 'incremental',
                since: lastBackupDate
            },
            data: {
                events: this.getEventsModifiedSince(lastBackupDate),
                people: this.getPeopleModifiedSince(lastBackupDate),
                logs: this.getLogsModifiedSince(lastBackupDate)
            }
        };
        
        return backup;
    }
    
    // Eventi modificati da una data
    getEventsModifiedSince(date) {
        const events = this.getEvents();
        return events.filter(event => 
            new Date(event.lastModified || event.created) > new Date(date)
        );
    }
    
    // Persone modificate da una data
    getPeopleModifiedSince(date) {
        const people = this.getPeople();
        return people.filter(person => 
            new Date(person.lastModified || person.created) > new Date(date)
        );
    }
    
    // Log modificati da una data
    getLogsModifiedSince(date) {
        const logs = this.getLogs();
        return logs.filter(log => 
            new Date(log.timestamp) > new Date(date)
        );
    }
}

// Utilizzo del BackupManager
const backupManager = new BackupManager();

// Backup completo
const fullBackup = backupManager.createFullBackup();
backupManager.downloadBackup(fullBackup);

// Backup incrementale
const lastBackup = '2024-01-01T00:00:00.000Z';
const incrementalBackup = backupManager.createIncrementalBackup(lastBackup);
backupManager.downloadBackup(incrementalBackup, 'appunti_incremental_backup.json');
```

### Metodo 3: Backup Automatico

#### Configurazione Backup Automatico
```javascript
class AutoBackupManager {
    constructor(config = {}) {
        this.config = {
            enabled: true,
            interval: 24 * 60 * 60 * 1000, // 24 ore
            maxBackups: 7, // Mantieni 7 backup
            autoDownload: false,
            ...config
        };
        
        this.backupManager = new BackupManager();
        this.init();
    }
    
    init() {
        if (this.config.enabled) {
            this.scheduleNextBackup();
            this.cleanOldBackups();
        }
    }
    
    scheduleNextBackup() {
        const lastBackup = localStorage.getItem('appunti_last_backup');
        const now = Date.now();
        const nextBackup = lastBackup ? 
            parseInt(lastBackup) + this.config.interval : 
            now + this.config.interval;
        
        const delay = Math.max(0, nextBackup - now);
        
        setTimeout(() => {
            this.performAutoBackup();
            this.scheduleNextBackup();
        }, delay);
        
        console.log(`Prossimo backup automatico in: ${Math.round(delay / 1000 / 60)} minuti`);
    }
    
    performAutoBackup() {
        try {
            const backup = this.backupManager.createFullBackup();
            this.saveBackupToStorage(backup);
            
            localStorage.setItem('appunti_last_backup', Date.now().toString());
            
            if (this.config.autoDownload) {
                this.backupManager.downloadBackup(backup, 
                    `appunti_auto_backup_${new Date().toISOString().split('T')[0]}.json`);
            }
            
            console.log('✅ Backup automatico completato');
            
            // Notifica utente (opzionale)
            this.notifyUser('Backup automatico completato con successo');
            
        } catch (error) {
            console.error('❌ Errore backup automatico:', error);
            this.notifyUser('Errore durante il backup automatico', 'error');
        }
    }
    
    saveBackupToStorage(backup) {
        const backupKey = `appunti_backup_${Date.now()}`;
        try {
            localStorage.setItem(backupKey, JSON.stringify(backup));
        } catch (error) {
            // Se localStorage è pieno, rimuovi backup più vecchi
            this.cleanOldBackups(true);
            localStorage.setItem(backupKey, JSON.stringify(backup));
        }
    }
    
    cleanOldBackups(force = false) {
        const backupKeys = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('appunti_backup_')) {
                backupKeys.push({
                    key,
                    timestamp: parseInt(key.replace('appunti_backup_', ''))
                });
            }
        }
        
        // Ordina per timestamp (più recenti prima)
        backupKeys.sort((a, b) => b.timestamp - a.timestamp);
        
        // Rimuovi backup in eccesso
        const toRemove = force ? 
            backupKeys.slice(this.config.maxBackups - 1) : 
            backupKeys.slice(this.config.maxBackups);
        
        toRemove.forEach(backup => {
            localStorage.removeItem(backup.key);
            console.log(`🗑️ Rimosso backup vecchio: ${new Date(backup.timestamp).toLocaleString()}`);
        });
    }
    
    notifyUser(message, type = 'info') {
        // Implementa notifica utente
        if (window.app && window.app.showNotification) {
            window.app.showNotification(message, type);
        } else {
            console.log(`📢 ${type.toUpperCase()}: ${message}`);
        }
    }
    
    getBackupHistory() {
        const backups = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('appunti_backup_')) {
                const timestamp = parseInt(key.replace('appunti_backup_', ''));
                const size = localStorage.getItem(key).length;
                backups.push({
                    key,
                    timestamp,
                    date: new Date(timestamp).toLocaleString(),
                    size: this.formatBytes(size)
                });
            }
        }
        
        return backups.sort((a, b) => b.timestamp - a.timestamp);
    }
    
    formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}

// Inizializza backup automatico
const autoBackup = new AutoBackupManager({
    enabled: true,
    interval: 6 * 60 * 60 * 1000, // Ogni 6 ore
    maxBackups: 10,
    autoDownload: false
});
```

## 🔄 Ripristino da Backup

### Procedura di Ripristino

```javascript
class RestoreManager {
    constructor() {
        this.backupManager = new BackupManager();
    }
    
    // Ripristina da file backup
    async restoreFromFile(file) {
        try {
            const backupData = await this.readBackupFile(file);
            return this.performRestore(backupData);
        } catch (error) {
            console.error('Errore ripristino:', error);
            throw error;
        }
    }
    
    // Leggi file backup
    readBackupFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const backup = JSON.parse(e.target.result);
                    resolve(backup);
                } catch (error) {
                    reject(new Error('File backup non valido'));
                }
            };
            
            reader.onerror = () => reject(new Error('Errore lettura file'));
            reader.readAsText(file);
        });
    }
    
    // Esegui ripristino
    performRestore(backup, options = {}) {
        const {
            overwrite = true,
            merge = false,
            selectiveRestore = false,
            restoreConfig = {
                events: true,
                people: true,
                config: true,
                logs: true,
                analytics: true,
                ui: true
            }
        } = options;
        
        // Validazione backup
        if (!this.validateBackup(backup)) {
            throw new Error('Backup non valido o corrotto');
        }
        
        // Backup corrente prima del ripristino
        const currentBackup = this.backupManager.createFullBackup();
        this.saveEmergencyBackup(currentBackup);
        
        try {
            // Ripristina dati selezionati
            if (restoreConfig.events && backup.data.events) {
                this.restoreEvents(backup.data.events, { overwrite, merge });
            }
            
            if (restoreConfig.people && backup.data.people) {
                this.restorePeople(backup.data.people, { overwrite, merge });
            }
            
            if (restoreConfig.config && backup.data.config) {
                this.restoreConfig(backup.data.config, { overwrite });
            }
            
            if (restoreConfig.logs && backup.data.logs) {
                this.restoreLogs(backup.data.logs, { overwrite, merge });
            }
            
            if (restoreConfig.analytics && backup.data.analytics) {
                this.restoreAnalytics(backup.data.analytics, { overwrite });
            }
            
            if (restoreConfig.ui && backup.data.ui) {
                this.restoreUIState(backup.data.ui, { overwrite });
            }
            
            // Aggiorna timestamp ripristino
            localStorage.setItem('appunti_last_restore', new Date().toISOString());
            localStorage.setItem('appunti_restore_source', backup.metadata.timestamp);
            
            console.log('✅ Ripristino completato con successo');
            return { success: true, message: 'Ripristino completato' };
            
        } catch (error) {
            // Ripristina backup di emergenza in caso di errore
            console.error('❌ Errore durante ripristino, ripristino backup di emergenza');
            this.performRestore(currentBackup, { overwrite: true });
            throw error;
        }
    }
    
    // Valida backup
    validateBackup(backup) {
        if (!backup || typeof backup !== 'object') return false;
        if (!backup.metadata || !backup.data) return false;
        if (!backup.metadata.version || !backup.metadata.timestamp) return false;
        
        // Verifica compatibilità versione
        const backupVersion = backup.metadata.version;
        const currentVersion = this.backupManager.version;
        
        if (!this.isVersionCompatible(backupVersion, currentVersion)) {
            console.warn(`⚠️ Versione backup (${backupVersion}) diversa da versione corrente (${currentVersion})`);
        }
        
        return true;
    }
    
    // Verifica compatibilità versione
    isVersionCompatible(backupVersion, currentVersion) {
        // Implementa logica compatibilità versioni
        const [bMajor, bMinor] = backupVersion.split('.').map(Number);
        const [cMajor, cMinor] = currentVersion.split('.').map(Number);
        
        // Compatibile se major version uguale
        return bMajor === cMajor;
    }
    
    // Ripristina eventi
    restoreEvents(events, options) {
        if (options.overwrite) {
            localStorage.setItem('appunti_events', JSON.stringify(events));
        } else if (options.merge) {
            const currentEvents = this.backupManager.getEvents();
            const mergedEvents = this.mergeEvents(currentEvents, events);
            localStorage.setItem('appunti_events', JSON.stringify(mergedEvents));
        }
    }
    
    // Ripristina persone
    restorePeople(people, options) {
        if (options.overwrite) {
            localStorage.setItem('appunti_people', JSON.stringify(people));
        } else if (options.merge) {
            const currentPeople = this.backupManager.getPeople();
            const mergedPeople = this.mergePeople(currentPeople, people);
            localStorage.setItem('appunti_people', JSON.stringify(mergedPeople));
        }
    }
    
    // Ripristina configurazioni
    restoreConfig(config, options) {
        if (options.overwrite) {
            Object.keys(config).forEach(key => {
                localStorage.setItem(key, config[key]);
            });
        }
    }
    
    // Ripristina log
    restoreLogs(logs, options) {
        if (options.overwrite) {
            localStorage.setItem('appunti_logs', JSON.stringify(logs));
        } else if (options.merge) {
            const currentLogs = this.backupManager.getLogs();
            const mergedLogs = [...currentLogs, ...logs]
                .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
            localStorage.setItem('appunti_logs', JSON.stringify(mergedLogs));
        }
    }
    
    // Ripristina analytics
    restoreAnalytics(analytics, options) {
        if (options.overwrite) {
            Object.keys(analytics).forEach(key => {
                localStorage.setItem(key, analytics[key]);
            });
        }
    }
    
    // Ripristina stato UI
    restoreUIState(uiState, options) {
        if (options.overwrite) {
            Object.keys(uiState).forEach(key => {
                if (uiState[key] !== null) {
                    localStorage.setItem(key, uiState[key]);
                }
            });
        }
    }
    
    // Merge eventi (evita duplicati)
    mergeEvents(current, backup) {
        const merged = [...current];
        
        backup.forEach(backupEvent => {
            const exists = current.find(e => e.id === backupEvent.id);
            if (!exists) {
                merged.push(backupEvent);
            } else {
                // Mantieni versione più recente
                const backupDate = new Date(backupEvent.lastModified || backupEvent.created);
                const currentDate = new Date(exists.lastModified || exists.created);
                
                if (backupDate > currentDate) {
                    const index = merged.findIndex(e => e.id === exists.id);
                    merged[index] = backupEvent;
                }
            }
        });
        
        return merged;
    }
    
    // Merge persone (evita duplicati)
    mergePeople(current, backup) {
        const merged = [...current];
        
        backup.forEach(backupPerson => {
            const exists = current.find(p => p.id === backupPerson.id);
            if (!exists) {
                merged.push(backupPerson);
            } else {
                // Mantieni versione più recente
                const backupDate = new Date(backupPerson.lastModified || backupPerson.created);
                const currentDate = new Date(exists.lastModified || exists.created);
                
                if (backupDate > currentDate) {
                    const index = merged.findIndex(p => p.id === exists.id);
                    merged[index] = backupPerson;
                }
            }
        });
        
        return merged;
    }
    
    // Salva backup di emergenza
    saveEmergencyBackup(backup) {
        const emergencyKey = `appunti_emergency_backup_${Date.now()}`;
        localStorage.setItem(emergencyKey, JSON.stringify(backup));
        
        // Mantieni solo l'ultimo backup di emergenza
        this.cleanEmergencyBackups();
    }
    
    // Pulisci backup di emergenza vecchi
    cleanEmergencyBackups() {
        const emergencyKeys = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('appunti_emergency_backup_')) {
                emergencyKeys.push({
                    key,
                    timestamp: parseInt(key.replace('appunti_emergency_backup_', ''))
                });
            }
        }
        
        // Mantieni solo i 2 più recenti
        emergencyKeys.sort((a, b) => b.timestamp - a.timestamp);
        emergencyKeys.slice(2).forEach(backup => {
            localStorage.removeItem(backup.key);
        });
    }
}

// Utilizzo RestoreManager
const restoreManager = new RestoreManager();

// Ripristino da file
function handleBackupFile(event) {
    const file = event.target.files[0];
    if (file) {
        restoreManager.restoreFromFile(file)
            .then(result => {
                console.log('✅ Ripristino completato:', result.message);
                // Ricarica pagina per applicare modifiche
                if (confirm('Ripristino completato. Ricaricare la pagina?')) {
                    location.reload();
                }
            })
            .catch(error => {
                console.error('❌ Errore ripristino:', error.message);
                alert(`Errore ripristino: ${error.message}`);
            });
    }
}
```

## 📱 Migrazione tra Dispositivi

### Esportazione per Migrazione
```javascript
function exportForMigration() {
    const backupManager = new BackupManager();
    const migrationBackup = backupManager.createFullBackup();
    
    // Aggiungi metadati migrazione
    migrationBackup.metadata.purpose = 'migration';
    migrationBackup.metadata.sourceDevice = navigator.userAgent;
    migrationBackup.metadata.sourceURL = window.location.href;
    
    backupManager.downloadBackup(migrationBackup, 'appunti_migration_export.json');
}

// Importazione su nuovo dispositivo
function importFromMigration(file) {
    const restoreManager = new RestoreManager();
    
    restoreManager.restoreFromFile(file)
        .then(() => {
            console.log('✅ Migrazione completata');
            localStorage.setItem('appunti_migrated_from', new Date().toISOString());
            location.reload();
        })
        .catch(error => {
            console.error('❌ Errore migrazione:', error);
        });
}
```

## 🔐 Backup Sicuro

### Crittografia Backup (Opzionale)
```javascript
class SecureBackupManager extends BackupManager {
    constructor(encryptionKey) {
        super();
        this.encryptionKey = encryptionKey;
    }
    
    // Cripta backup
    encryptBackup(backup) {
        if (!this.encryptionKey) return backup;
        
        try {
            const dataString = JSON.stringify(backup);
            const encrypted = this.simpleEncrypt(dataString, this.encryptionKey);
            
            return {
                encrypted: true,
                data: encrypted,
                metadata: backup.metadata
            };
        } catch (error) {
            console.error('Errore crittografia:', error);
            return backup;
        }
    }
    
    // Decripta backup
    decryptBackup(encryptedBackup) {
        if (!encryptedBackup.encrypted) return encryptedBackup;
        
        try {
            const decrypted = this.simpleDecrypt(encryptedBackup.data, this.encryptionKey);
            return JSON.parse(decrypted);
        } catch (error) {
            throw new Error('Errore decrittografia: chiave non valida');
        }
    }
    
    // Crittografia semplice (per demo - usa librerie robuste in produzione)
    simpleEncrypt(text, key) {
        let result = '';
        for (let i = 0; i < text.length; i++) {
            result += String.fromCharCode(
                text.charCodeAt(i) ^ key.charCodeAt(i % key.length)
            );
        }
        return btoa(result);
    }
    
    // Decrittografia semplice
    simpleDecrypt(encryptedText, key) {
        const text = atob(encryptedText);
        let result = '';
        for (let i = 0; i < text.length; i++) {
            result += String.fromCharCode(
                text.charCodeAt(i) ^ key.charCodeAt(i % key.length)
            );
        }
        return result;
    }
}
```

## 📊 Monitoraggio Backup

### Dashboard Backup
```javascript
class BackupDashboard {
    constructor() {
        this.autoBackup = new AutoBackupManager();
    }
    
    // Mostra stato backup
    showBackupStatus() {
        const status = {
            lastBackup: localStorage.getItem('appunti_last_backup'),
            lastRestore: localStorage.getItem('appunti_last_restore'),
            backupCount: this.getBackupCount(),
            totalSize: this.getTotalBackupSize(),
            autoBackupEnabled: this.autoBackup.config.enabled,
            nextBackup: this.getNextBackupTime()
        };
        
        console.table(status);
        return status;
    }
    
    // Conta backup disponibili
    getBackupCount() {
        let count = 0;
        for (let i = 0; i < localStorage.length; i++) {
            if (localStorage.key(i).startsWith('appunti_backup_')) {
                count++;
            }
        }
        return count;
    }
    
    // Calcola dimensione totale backup
    getTotalBackupSize() {
        let totalSize = 0;
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('appunti_backup_')) {
                totalSize += localStorage.getItem(key).length;
            }
        }
        return this.formatBytes(totalSize);
    }
    
    // Calcola prossimo backup
    getNextBackupTime() {
        const lastBackup = localStorage.getItem('appunti_last_backup');
        if (!lastBackup) return 'Subito';
        
        const nextTime = parseInt(lastBackup) + this.autoBackup.config.interval;
        const now = Date.now();
        
        if (nextTime <= now) return 'Subito';
        
        const diff = nextTime - now;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        return `${hours}h ${minutes}m`;
    }
    
    formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}

// Utilizzo dashboard
const dashboard = new BackupDashboard();
dashboard.showBackupStatus();
```

## 🚨 Procedure di Emergenza

### Recupero Dati Corrotti
```javascript
function emergencyDataRecovery() {
    console.log('🚨 Avvio procedura recupero di emergenza...');
    
    // 1. Verifica backup di emergenza
    const emergencyBackups = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('appunti_emergency_backup_')) {
            emergencyBackups.push(key);
        }
    }
    
    if (emergencyBackups.length > 0) {
        console.log(`📦 Trovati ${emergencyBackups.length} backup di emergenza`);
        
        // Usa il più recente
        const latestBackup = emergencyBackups.sort().pop();
        const backupData = JSON.parse(localStorage.getItem(latestBackup));
        
        const restoreManager = new RestoreManager();
        return restoreManager.performRestore(backupData, { overwrite: true });
    }
    
    // 2. Verifica backup automatici
    const autoBackups = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('appunti_backup_')) {
            autoBackups.push(key);
        }
    }
    
    if (autoBackups.length > 0) {
        console.log(`📦 Trovati ${autoBackups.length} backup automatici`);
        
        // Usa il più recente
        const latestBackup = autoBackups.sort().pop();
        const backupData = JSON.parse(localStorage.getItem(latestBackup));
        
        const restoreManager = new RestoreManager();
        return restoreManager.performRestore(backupData, { overwrite: true });
    }
    
    console.log('❌ Nessun backup disponibile per il recupero');
    return false;
}
```

## 📋 Checklist Backup

### Checklist Settimanale
- [ ] Verificare backup automatico attivo
- [ ] Controllare spazio disponibile localStorage
- [ ] Testare procedura ripristino
- [ ] Pulire backup vecchi
- [ ] Verificare integrità dati

### Checklist Mensile
- [ ] Backup completo manuale
- [ ] Test migrazione su dispositivo diverso
- [ ] Aggiornare documentazione backup
- [ ] Verificare compatibilità versioni
- [ ] Backup su storage esterno

### Checklist Prima di Aggiornamenti
- [ ] Backup completo pre-aggiornamento
- [ ] Verificare compatibilità backup
- [ ] Testare ripristino
- [ ] Documentare modifiche

---

**Backup Sicuro, Dati Protetti! 💾🔒**