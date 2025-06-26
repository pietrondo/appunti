/**
 * App Manager - Gestisce l'applicazione principale e la navigazione
 */
class AppManager {
    constructor() {
        this.currentTab = 'timeline';
        this.isInitialized = false;
        this.managers = {};
        this.configManager = new ConfigManager();
        this.logger = logger; // Usa l'istanza globale del logger
        this.storage = new StorageManager();
        this.eventManager = new EventsManager();
        this.peopleManager = new PeopleManager(this.storage);
        this.timelineManager = new TimelineManager(this.storage);
        this.searchManager = new SearchManager(this.storage);
        this.studyManager = null;
        this.mindMapManager = null;
        this.analyticsManager = null;
        this.learningAnalytics = null;
        this.importManager = null;
        this.exportManager = null;
        
        this.init();
    }

    /**
     * Inizializza l'applicazione
     */
    async init() {
        try {
            // Attendi che il DOM sia caricato
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.initializeApp());
            } else {
                this.initializeApp();
            }
        } catch (error) {
            console.error('Errore nell\'inizializzazione dell\'app:', error);
            this.showErrorMessage('Errore nell\'inizializzazione dell\'applicazione');
        }
    }

    /**
     * Inizializza l'applicazione dopo il caricamento del DOM
     */
    async initializeApp() {
        try {
            // Inizializza storage
            this.initializeStorage();
            
            // Inizializza navigazione
            this.initializeNavigation();
            
            // Inizializza managers
            this.initializeManagers();
            
            // Carica dati iniziali
            this.loadInitialData();
            
            // Initialize study system
            this.initializeStudySystem();
            
            // Initialize mind map system
        this.initializeMindMapSystem();
        
        // Initialize analytics system
            this.initializeAnalyticsSystem();
            
            // Initialize import system
            this.initializeImportSystem();
            
            // Initialize export system
            this.initializeExportSystem();
            
            // Imposta tab iniziale
            this.setActiveTab(this.currentTab);
            
            // Inizializza eventi globali
            this.bindGlobalEvents();
            
            // Mostra statistiche iniziali
            this.updateStats();
            
            this.isInitialized = true;
            console.log('Applicazione inizializzata con successo');
            
        } catch (error) {
            console.error('Errore nell\'inizializzazione:', error);
            this.showErrorMessage('Errore nell\'inizializzazione dell\'applicazione');
        }
    }

    /**
     * Inizializza il sistema di storage
     */
    initializeStorage() {
        if (typeof storageManager === 'undefined') {
            throw new Error('StorageManager non trovato');
        }
        
        // Verifica che il storage funzioni
        try {
            storageManager.getEvents();
            storageManager.getPeople();
        } catch (error) {
            console.warn('Errore nel caricamento dati, inizializzazione storage vuoto:', error);
            storageManager.initializeEmptyStorage();
        }
    }

    /**
     * Inizializza la navigazione tra tab
     */
    initializeNavigation() {
        const tabButtons = document.querySelectorAll('[data-tab]');
        const tabContents = document.querySelectorAll('.tab-content');
        
        // Collega eventi ai bottoni delle tab
        tabButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const tabName = button.dataset.tab;
                this.setActiveTab(tabName);
            });
        });
        
        // Nasconde tutti i contenuti delle tab inizialmente
        tabContents.forEach(content => {
            content.style.display = 'none';
        });
    }

    /**
     * Inizializza i managers
     */
    initializeManagers() {
        // Verifica che i managers siano disponibili
        const requiredManagers = ['eventsManager', 'peopleManager', 'timelineManager', 'searchManager'];
        
        requiredManagers.forEach(managerName => {
            if (typeof window[managerName] !== 'undefined') {
                this.managers[managerName] = window[managerName];
                console.log(`${managerName} inizializzato`);
            } else {
                console.warn(`${managerName} non trovato`);
            }
        });
    }

    initializeStudySystem() {
        // Initialize study system when available
        if (typeof StudyManager !== 'undefined') {
            this.studyManager = new StudyManager();
            this.updateStudyPreview();
        }
    }
    
    initializeMindMapSystem() {
        // Initialize mind map manager if available
        if (window.MindMapManager) {
            window.mindMapManager = new window.MindMapManager();
            console.log('Mind map system initialized');
        }
    }
    
    initializeAnalyticsSystem() {
        if (typeof LearningAnalytics !== 'undefined' && typeof AnalyticsManager !== 'undefined') {
            this.learningAnalytics = new LearningAnalytics();
            this.analyticsManager = new AnalyticsManager();
            console.log('Analytics system initialized');
        }
    }
    
    initializeImportSystem() {
        if (typeof ImportManager !== 'undefined') {
            this.importManager = new ImportManager();
            this.importManager.setManagers(this.eventManager, this.peopleManager);
            
            // Collega eventi dell'interfaccia
            this.bindImportEvents();
            
            console.log('Import system initialized');
        }
    }
    
    bindImportEvents() {
        // Pulsante trigger per aprire import
        const importTrigger = document.getElementById('import-trigger');
        if (importTrigger) {
            importTrigger.addEventListener('click', () => {
                this.importManager.openImportModal();
            });
        }
        
        // Pulsante per aprire import dal tab
        const openImportModal = document.getElementById('open-import-modal');
        if (openImportModal) {
            openImportModal.addEventListener('click', () => {
                this.importManager.openImportModal();
            });
        }
        
        // Pulsante per mostrare prompt ChatGPT
        const showPromptBtn = document.getElementById('show-chatgpt-prompt');
        if (showPromptBtn) {
            showPromptBtn.addEventListener('click', () => {
                this.importManager.showChatGPTPrompt();
            });
        }
    }
    
    /**
     * Inizializza il sistema di export
     */
    initializeExportSystem() {
        if (typeof ExportManager !== 'undefined') {
            this.exportManager = new ExportManager();
            this.exportManager.setManagers(this.storage, this.logger);
            
            // Collega eventi dell'interfaccia
            this.bindExportEvents();
            
            console.log('Export system initialized');
        }
    }
    
    bindExportEvents() {
        // Pulsante trigger per aprire export
        const exportTrigger = document.getElementById('export-trigger');
        if (exportTrigger) {
            exportTrigger.addEventListener('click', () => {
                this.exportManager.openExportModal();
            });
        }
    }
    
    initializeAnalyticsSystem() {
        if (typeof LearningAnalytics !== 'undefined') {
            this.learningAnalytics = new LearningAnalytics(this.storage);
            this.analyticsManager = new AnalyticsManager(this.learningAnalytics);
            console.log('Analytics system initialized');
            
            // Update analytics preview
            this.updateAnalyticsPreview();
        }
    }
    
    updateAnalyticsPreview() {
        if (this.learningAnalytics) {
            const dashboardData = this.learningAnalytics.generateDashboardData();
            
            // Update preview elements if they exist
            const previewElements = {
                'analytics-sessions': dashboardData.overview?.totalSessions || 0,
                'analytics-accuracy': Math.round((dashboardData.performance?.overallAccuracy || 0)) + '%',
                'analytics-streak': dashboardData.overview?.streakDays || 0
            };
            
            Object.entries(previewElements).forEach(([id, value]) => {
                const element = document.getElementById(id);
                if (element) {
                    element.textContent = value;
                }
            });
        }
    }
    
    updateStudyPreview() {
        if (!this.studyManager) return;
        
        const stats = this.studyManager.getStudyStatistics();
        const gamification = this.studyManager.gamification;
        
        // Update preview stats
        const levelEl = document.getElementById('preview-level');
        const streakEl = document.getElementById('preview-streak');
        const cardsEl = document.getElementById('preview-cards');
        const accuracyEl = document.getElementById('preview-accuracy');
        
        if (levelEl) levelEl.textContent = gamification.getCurrentLevel();
        if (streakEl) streakEl.textContent = stats.currentStreak || 0;
        if (cardsEl) cardsEl.textContent = stats.totalCardsStudied || 0;
        if (accuracyEl) accuracyEl.textContent = `${Math.round(stats.overallAccuracy || 0)}%`;
    }

    /**
     * Carica i dati iniziali
     */
    loadInitialData() {
        // Renderizza timeline
        if (this.managers.timelineManager) {
            this.managers.timelineManager.renderTimeline();
        }
        
        // Renderizza persone
        if (this.managers.peopleManager) {
            this.managers.peopleManager.renderPeople();
        }
        
        // Renderizza eventi
        if (this.managers.eventsManager) {
            this.managers.eventsManager.renderEvents();
        }
    }

    /**
     * Imposta la tab attiva
     */
    setActiveTab(tabName) {
        // Aggiorna bottoni
        const tabButtons = document.querySelectorAll('[data-tab]');
        tabButtons.forEach(button => {
            if (button.dataset.tab === tabName) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
        
        // Aggiorna contenuti
        const tabContents = document.querySelectorAll('.tab-content');
        tabContents.forEach(content => {
            if (content.id === `${tabName}-tab`) {
                content.style.display = 'block';
                content.classList.add('active');
            } else {
                content.style.display = 'none';
                content.classList.remove('active');
            }
        });
        
        this.currentTab = tabName;
        
        // Aggiorna URL senza ricaricare la pagina
        if (history.pushState) {
            const newUrl = `${window.location.pathname}#${tabName}`;
            history.pushState({ tab: tabName }, '', newUrl);
        }
        
        // Update study preview if switching to study tab
        if (tabName === 'study') {
            this.updateStudyPreview();
        }
        
        // Trigger evento di cambio tab
        this.onTabChange(tabName);
    }

    /**
     * Gestisce il cambio di tab
     */
    onTabChange(tabName) {
        // Aggiorna dati quando necessario
        switch (tabName) {
            case 'timeline':
                if (this.managers.timelineManager) {
                    this.managers.timelineManager.renderTimeline();
                }
                break;
            case 'events':
                if (this.managers.eventsManager) {
                    this.managers.eventsManager.renderEvents();
                }
                break;
            case 'people':
                if (this.managers.peopleManager) {
                    this.managers.peopleManager.renderPeople();
                }
                break;
        }
        
        // Aggiorna statistiche
        this.updateStats();
        
        // Dispatch evento personalizzato
        document.dispatchEvent(new CustomEvent('tabChanged', {
            detail: { tabName, previousTab: this.currentTab }
        }));
    }

    /**
     * Collega eventi globali
     */
    bindGlobalEvents() {
        // Gestione del browser back/forward
        window.addEventListener('popstate', (e) => {
            const hash = window.location.hash.substring(1);
            if (hash && this.isValidTab(hash)) {
                this.setActiveTab(hash);
            }
        });
        
        // Study system button
        const openStudyBtn = document.getElementById('open-study-btn');
        if (openStudyBtn) {
            openStudyBtn.addEventListener('click', () => {
                if (this.studyManager) {
                    this.studyManager.openStudyInterface();
                }
            });
        }
        
        // Mind map system button
        const openMindMapBtn = document.getElementById('open-mindmap-btn');
        if (openMindMapBtn) {
            openMindMapBtn.addEventListener('click', () => {
                if (window.mindMapManager) {
                    window.mindMapManager.openMindMapInterface();
                }
            });
        }
        
        // Analytics button
        const openAnalyticsBtn = document.getElementById('open-analytics-btn');
        if (openAnalyticsBtn) {
            openAnalyticsBtn.addEventListener('click', () => {
                if (this.analyticsManager) {
                    this.analyticsManager.openDashboard();
                } else {
                    console.warn('Analytics manager not initialized');
                }
            });
        }
        
        // Gestione dell'hash iniziale
        const initialHash = window.location.hash.substring(1);
        if (initialHash && this.isValidTab(initialHash)) {
            this.currentTab = initialHash;
        }
        
        // Scorciatoie da tastiera
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });
        
        // Gestione errori globali
        window.addEventListener('error', (e) => {
            console.error('Errore globale:', e.error);
            this.showErrorMessage('Si è verificato un errore imprevisto');
        });
        
        // Salvataggio automatico
        this.setupAutoSave();
        
        // Gestione visibilità pagina
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                this.onPageVisible();
            }
        });
    }

    /**
     * Gestisce le scorciatoie da tastiera
     */
    handleKeyboardShortcuts(e) {
        // Solo se non si sta scrivendo in un input
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }
        
        // Ctrl/Cmd + tasti
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case '1':
                    e.preventDefault();
                    this.setActiveTab('timeline');
                    break;
                case '2':
                    e.preventDefault();
                    this.setActiveTab('events');
                    break;
                case '3':
                    e.preventDefault();
                    this.setActiveTab('people');
                    break;
                case 'f':
                    e.preventDefault();
                    this.focusSearch();
                    break;
                case 's':
                    e.preventDefault();
                    this.saveData();
                    break;
                case 'e':
                    e.preventDefault();
                    this.exportData();
                    break;
            }
        }
        
        // Tasti singoli
        switch (e.key) {
            case 'Escape':
                this.closeAllModals();
                break;
        }
    }

    /**
     * Verifica se una tab è valida
     */
    isValidTab(tabName) {
        const validTabs = ['timeline', 'events', 'people', 'search'];
        return validTabs.includes(tabName);
    }

    /**
     * Focalizza la ricerca
     */
    focusSearch() {
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.focus();
            searchInput.select();
        }
    }

    /**
     * Chiude tutti i modal aperti
     */
    closeAllModals() {
        const modals = document.querySelectorAll('.modal.show');
        modals.forEach(modal => {
            modal.classList.remove('show');
        });
    }

    /**
     * Salva i dati
     */
    saveData() {
        try {
            // I dati sono già salvati automaticamente nel localStorage
            this.showSuccessMessage('Dati salvati automaticamente!');
        } catch (error) {
            console.error('Errore nel salvataggio:', error);
            this.showErrorMessage('Errore nel salvataggio dei dati');
        }
    }

    /**
     * Esporta i dati
     */
    exportData() {
        try {
            const data = {
                events: storageManager.getEvents(),
                people: storageManager.getPeople(),
                settings: storageManager.getSettings(),
                exportDate: new Date().toISOString(),
                version: '1.0.0'
            };
            
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `timeline-storica-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            this.showSuccessMessage('Dati esportati con successo!');
        } catch (error) {
            console.error('Errore nell\'esportazione:', error);
            this.showErrorMessage('Errore nell\'esportazione dei dati');
        }
    }

    /**
     * Importa i dati
     */
    importData(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    
                    // Valida i dati
                    if (!this.validateImportData(data)) {
                        throw new Error('Formato file non valido');
                    }
                    
                    // Conferma importazione
                    if (confirm('Importare i dati? Questo sostituirà tutti i dati esistenti.')) {
                        storageManager.importData(data);
                        this.loadInitialData();
                        this.updateStats();
                        this.showSuccessMessage('Dati importati con successo!');
                        resolve(data);
                    } else {
                        reject(new Error('Importazione annullata'));
                    }
                } catch (error) {
                    console.error('Errore nell\'importazione:', error);
                    this.showErrorMessage('Errore nell\'importazione: ' + error.message);
                    reject(error);
                }
            };
            
            reader.onerror = () => {
                reject(new Error('Errore nella lettura del file'));
            };
            
            reader.readAsText(file);
        });
    }

    /**
     * Valida i dati di importazione
     */
    validateImportData(data) {
        return data && 
               Array.isArray(data.events) && 
               Array.isArray(data.people) && 
               typeof data.settings === 'object';
    }

    /**
     * Configura il salvataggio automatico
     */
    setupAutoSave() {
        // Salva ogni 30 secondi se ci sono modifiche
        setInterval(() => {
            if (storageManager.hasUnsavedChanges && storageManager.hasUnsavedChanges()) {
                this.saveData();
            }
        }, 30000);
    }

    /**
     * Gestisce quando la pagina diventa visibile
     */
    onPageVisible() {
        // Aggiorna i dati se necessario
        this.updateStats();
        
        // Ricarica la tab corrente
        this.onTabChange(this.currentTab);
    }

    /**
     * Aggiorna le statistiche
     */
    updateStats() {
        try {
            const stats = storageManager.getStats();
            
            // Aggiorna contatori nell'header
            const eventsCount = document.getElementById('events-count');
            const peopleCount = document.getElementById('people-count');
            
            if (eventsCount) {
                eventsCount.textContent = stats.totalEvents;
            }
            
            if (peopleCount) {
                peopleCount.textContent = stats.totalPeople;
            }
            
            // Aggiorna badge delle tab
            this.updateTabBadges(stats);
            
        } catch (error) {
            console.error('Errore nell\'aggiornamento statistiche:', error);
        }
    }

    /**
     * Aggiorna i badge delle tab
     */
    updateTabBadges(stats) {
        const timelineTab = document.querySelector('[data-tab="timeline"]');
        const eventsTab = document.querySelector('[data-tab="events"]');
        const peopleTab = document.querySelector('[data-tab="people"]');
        
        // Rimuovi badge esistenti
        document.querySelectorAll('.tab-badge').forEach(badge => badge.remove());
        
        // Aggiungi nuovi badge
        if (timelineTab && stats.totalEvents > 0) {
            this.addTabBadge(timelineTab, stats.totalEvents);
        }
        
        if (eventsTab && stats.totalEvents > 0) {
            this.addTabBadge(eventsTab, stats.totalEvents);
        }
        
        if (peopleTab && stats.totalPeople > 0) {
            this.addTabBadge(peopleTab, stats.totalPeople);
        }
    }

    /**
     * Aggiunge un badge a una tab
     */
    addTabBadge(tabElement, count) {
        const badge = document.createElement('span');
        badge.className = 'tab-badge';
        badge.textContent = count;
        tabElement.appendChild(badge);
    }

    /**
     * Ottiene informazioni sull'applicazione
     */
    getAppInfo() {
        return {
            version: '1.0.0',
            initialized: this.isInitialized,
            currentTab: this.currentTab,
            managers: Object.keys(this.managers),
            stats: storageManager.getStats()
        };
    }

    /**
     * Resetta l'applicazione
     */
    resetApp() {
        if (confirm('Sei sicuro di voler resettare tutti i dati? Questa azione non può essere annullata.')) {
            try {
                storageManager.clearAllData();
                this.loadInitialData();
                this.updateStats();
                this.showSuccessMessage('Applicazione resettata con successo!');
            } catch (error) {
                console.error('Errore nel reset:', error);
                this.showErrorMessage('Errore nel reset dell\'applicazione');
            }
        }
    }

    // === UTILITÀ ===

    /**
     * Mostra messaggio di successo
     */
    showSuccessMessage(message) {
        this.showToast(message, 'success');
    }

    /**
     * Mostra messaggio di errore
     */
    showErrorMessage(message) {
        this.showToast(message, 'error');
    }

    /**
     * Mostra un toast
     */
    showToast(message, type = 'info') {
        // Riutilizza la funzione toast esistente o crea una versione semplificata
        if (this.managers.peopleManager && typeof this.managers.peopleManager.showToast === 'function') {
            this.managers.peopleManager.showToast(message, type);
        } else {
            // Fallback semplice
            console.log(`${type.toUpperCase()}: ${message}`);
            
            // Crea toast semplice
            const toast = document.createElement('div');
            toast.className = `simple-toast toast-${type}`;
            toast.textContent = message;
            toast.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                color: white;
                z-index: 10000;
                animation: slideInRight 0.3s ease;
                background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
            `;
            
            document.body.appendChild(toast);
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 3000);
        }
    }
    
    /**
     * Aggiorna tutte le visualizzazioni dopo l'importazione
     */
    refreshAllViews() {
        try {
            // Aggiorna timeline
            if (this.timelineManager && typeof this.timelineManager.renderTimeline === 'function') {
                this.timelineManager.renderTimeline();
            }
            
            // Aggiorna lista eventi
            if (this.eventManager && typeof this.eventManager.renderEvents === 'function') {
                this.eventManager.renderEvents();
            }
            
            // Aggiorna lista persone
            if (this.peopleManager && typeof this.peopleManager.renderPeople === 'function') {
                this.peopleManager.renderPeople();
            }
            
            // Aggiorna statistiche
            this.updateStats();
            
            // Aggiorna analytics se disponibile
            if (this.analyticsManager && typeof this.analyticsManager.updateDashboard === 'function') {
                this.analyticsManager.updateDashboard();
            }
            
            this.logger.log('Tutte le visualizzazioni aggiornate dopo importazione');
            
        } catch (error) {
            this.logger.error('Errore nell\'aggiornamento delle visualizzazioni', error);
        }
    }
}

// Inizializza l'applicazione
window.appManager = new AppManager();

// Esporta per uso globale
window.app = {
    manager: window.appManager,
    version: '1.0.0',
    
    // API pubbliche
    setTab: (tabName) => window.appManager.setActiveTab(tabName),
    exportData: () => window.appManager.exportData(),
    importData: (file) => window.appManager.importData(file),
    resetApp: () => window.appManager.resetApp(),
    getInfo: () => window.appManager.getAppInfo()
};

// Debug helpers (solo in sviluppo)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.debug = {
        app: window.appManager,
        storage: window.storageManager,
        events: window.eventsManager,
        people: window.peopleManager,
        timeline: window.timelineManager,
        search: window.searchManager
    };
    
    console.log('Debug helpers disponibili in window.debug');
}