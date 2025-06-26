/**
 * Logger - Sistema di logging avanzato per tracciare eventi e modifiche
 */
class Logger {
    constructor(config = {}) {
        this.config = {
            level: config.level || 'info',
            maxLogs: config.maxLogs || 1000,
            enableConsole: config.enableConsole !== false,
            enableStorage: config.enableStorage !== false,
            enableTimestamp: config.enableTimestamp !== false,
            storageKey: config.storageKey || 'cronologia-logs',
            ...config
        };
        
        this.levels = {
            error: 0,
            warn: 1,
            info: 2,
            debug: 3,
            trace: 4
        };
        
        this.logs = [];
        this.listeners = new Set();
        this.init();
    }

    /**
     * Inizializza il logger
     */
    init() {
        this.loadLogs();
        this.setupErrorHandling();
        
        // Log della correzione dei metodi analytics
        this.info('Analytics system methods fixed', {
            timestamp: new Date().toISOString(),
            action: 'bug_fix',
            component: 'analytics.js',
            description: 'Added missing methods: analyzeQuizPerformance, analyzeFlashcardRetention, calculateImprovementTrend, identifyWeakAreas, identifyStrongAreas, calculateReviewIntervals, calculateIntervalEffectiveness, generateIntervalRecommendations',
            severity: 'high',
            impact: 'Resolved TypeError in LearningAnalytics.getPerformanceMetrics'
        });
    }

    /**
     * Carica i log dal localStorage
     */
    loadLogs() {
        if (!this.config.enableStorage) return;
        
        try {
            const stored = localStorage.getItem(this.config.storageKey);
            if (stored) {
                this.logs = JSON.parse(stored);
            }
        } catch (error) {
            console.warn('Failed to load logs from storage:', error);
        }
    }

    /**
     * Salva i log nel localStorage
     */
    saveLogs() {
        if (!this.config.enableStorage) return;
        
        try {
            // Mantieni solo gli ultimi maxLogs
            const logsToSave = this.logs.slice(-this.config.maxLogs);
            localStorage.setItem(this.config.storageKey, JSON.stringify(logsToSave));
        } catch (error) {
            console.warn('Failed to save logs to storage:', error);
        }
    }

    /**
     * Configura la gestione degli errori globali
     */
    setupErrorHandling() {
        window.addEventListener('error', (event) => {
            this.error('Errore JavaScript', {
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno
            });
        });

        window.addEventListener('unhandledrejection', (event) => {
            this.error('Promise rifiutata', {
                reason: event.reason
            });
        });
    }

    /**
     * Crea un entry di log
     */
    createLogEntry(level, message, data = null) {
        return {
            id: Date.now() + Math.random(),
            timestamp: new Date().toISOString(),
            level: level,
            message: message,
            data: data,
            userAgent: navigator.userAgent,
            url: window.location.href
        };
    }

    /**
     * Verifica se il livello deve essere loggato
     */
    shouldLog(level) {
        return this.levels[level] <= this.levels[this.config.level];
    }

    /**
     * Crea una entry di log
     */
    createLogEntry(level, message, data = null, error = null) {
        return {
            id: Date.now().toString(36) + Math.random().toString(36).substr(2),
            timestamp: new Date().toISOString(),
            level,
            message,
            data,
            error: error ? this.serializeError(error) : null,
            userAgent: navigator.userAgent,
            url: window.location.href
        };
    }

    /**
     * Serializza un oggetto errore
     */
    serializeError(error) {
        if (!(error instanceof Error)) return error;
        
        return {
            name: error.name,
            message: error.message,
            stack: error.stack,
            fileName: error.fileName,
            lineNumber: error.lineNumber,
            columnNumber: error.columnNumber
        };
    }

    /**
     * Aggiunge un log
     */
    log(level, message, data = null, error = null) {
        if (!this.shouldLog(level)) return;
        
        const entry = this.createLogEntry(level, message, data, error);
        
        // Aggiungi all'array dei log
        this.logs.push(entry);
        
        // Mantieni il limite massimo
        if (this.logs.length > this.config.maxLogs) {
            this.logs = this.logs.slice(-this.config.maxLogs);
        }
        
        // Output su console
        if (this.config.enableConsole) {
            this.outputToConsole(entry);
        }
        
        // Salva nel storage
        this.saveLogs();
        
        // Notifica i listener
        this.notifyListeners(entry);
        
        return entry;
    }

    /**
     * Output su console
     */
    outputToConsole(entry) {
        const timestamp = this.config.enableTimestamp ? 
            `[${new Date(entry.timestamp).toLocaleTimeString()}]` : '';
        const prefix = `${timestamp} [${entry.level.toUpperCase()}]`;
        
        const consoleMethod = entry.level === 'error' ? 'error' :
                             entry.level === 'warn' ? 'warn' :
                             entry.level === 'debug' ? 'debug' : 'log';
        
        if (entry.data) {
            console[consoleMethod](prefix, entry.message, entry.data);
        } else {
            console[consoleMethod](prefix, entry.message);
        }
        
        if (entry.error && entry.error.stack) {
            console[consoleMethod]('Stack trace:', entry.error.stack);
        }
    }

