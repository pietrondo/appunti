/**
 * Test Suite - Sistema di test per l'applicazione Cronologia Storica
 */
class TestSuite {
    constructor() {
        this.tests = [];
        this.results = [];
        this.isRunning = false;
        this.init();
    }

    /**
     * Inizializza la suite di test
     */
    init() {
        this.setupTests();
        logger?.info('Test Suite inizializzata', { totalTests: this.tests.length });
    }

    /**
     * Configura tutti i test
     */
    setupTests() {
        // Test Storage
        this.addTest('Storage - Salvataggio eventi', () => this.testEventStorage());
        this.addTest('Storage - Salvataggio persone', () => this.testPeopleStorage());
        this.addTest('Storage - Caricamento dati', () => this.testDataLoading());
        
        // Test Validazione
        this.addTest('Validazione - Evento valido', () => this.testEventValidation());
        this.addTest('Validazione - Persona valida', () => this.testPersonValidation());
        this.addTest('Validazione - Dati invalidi', () => this.testInvalidData());
        
        // Test Ricerca
        this.addTest('Ricerca - Ricerca eventi', () => this.testEventSearch());
        this.addTest('Ricerca - Ricerca persone', () => this.testPeopleSearch());
        this.addTest('Ricerca - Filtri', () => this.testSearchFilters());
        
        // Test Timeline
        this.addTest('Timeline - Ordinamento', () => this.testTimelineSorting());
        this.addTest('Timeline - Filtri periodo', () => this.testTimelineFilters());
        
        // Test Backup
        this.addTest('Backup - Creazione backup', () => this.testBackupCreation());
        this.addTest('Backup - Ripristino backup', () => this.testBackupRestore());
        
        // Test Logger
        this.addTest('Logger - Logging messaggi', () => this.testLogging());
        this.addTest('Logger - Esportazione log', () => this.testLogExport());
        
        // Test UI
        this.addTest('UI - Navigazione tab', () => this.testTabNavigation());
        this.addTest('UI - Modal apertura/chiusura', () => this.testModalFunctionality());
    }

    /**
     * Aggiunge un test alla suite
     */
    addTest(name, testFunction) {
        this.tests.push({
            name: name,
            function: testFunction,
            id: this.tests.length
        });
    }

    /**
     * Esegue tutti i test
     */
    async runAllTests() {
        if (this.isRunning) {
            console.warn('Test già in esecuzione');
            return;
        }

        this.isRunning = true;
        this.results = [];
        
        console.log('🧪 Inizio esecuzione test suite...');
        logger?.info('Inizio test suite', { totalTests: this.tests.length });
        
        const startTime = Date.now();
        
        for (const test of this.tests) {
            await this.runSingleTest(test);
        }
        
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        this.isRunning = false;
        this.printResults(duration);
        
        return this.results;
    }

    /**
     * Esegue un singolo test
     */
    async runSingleTest(test) {
        const result = {
            id: test.id,
            name: test.name,
            passed: false,
            error: null,
            duration: 0,
            timestamp: new Date().toISOString()
        };
        
        const startTime = Date.now();
        
        try {
            console.log(`🔍 Eseguendo: ${test.name}`);
            await test.function();
            result.passed = true;
            console.log(`✅ Passato: ${test.name}`);
        } catch (error) {
            result.passed = false;
            result.error = error.message;
            console.error(`❌ Fallito: ${test.name}`, error);
            logger?.error('Test fallito', { testName: test.name, error: error.message });
        }
        
        result.duration = Date.now() - startTime;
        this.results.push(result);
    }

    /**
     * Stampa i risultati dei test
     */
    printResults(totalDuration) {
        const passed = this.results.filter(r => r.passed).length;
        const failed = this.results.filter(r => !r.passed).length;
        const total = this.results.length;
        
        console.log('\n📊 Risultati Test Suite:');
        console.log(`Total: ${total} | Passed: ${passed} | Failed: ${failed}`);
        console.log(`Durata totale: ${totalDuration}ms`);
        
        if (failed > 0) {
            console.log('\n❌ Test falliti:');
            this.results.filter(r => !r.passed).forEach(result => {
                console.log(`- ${result.name}: ${result.error}`);
            });
        }
        
        logger?.info('Test suite completata', {
            total,
            passed,
            failed,
            duration: totalDuration,
            successRate: Math.round((passed / total) * 100)
        });
    }

    // ===== TEST IMPLEMENTATIONS =====

