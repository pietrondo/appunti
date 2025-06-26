/**
 * Configuration Manager for Cronologia Storica
 * Manages application settings and configuration
 */

class ConfigManager {
    constructor() {
        this.defaultConfig = {
            // Application settings
            app: {
                name: 'Cronologia Storica',
                version: '1.0.0',
                language: 'it',
                theme: 'light',
                autoSave: true,
                autoSaveInterval: 30000, // 30 seconds
                maxBackups: 10
            },
            
            // Study system settings
            study: {
                defaultSessionLength: 25, // minutes
                breakLength: 5, // minutes
                longBreakLength: 15, // minutes
                sessionsBeforeLongBreak: 4,
                enableNotifications: true,
                enableSounds: true,
                spacedRepetitionAlgorithm: 'sm2',
                difficultyLevels: ['facile', 'medio', 'difficile'],
                gamificationEnabled: true,
                pointsPerCorrectAnswer: 10,
                pointsPerSession: 50,
                streakBonus: 5
            },
            
            // Analytics settings
            analytics: {
                enabled: true,
                trackingEnabled: true,
                retentionDays: 365,
                updateInterval: 30000, // 30 seconds
                enablePredictions: true,
                enableRecommendations: true,
                privacyMode: false
            },
            
            // Mind map settings
            mindMap: {
                defaultTemplate: 'historical-period',
                autoLayout: true,
                enableCollaboration: false,
                maxNodes: 100,
                exportFormats: ['json', 'png', 'svg'],
                defaultZoom: 1.0,
                gridEnabled: true,
                snapToGrid: true
            },
            
            // Timeline settings
            timeline: {
                defaultView: 'chronological',
                enableFilters: true,
                maxEventsPerPage: 50,
                enableSearch: true,
                enableExport: true,
                dateFormat: 'DD/MM/YYYY',
                enableCategories: true
            },
            
            // Search settings
            search: {
                enableAdvancedSearch: true,
                maxResults: 100,
                enableFuzzySearch: true,
                searchDelay: 300, // milliseconds
                enableHighlighting: true,
                caseSensitive: false
            },
            
            // Storage settings
            storage: {
                provider: 'localStorage',
                encryptionEnabled: false,
                compressionEnabled: true,
                maxStorageSize: 50 * 1024 * 1024, // 50MB
                enableCloudSync: false,
                syncInterval: 300000 // 5 minutes
            },
            
            // UI settings
            ui: {
                enableAnimations: true,
                animationDuration: 300,
                enableTooltips: true,
                tooltipDelay: 500,
                enableKeyboardShortcuts: true,
                compactMode: false,
                showWelcomeMessage: true
            },
            
            // Accessibility settings
            accessibility: {
                highContrast: false,
                largeText: false,
                reduceMotion: false,
                screenReaderSupport: true,
                keyboardNavigation: true,
                focusIndicators: true
            },
            
            // Performance settings
            performance: {
                enableLazyLoading: true,
                enableCaching: true,
                cacheSize: 10 * 1024 * 1024, // 10MB
                enableDebugMode: false,
                enableProfiling: false,
                maxConcurrentRequests: 5
            }
        };
        
        this.config = this.loadConfig();
        this.listeners = new Map();
    }
    
    // Load configuration from storage
    loadConfig() {
        try {
            const stored = localStorage.getItem('cronologia-config');
            if (stored) {
                const parsedConfig = JSON.parse(stored);
                return this.mergeConfig(this.defaultConfig, parsedConfig);
            }
        } catch (error) {
            console.warn('Failed to load config from storage:', error);
        }
        
        return { ...this.defaultConfig };
    }
    
    // Save configuration to storage
    saveConfig() {
        try {
            localStorage.setItem('cronologia-config', JSON.stringify(this.config));
            this.notifyListeners('config-saved', this.config);
            return true;
        } catch (error) {
            console.error('Failed to save config to storage:', error);
            return false;
        }
    }
    
    // Merge configurations (deep merge)
    mergeConfig(defaultConfig, userConfig) {
        const merged = { ...defaultConfig };
        
        for (const key in userConfig) {
            if (userConfig.hasOwnProperty(key)) {
                if (typeof userConfig[key] === 'object' && userConfig[key] !== null && !Array.isArray(userConfig[key])) {
                    merged[key] = this.mergeConfig(defaultConfig[key] || {}, userConfig[key]);
                } else {
                    merged[key] = userConfig[key];
                }
            }
        }
        
        return merged;
    }
    
    // Get configuration value
    get(path, defaultValue = null) {
        const keys = path.split('.');
        let current = this.config;
        
        for (const key of keys) {
            if (current && typeof current === 'object' && key in current) {
                current = current[key];
            } else {
                return defaultValue;
            }
        }
        
        return current;
    }
    