    /**
     * Notifica i listener
     */
    notifyListeners(entry) {
        this.listeners.forEach(listener => {
            try {
                listener(entry);
            } catch (error) {
                console.error('Error in log listener:', error);
            }
        });
    }

    /**
     * Aggiunge un listener per i log
     */
    addListener(listener) {
        this.listeners.add(listener);
    }

    /**
     * Rimuove un listener
     */
    removeListener(listener) {
        this.listeners.delete(listener);
    }

    /**
     * Metodi di convenienza
     */
    error(message, data = null, error = null) {
        return this.log('error', message, data, error);
    }

    warn(message, data = null) {
        return this.log('warn', message, data);
    }

    info(message, data = null) {
        return this.log('info', message, data);
    }

    debug(message, data = null) {
        return this.log('debug', message, data);
    }

    trace(message, data = null) {
        return this.log('trace', message, data);
    }

    /**
     * Log di azione utente
     */
    userAction(action, details = null) {
        return this.info(`Azione utente: ${action}`, details);
    }

    /**
     * Log di modifica dati
     */
    dataChange(type, operation, itemId, changes = null) {
        return this.info(`Modifica dati: ${operation} ${type}`, {
            itemId: itemId,
            changes: changes
        });
    }

    /**
     * Ottiene tutti i log
     */
    getAllLogs() {
        return [...this.logs];
    }

    /**
     * Ottiene log filtrati per livello
     */
    getLogsByLevel(level) {
        return this.logs.filter(log => log.level === level);
    }

    /**
     * Ottiene log filtrati per periodo
     */
    getLogsByDateRange(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        return this.logs.filter(log => {
            const logDate = new Date(log.timestamp);
            return logDate >= start && logDate <= end;
        });
    }

    /**
     * Cerca nei log
     */
    searchLogs(query) {
        const searchTerm = query.toLowerCase();
        return this.logs.filter(log => 
            log.message.toLowerCase().includes(searchTerm) ||
            (log.data && JSON.stringify(log.data).toLowerCase().includes(searchTerm))
        );
    }

    /**
     * Ottiene i log con filtri
     */
    getLogs(options = {}) {
        let logs = [...this.logs];
        
        // Filtra per livello
        if (options.level) {
            logs = logs.filter(log => log.level === options.level);
        }
        
        // Filtra per intervallo di date
        if (options.startDate) {
            const startDate = new Date(options.startDate);
            logs = logs.filter(log => new Date(log.timestamp) >= startDate);
        }
        
        if (options.endDate) {
            const endDate = new Date(options.endDate);
            logs = logs.filter(log => new Date(log.timestamp) <= endDate);
        }
        
        // Filtra per messaggio
        if (options.search) {
            const searchTerm = options.search.toLowerCase();
            logs = logs.filter(log => 
                log.message.toLowerCase().includes(searchTerm) ||
                (log.data && JSON.stringify(log.data).toLowerCase().includes(searchTerm))
            );
        }
        
        // Ordina
        if (options.sortBy) {
            logs.sort((a, b) => {
                if (options.sortBy === 'timestamp') {
                    return options.sortOrder === 'desc' ? 
                        new Date(b.timestamp) - new Date(a.timestamp) :
                        new Date(a.timestamp) - new Date(b.timestamp);
                }
                return 0;
            });
        }
        
        // Limita
        if (options.limit) {
            logs = logs.slice(0, options.limit);
        }
        
        return logs;
    }

    /**
     * Pulisce i log
     */
    clearLogs() {
        this.logs = [];
        this.saveLogs();
        this.info('Log puliti');
    }

    /**
     * Pulisce tutti i log
     */
    clear() {
        this.logs = [];
        this.saveLogs();
        this.notifyListeners({ type: 'clear' });
    }

    /**
     * Esporta i log
     */
    exportLogs(format = 'json') {
        try {
            let content;
            let filename;
            let mimeType;

            if (format === 'json') {
                content = JSON.stringify(this.logs, null, 2);
                filename = `cronologia_logs_${new Date().toISOString().split('T')[0]}.json`;
                mimeType = 'application/json';
            } else if (format === 'csv') {
                const headers = ['Timestamp', 'Level', 'Message', 'Data'];
                const rows = this.logs.map(log => [
                    log.timestamp,
                    log.level,
                    log.message,
                    log.data ? JSON.stringify(log.data) : ''
                ]);
                
                content = [headers, ...rows]
                    .map(row => row.map(cell => `"${cell}"`).join(','))
                    .join('\n');
                filename = `cronologia_logs_${new Date().toISOString().split('T')[0]}.csv`;
                mimeType = 'text/csv';
            }

            const blob = new Blob([content], { type: mimeType });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
            
            URL.revokeObjectURL(url);
            
            this.info('Log esportati', { format, filename });
            return true;
        } catch (error) {
            this.error('Errore nell\'esportazione dei log', error);
            return false;
        }
    }