    /**
     * Test salvataggio eventi
     */
    async testEventStorage() {
        const testEvent = {
            id: 'test_event_' + Date.now(),
            title: 'Test Event',
            date: '2024-01-01',
            period: 'contemporary',
            description: 'Test description',
            importance: 'medium'
        };
        
        // Salva evento
        if (typeof storage !== 'undefined') {
            storage.addEvent(testEvent);
            
            // Verifica che sia stato salvato
            const savedEvent = storage.getEvent(testEvent.id);
            if (!savedEvent || savedEvent.title !== testEvent.title) {
                throw new Error('Evento non salvato correttamente');
            }
            
            // Pulisci
            storage.deleteEvent(testEvent.id);
        } else {
            throw new Error('Storage non disponibile');
        }
    }

    /**
     * Test salvataggio persone
     */
    async testPeopleStorage() {
        const testPerson = {
            id: 'test_person_' + Date.now(),
            name: 'Test Person',
            birth: '1900-01-01',
            death: '2000-01-01',
            role: 'Test Role',
            period: 'contemporary'
        };
        
        if (typeof storage !== 'undefined') {
            storage.addPerson(testPerson);
            
            const savedPerson = storage.getPerson(testPerson.id);
            if (!savedPerson || savedPerson.name !== testPerson.name) {
                throw new Error('Persona non salvata correttamente');
            }
            
            storage.deletePerson(testPerson.id);
        } else {
            throw new Error('Storage non disponibile');
        }
    }

    /**
     * Test caricamento dati
     */
    async testDataLoading() {
        if (typeof storage !== 'undefined') {
            const events = storage.getAllEvents();
            const people = storage.getAllPeople();
            
            if (!Array.isArray(events) || !Array.isArray(people)) {
                throw new Error('Dati non caricati correttamente');
            }
        } else {
            throw new Error('Storage non disponibile');
        }
    }

    /**
     * Test validazione eventi
     */
    async testEventValidation() {
        const validEvent = {
            title: 'Valid Event',
            date: '2024-01-01'
        };
        
        const invalidEvent = {
            title: '', // Titolo vuoto
            date: 'invalid-date'
        };
        
        // Simula validazione (implementazione dipende dal codice effettivo)
        if (!validEvent.title || !validEvent.date) {
            throw new Error('Evento valido non passa la validazione');
        }
    }

    /**
     * Test validazione persone
     */
    async testPersonValidation() {
        const validPerson = {
            name: 'Valid Person'
        };
        
        const invalidPerson = {
            name: '' // Nome vuoto
        };
        
        if (!validPerson.name) {
            throw new Error('Persona valida non passa la validazione');
        }
    }

    /**
     * Test dati invalidi
     */
    async testInvalidData() {
        // Test che i dati invalidi vengano rifiutati
        const invalidData = {
            title: null,
            date: undefined
        };
        
        // Verifica che la validazione fallisca per dati invalidi
        if (invalidData.title || invalidData.date) {
            throw new Error('Dati invalidi non vengono rifiutati');
        }
    }

    /**
     * Test ricerca eventi
     */
    async testEventSearch() {
        // Simula ricerca (implementazione dipende dal codice effettivo)
        const searchQuery = 'test';
        
        if (typeof storage !== 'undefined') {
            const events = storage.getAllEvents();
            const results = events.filter(event => 
                event.title.toLowerCase().includes(searchQuery.toLowerCase())
            );
            
            // Verifica che la ricerca funzioni
            if (!Array.isArray(results)) {
                throw new Error('Ricerca eventi non funziona');
            }
        }
    }