    // Set configuration value
    set(path, value, save = true) {
        const keys = path.split('.');
        let current = this.config;
        
        for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i];
            if (!(key in current) || typeof current[key] !== 'object') {
                current[key] = {};
            }
            current = current[key];
        }
        
        const lastKey = keys[keys.length - 1];
        const oldValue = current[lastKey];
        current[lastKey] = value;
        
        if (save) {
            this.saveConfig();
        }
        
        this.notifyListeners('config-changed', {
            path,
            oldValue,
            newValue: value
        });
        
        return true;
    }
    
    // Reset configuration to defaults
    reset(save = true) {
        this.config = { ...this.defaultConfig };
        
        if (save) {
            this.saveConfig();
        }
        
        this.notifyListeners('config-reset', this.config);
        return true;
    }
    
    // Reset specific section to defaults
    resetSection(section, save = true) {
        if (section in this.defaultConfig) {
            this.config[section] = { ...this.defaultConfig[section] };
            
            if (save) {
                this.saveConfig();
            }
            
            this.notifyListeners('config-section-reset', {
                section,
                config: this.config[section]
            });
            
            return true;
        }
        
        return false;
    }
    
    // Get all configuration
    getAll() {
        return { ...this.config };
    }
    
    // Update multiple configuration values
    update(updates, save = true) {
        const changes = [];
        
        for (const [path, value] of Object.entries(updates)) {
            const oldValue = this.get(path);
            this.set(path, value, false);
            changes.push({ path, oldValue, newValue: value });
        }
        
        if (save) {
            this.saveConfig();
        }
        
        this.notifyListeners('config-bulk-update', changes);
        return true;
    }
    
    // Validate configuration
    validate() {
        const errors = [];
        
        // Validate app settings
        if (!this.config.app.name || typeof this.config.app.name !== 'string') {
            errors.push('app.name must be a non-empty string');
        }
        
        if (!this.config.app.version || typeof this.config.app.version !== 'string') {
            errors.push('app.version must be a non-empty string');
        }
        
        // Validate study settings
        if (this.config.study.defaultSessionLength < 1 || this.config.study.defaultSessionLength > 120) {
            errors.push('study.defaultSessionLength must be between 1 and 120 minutes');
        }
        
        // Validate storage settings
        if (this.config.storage.maxStorageSize < 1024 * 1024) {
            errors.push('storage.maxStorageSize must be at least 1MB');
        }
        
        return {
            valid: errors.length === 0,
            errors
        };
    }
    
    // Export configuration
    export() {
        return {
            timestamp: new Date().toISOString(),
            version: this.config.app.version,
            config: this.config
        };
    }
    
    // Import configuration
    import(configData, merge = true) {
        try {
            if (typeof configData === 'string') {
                configData = JSON.parse(configData);
            }
            
            if (!configData.config) {
                throw new Error('Invalid configuration format');
            }
            
            if (merge) {
                this.config = this.mergeConfig(this.config, configData.config);
            } else {
                this.config = { ...configData.config };
            }
            
            const validation = this.validate();
            if (!validation.valid) {
                console.warn('Imported configuration has validation errors:', validation.errors);
            }
            
            this.saveConfig();
            this.notifyListeners('config-imported', configData);
            
            return { success: true, validation };
        } catch (error) {
            console.error('Failed to import configuration:', error);
            return { success: false, error: error.message };
        }
    }
    
    // Add configuration change listener
    addListener(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }
        this.listeners.get(event).add(callback);
    }
    
    // Remove configuration change listener
    removeListener(event, callback) {
        if (this.listeners.has(event)) {
            this.listeners.get(event).delete(callback);
        }
    }
    
    // Notify listeners
    notifyListeners(event, data) {
        if (this.listeners.has(event)) {
            this.listeners.get(event).forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error('Error in config listener:', error);
                }
            });
        }
    }
    
    // Get configuration schema for UI generation
    getSchema() {
        return {
            app: {
                title: 'Impostazioni Applicazione',
                fields: {
                    name: { type: 'text', label: 'Nome Applicazione', readonly: true },
                    version: { type: 'text', label: 'Versione', readonly: true },
                    language: { type: 'select', label: 'Lingua', options: ['it', 'en'] },
                    theme: { type: 'select', label: 'Tema', options: ['light', 'dark'] },
                    autoSave: { type: 'boolean', label: 'Salvataggio Automatico' },
                    autoSaveInterval: { type: 'number', label: 'Intervallo Salvataggio (ms)', min: 5000, max: 300000 }
                }
            },
            study: {
                title: 'Impostazioni Studio',
                fields: {
                    defaultSessionLength: { type: 'number', label: 'Durata Sessione (min)', min: 1, max: 120 },
                    breakLength: { type: 'number', label: 'Durata Pausa (min)', min: 1, max: 30 },
                    enableNotifications: { type: 'boolean', label: 'Abilita Notifiche' },
                    enableSounds: { type: 'boolean', label: 'Abilita Suoni' },
                    gamificationEnabled: { type: 'boolean', label: 'Abilita Gamification' }
                }
            },
            analytics: {
                title: 'Impostazioni Analytics',
                fields: {
                    enabled: { type: 'boolean', label: 'Abilita Analytics' },
                    trackingEnabled: { type: 'boolean', label: 'Abilita Tracking' },
                    enablePredictions: { type: 'boolean', label: 'Abilita Predizioni' },
                    enableRecommendations: { type: 'boolean', label: 'Abilita Raccomandazioni' },
                    privacyMode: { type: 'boolean', label: 'Modalità Privacy' }
                }
            },
            ui: {
                title: 'Impostazioni Interfaccia',
                fields: {
                    enableAnimations: { type: 'boolean', label: 'Abilita Animazioni' },
                    enableTooltips: { type: 'boolean', label: 'Abilita Tooltip' },
                    compactMode: { type: 'boolean', label: 'Modalità Compatta' },
                    showWelcomeMessage: { type: 'boolean', label: 'Mostra Messaggio di Benvenuto' }
                }
            },
            accessibility: {
                title: 'Impostazioni Accessibilità',
                fields: {
                    highContrast: { type: 'boolean', label: 'Alto Contrasto' },
                    largeText: { type: 'boolean', label: 'Testo Grande' },
                    reduceMotion: { type: 'boolean', label: 'Riduci Movimento' },
                    screenReaderSupport: { type: 'boolean', label: 'Supporto Screen Reader' }
                }
            }
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ConfigManager;
} else {
    window.ConfigManager = ConfigManager;
}