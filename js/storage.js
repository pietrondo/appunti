/**
 * Storage Manager - Gestisce il salvataggio e caricamento dei dati nel localStorage
 */
class StorageManager {
    constructor() {
        this.storageKeys = {
            events: 'historical_events',
            people: 'historical_people',
            settings: 'app_settings'
        };
        this.initializeStorage();
    }

    /**
     * Inizializza il localStorage con strutture dati vuote se non esistono
     */
    initializeStorage() {
        if (!this.getEvents()) {
            this.saveEvents([]);
        }
        if (!this.getPeople()) {
            this.savePeople([]);
        }
        if (!this.getSettings()) {
            this.saveSettings({
                theme: 'light',
                defaultPeriod: 'all',
                sortOrder: 'chronological',
                language: 'it'
            });
        }
    }

    /**
     * Salva dati nel localStorage con gestione errori
     */
    saveToStorage(key, data) {
        try {
            const jsonData = JSON.stringify(data);
            localStorage.setItem(key, jsonData);
            return true;
        } catch (error) {
            console.error('Errore nel salvataggio:', error);
            this.showStorageError('Errore nel salvataggio dei dati');
            return false;
        }
    }

    /**
     * Carica dati dal localStorage con gestione errori
     */
    loadFromStorage(key, defaultValue = null) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (error) {
            console.error('Errore nel caricamento:', error);
            this.showStorageError('Errore nel caricamento dei dati');
            return defaultValue;
        }
    }

    // === GESTIONE EVENTI ===

    /**
     * Salva la lista degli eventi
     */
    saveEvents(events) {
        return this.saveToStorage(this.storageKeys.events, events);
    }

    /**
     * Carica la lista degli eventi
     */
    getEvents() {
        return this.loadFromStorage(this.storageKeys.events, []);
    }

    /**
     * Aggiunge un nuovo evento
     */
    addEvent(event) {
        const events = this.getEvents();
        event.id = this.generateId();
        event.createdAt = new Date().toISOString();
        event.updatedAt = new Date().toISOString();
        events.push(event);
        return this.saveEvents(events) ? event : null;
    }

    /**
     * Aggiorna un evento esistente
     */
    updateEvent(eventId, updatedEvent) {
        const events = this.getEvents();
        const index = events.findIndex(e => e.id === eventId);
        if (index !== -1) {
            events[index] = {
                ...events[index],
                ...updatedEvent,
                id: eventId,
                updatedAt: new Date().toISOString()
            };
            return this.saveEvents(events) ? events[index] : null;
        }
        return null;
    }

    /**
     * Elimina un evento
     */
    deleteEvent(eventId) {
        const events = this.getEvents();
        const filteredEvents = events.filter(e => e.id !== eventId);
        return this.saveEvents(filteredEvents);
    }

    /**
     * Trova un evento per ID
     */
    getEventById(eventId) {
        const events = this.getEvents();
        return events.find(e => e.id === eventId) || null;
    }

    /**
     * Alias compatibilità: ottiene un evento per ID
     */
    getEvent(eventId) {
        return this.getEventById(eventId);
    }

    /**
     * Alias compatibilità: ottiene tutti gli eventi
     */
    getAllEvents() {
        return this.getEvents();
    }

    // === GESTIONE PERSONE ===

    /**
     * Salva la lista delle persone
     */
    savePeople(people) {
        return this.saveToStorage(this.storageKeys.people, people);
    }

    /**
     * Carica la lista delle persone
     */
    getPeople() {
        return this.loadFromStorage(this.storageKeys.people, []);
    }

    /**
     * Aggiunge una nuova persona
     */
    addPerson(person) {
        const people = this.getPeople();
        person.id = this.generateId();
        person.createdAt = new Date().toISOString();
        person.updatedAt = new Date().toISOString();
        people.push(person);
        return this.savePeople(people) ? person : null;
    }

    /**
     * Aggiorna una persona esistente
     */
    updatePerson(personId, updatedPerson) {
        const people = this.getPeople();
        const index = people.findIndex(p => p.id === personId);
        if (index !== -1) {
            people[index] = {
                ...people[index],
                ...updatedPerson,
                id: personId,
                updatedAt: new Date().toISOString()
            };
            return this.savePeople(people) ? people[index] : null;
        }
        return null;
    }

    /**
     * Elimina una persona
     */
    deletePerson(personId) {
        const people = this.getPeople();
        const filteredPeople = people.filter(p => p.id !== personId);
        return this.savePeople(filteredPeople);
    }

    /**
     * Trova una persona per ID
     */
    getPersonById(personId) {
        const people = this.getPeople();
        return people.find(p => p.id === personId) || null;
    }

    /**
     * Alias compatibilità: ottiene una persona per ID
     */
    getPerson(personId) {
        return this.getPersonById(personId);
    }

    /**
     * Alias compatibilità: ottiene tutte le persone
     */
    getAllPeople() {
        return this.getPeople();
    }

    // === GESTIONE IMPOSTAZIONI ===

    /**
     * Salva le impostazioni
     */
    saveSettings(settings) {
        return this.saveToStorage(this.storageKeys.settings, settings);
    }

    /**
     * Carica le impostazioni
     */
    getSettings() {
        return this.loadFromStorage(this.storageKeys.settings, {});
    }

    /**
     * Aggiorna una singola impostazione
     */
    updateSetting(key, value) {
        const settings = this.getSettings();
        settings[key] = value;
        return this.saveSettings(settings);
    }

    // === UTILITÀ ===

    /**
     * Genera un ID univoco
     */
    generateId() {
        return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Esporta tutti i dati in formato JSON
     */
    exportData() {
        return {
            events: this.getEvents(),
            people: this.getPeople(),
            settings: this.getSettings(),
            exportDate: new Date().toISOString(),
            version: '1.0'
        };
    }

    /**
     * Importa dati da un oggetto JSON
     */
    importData(data) {
        try {
            if (data.events && Array.isArray(data.events)) {
                this.saveEvents(data.events);
            }
            if (data.people && Array.isArray(data.people)) {
                this.savePeople(data.people);
            }
            if (data.settings && typeof data.settings === 'object') {
                this.saveSettings({ ...this.getSettings(), ...data.settings });
            }
            return true;
        } catch (error) {
            console.error('Errore nell\'importazione:', error);
            this.showStorageError('Errore nell\'importazione dei dati');
            return false;
        }
    }

    /**
     * Cancella tutti i dati
     */
    clearAllData() {
        try {
            localStorage.removeItem(this.storageKeys.events);
            localStorage.removeItem(this.storageKeys.people);
            localStorage.removeItem(this.storageKeys.settings);
            this.initializeStorage();
            return true;
        } catch (error) {
            console.error('Errore nella cancellazione:', error);
            return false;
        }
    }

    /**
     * Ottiene statistiche sui dati
     */
    getStatistics() {
        const events = this.getEvents();
        const people = this.getPeople();
        
        const eventsByPeriod = events.reduce((acc, event) => {
            acc[event.period] = (acc[event.period] || 0) + 1;
            return acc;
        }, {});

        const eventsByImportance = events.reduce((acc, event) => {
            acc[event.importance] = (acc[event.importance] || 0) + 1;
            return acc;
        }, {});

        return {
            totalEvents: events.length,
            totalPeople: people.length,
            eventsByPeriod,
            eventsByImportance,
            oldestEvent: events.length > 0 ? events.reduce((oldest, event) => 
                new Date(event.date) < new Date(oldest.date) ? event : oldest
            ) : null,
            newestEvent: events.length > 0 ? events.reduce((newest, event) => 
                new Date(event.date) > new Date(newest.date) ? event : newest
            ) : null
        };
    }

    /**
     * Verifica la disponibilità del localStorage
     */
    isStorageAvailable() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Mostra errori di storage all'utente
     */
    showStorageError(message) {
        // Crea un toast di errore
        const toast = document.createElement('div');
        toast.className = 'storage-error-toast';
        toast.innerHTML = `
            <div class="toast-content">
                <span class="toast-icon">⚠️</span>
                <span class="toast-message">${message}</span>
                <button class="toast-close">&times;</button>
            </div>
        `;
        
        // Aggiungi stili inline se non esistono
        if (!document.querySelector('#storage-error-styles')) {
            const styles = document.createElement('style');
            styles.id = 'storage-error-styles';
            styles.textContent = `
                .storage-error-toast {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: #dc3545;
                    color: white;
                    padding: 1rem;
                    border-radius: 8px;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                    z-index: 10000;
                    animation: slideInRight 0.3s ease;
                }
                .toast-content {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                .toast-close {
                    background: none;
                    border: none;
                    color: white;
                    cursor: pointer;
                    font-size: 1.2rem;
                    margin-left: auto;
                }
                @keyframes slideInRight {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                }
            `;
            document.head.appendChild(styles);
        }
        
        document.body.appendChild(toast);
        
        // Rimuovi il toast dopo 5 secondi o al click
        const removeToast = () => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        };
        
        setTimeout(removeToast, 5000);
        toast.querySelector('.toast-close').addEventListener('click', removeToast);
    }
}

// Crea un'istanza globale del storage manager
window.storageManager = new StorageManager();
// Alias per compatibilità con vecchia API
window.storage = window.storageManager;