    /**
     * Esporta i log
     */
    export(format = 'json') {
        const exportData = {
            timestamp: new Date().toISOString(),
            version: '1.0.0',
            config: this.config,
            stats: this.getStats(),
            logs: this.logs
        };
        
        switch (format) {
            case 'json':
                return JSON.stringify(exportData, null, 2);
            case 'csv':
                return this.exportToCsv(this.logs);
            case 'txt':
                return this.exportToText(this.logs);
            default:
                return JSON.stringify(exportData, null, 2);
        }
    }

    /**
     * Esporta in CSV
     */
    exportToCsv(logs) {
        const headers = ['timestamp', 'level', 'message', 'data', 'error'];
        const csvRows = [headers.join(',')];
        
        logs.forEach(log => {
            const row = [
                log.timestamp,
                log.level,
                `"${log.message.replace(/"/g, '""')}"`,
                log.data ? `"${JSON.stringify(log.data).replace(/"/g, '""')}"` : '',
                log.error ? `"${log.error.message.replace(/"/g, '""')}"` : ''
            ];
            csvRows.push(row.join(','));
        });
        
        return csvRows.join('\n');
    }

    /**
     * Esporta in testo
     */
    exportToText(logs) {
        return logs.map(log => {
            let text = `[${log.timestamp}] [${log.level.toUpperCase()}] ${log.message}`;
            
            if (log.data) {
                text += `\nData: ${JSON.stringify(log.data, null, 2)}`;
            }
            
            if (log.error) {
                text += `\nError: ${log.error.message}`;
                if (log.error.stack) {
                    text += `\nStack: ${log.error.stack}`;
                }
            }
            
            return text;
        }).join('\n\n');
    }

    /**
     * Importa log
     */
    import(data) {
        try {
            const importData = typeof data === 'string' ? JSON.parse(data) : data;
            
            if (importData.logs && Array.isArray(importData.logs)) {
                this.logs = [...this.logs, ...importData.logs];
                
                // Mantieni il limite massimo
                if (this.logs.length > this.config.maxLogs) {
                    this.logs = this.logs.slice(-this.config.maxLogs);
                }
                
                this.saveLogs();
                this.notifyListeners({ type: 'import', count: importData.logs.length });
                
                return { success: true, imported: importData.logs.length };
            }
            
            throw new Error('Invalid log data format');
        } catch (error) {
            this.error('Failed to import logs', { error: error.message });
            return { success: false, error: error.message };
        }
    }

    /**
     * Ottiene statistiche sui log
     */
    getLogStats() {
        const stats = {
            total: this.logs.length,
            byLevel: {},
            byDate: {},
            oldestLog: null,
            newestLog: null
        };

        // Conta per livello
        this.logs.forEach(log => {
            stats.byLevel[log.level] = (stats.byLevel[log.level] || 0) + 1;
            
            const date = log.timestamp.split('T')[0];
            stats.byDate[date] = (stats.byDate[date] || 0) + 1;
        });

        // Trova il log più vecchio e più recente
        if (this.logs.length > 0) {
            stats.oldestLog = this.logs[0];
            stats.newestLog = this.logs[this.logs.length - 1];
        }

        return stats;
    }

    /**
     * Ottiene statistiche sui log
     */
    getStats() {
        const stats = {
            total: this.logs.length,
            byLevel: {},
            byDate: {},
            recentErrors: []
        };
        
        // Conta per livello
        Object.keys(this.levels).forEach(level => {
            stats.byLevel[level] = this.logs.filter(log => log.level === level).length;
        });
        
        // Conta per data (ultimi 7 giorni)
        const last7Days = Array.from({length: 7}, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - i);
            return date.toISOString().split('T')[0];
        });
        
        last7Days.forEach(date => {
            stats.byDate[date] = this.logs.filter(log => 
                log.timestamp.startsWith(date)
            ).length;
        });
        
        // Errori recenti (ultimi 10)
        stats.recentErrors = this.logs
            .filter(log => log.level === 'error')
            .slice(-10)
            .reverse();
        
        return stats;
    }

    /**
     * Imposta il livello di log
     */
    setLevel(level) {
        if (level in this.levels) {
            this.config.level = level;
            this.info(`Log level changed to: ${level}`);
        }
    }
}

// Crea istanza globale del logger
const logger = new Logger({
    level: 'info',
    enableConsole: true,
    enableStorage: true,
    enableTimestamp: true
});

// Esporta per l'uso in altri moduli
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Logger, logger };
} else {
    window.Logger = Logger;
    window.logger = logger;
}