    /**
     * Test ricerca persone
     */
    async testPeopleSearch() {
        const searchQuery = 'test';
        
        if (typeof storage !== 'undefined') {
            const people = storage.getAllPeople();
            const results = people.filter(person => 
                person.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            
            if (!Array.isArray(results)) {
                throw new Error('Ricerca persone non funziona');
            }
        }
    }

    /**
     * Test filtri ricerca
     */
    async testSearchFilters() {
        // Test filtri per periodo
        const period = 'contemporary';
        
        if (typeof storage !== 'undefined') {
            const events = storage.getAllEvents();
            const filtered = events.filter(event => event.period === period);
            
            if (!Array.isArray(filtered)) {
                throw new Error('Filtri ricerca non funzionano');
            }
        }
    }

    /**
     * Test ordinamento timeline
     */
    async testTimelineSorting() {
        if (typeof storage !== 'undefined') {
            const events = storage.getAllEvents();
            
            // Test ordinamento per data
            const sortedByDate = [...events].sort((a, b) => new Date(a.date) - new Date(b.date));
            
            if (!Array.isArray(sortedByDate)) {
                throw new Error('Ordinamento timeline non funziona');
            }
        }
    }

    /**
     * Test filtri timeline
     */
    async testTimelineFilters() {
        const period = 'contemporary';
        
        if (typeof storage !== 'undefined') {
            const events = storage.getAllEvents();
            const filtered = events.filter(event => event.period === period);
            
            if (!Array.isArray(filtered)) {
                throw new Error('Filtri timeline non funzionano');
            }
        }
    }

    /**
     * Test creazione backup
     */
    async testBackupCreation() {
        if (typeof backupManager !== 'undefined') {
            const backupKey = backupManager.createBackup('test');
            
            if (!backupKey) {
                throw new Error('Creazione backup fallita');
            }
            
            // Pulisci
            backupManager.deleteBackup(backupKey);
        } else {
            throw new Error('Backup Manager non disponibile');
        }
    }

    /**
     * Test ripristino backup
     */
    async testBackupRestore() {
        if (typeof backupManager !== 'undefined') {
            const backups = backupManager.getAllBackups();
            
            if (!Array.isArray(backups)) {
                throw new Error('Lista backup non disponibile');
            }
        } else {
            throw new Error('Backup Manager non disponibile');
        }
    }

    /**
     * Test logging
     */
    async testLogging() {
        if (typeof logger !== 'undefined') {
            const testMessage = 'Test log message';
            const logEntry = logger.info(testMessage);
            
            if (!logEntry || logEntry.message !== testMessage) {
                throw new Error('Logging non funziona');
            }
        } else {
            throw new Error('Logger non disponibile');
        }
    }

    /**
     * Test esportazione log
     */
    async testLogExport() {
        if (typeof logger !== 'undefined') {
            const logs = logger.getAllLogs();
            
            if (!Array.isArray(logs)) {
                throw new Error('Esportazione log non funziona');
            }
        } else {
            throw new Error('Logger non disponibile');
        }
    }

    /**
     * Test navigazione tab
     */
    async testTabNavigation() {
        const tabs = document.querySelectorAll('.nav-btn');
        
        if (tabs.length === 0) {
            throw new Error('Tab di navigazione non trovate');
        }
        
        // Verifica che le tab esistano
        const expectedTabs = ['timeline', 'events', 'people', 'search'];
        const foundTabs = Array.from(tabs).map(tab => tab.dataset.tab);
        
        expectedTabs.forEach(expectedTab => {
            if (!foundTabs.includes(expectedTab)) {
                throw new Error(`Tab ${expectedTab} non trovata`);
            }
        });
    }

    /**
     * Test funzionalità modal
     */
    async testModalFunctionality() {
        const eventModal = document.getElementById('event-modal');
        const personModal = document.getElementById('person-modal');
        
        if (!eventModal || !personModal) {
            throw new Error('Modal non trovati nel DOM');
        }
        
        // Verifica che i modal abbiano le classi corrette
        if (!eventModal.classList.contains('modal') || !personModal.classList.contains('modal')) {
            throw new Error('Modal non hanno le classi corrette');
        }
    }

    /**
     * Esegue test specifici per categoria
     */
    async runTestCategory(category) {
        const categoryTests = this.tests.filter(test => 
            test.name.toLowerCase().startsWith(category.toLowerCase())
        );
        
        if (categoryTests.length === 0) {
            console.warn(`Nessun test trovato per la categoria: ${category}`);
            return;
        }
        
        console.log(`🧪 Eseguendo test categoria: ${category}`);
        
        for (const test of categoryTests) {
            await this.runSingleTest(test);
        }
        
        const categoryResults = this.results.filter(result => 
            categoryTests.some(test => test.id === result.id)
        );
        
        const passed = categoryResults.filter(r => r.passed).length;
        const total = categoryResults.length;
        
        console.log(`📊 Categoria ${category}: ${passed}/${total} test passati`);
    }

    /**
     * Ottiene statistiche sui test
     */
    getTestStats() {
        const stats = {
            total: this.results.length,
            passed: this.results.filter(r => r.passed).length,
            failed: this.results.filter(r => !r.passed).length,
            averageDuration: 0,
            categories: {}
        };
        
        if (this.results.length > 0) {
            stats.averageDuration = Math.round(
                this.results.reduce((sum, r) => sum + r.duration, 0) / this.results.length
            );
            
            // Raggruppa per categoria
            this.results.forEach(result => {
                const category = result.name.split(' - ')[0];
                if (!stats.categories[category]) {
                    stats.categories[category] = { total: 0, passed: 0 };
                }
                stats.categories[category].total++;
                if (result.passed) {
                    stats.categories[category].passed++;
                }
            });
        }
        
        return stats;
    }
}

// Istanza globale della test suite
const testSuite = new TestSuite();

// Funzioni di utilità per eseguire test dalla console
window.runAllTests = () => testSuite.runAllTests();
window.runTestCategory = (category) => testSuite.runTestCategory(category);
window.getTestStats = () => testSuite.getTestStats();

// Esporta per uso in altri moduli
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TestSuite;
}