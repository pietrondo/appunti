/**
 * Timeline Manager - Gestisce la visualizzazione cronologica degli eventi
 */
class TimelineManager {
    constructor() {
        this.timelineContainer = null;
        this.currentFilter = 'all';
        this.currentSort = 'date';
        this.initializeElements();
        this.bindEvents();
    }

    /**
     * Inizializza gli elementi DOM
     */
    initializeElements() {
        this.timelineContainer = document.getElementById('timeline-container');
        this.periodFilter = document.getElementById('period-filter');
        this.sortSelect = document.getElementById('sort-select');
        this.timelineView = document.getElementById('timeline-view');
    }

    /**
     * Collega gli eventi ai gestori
     */
    bindEvents() {
        // Filtro per periodo
        this.periodFilter?.addEventListener('change', (e) => {
            this.currentFilter = e.target.value;
            this.renderTimeline();
        });
        
        // Ordinamento
        this.sortSelect?.addEventListener('change', (e) => {
            this.currentSort = e.target.value;
            this.renderTimeline();
        });
        
        // Aggiorna timeline quando cambiano eventi o persone
        document.addEventListener('dataUpdated', () => {
            this.renderTimeline();
        });
    }

    /**
     * Renderizza la timeline completa
     */
    renderTimeline() {
        if (!this.timelineContainer) return;
        
        const events = this.getFilteredAndSortedEvents();
        
        if (events.length === 0) {
            this.renderEmptyTimeline();
            return;
        }
        
        // Raggruppa eventi per anno/periodo
        const groupedEvents = this.groupEventsByPeriod(events);
        
        this.timelineContainer.innerHTML = this.createTimelineHTML(groupedEvents);
        this.bindTimelineEvents();
    }

    /**
     * Ottiene eventi filtrati e ordinati
     */
    getFilteredAndSortedEvents() {
        let events = storageManager.getEvents();
        
        // Filtra per periodo
        if (this.currentFilter !== 'all') {
            events = events.filter(event => event.period === this.currentFilter);
        }
        
        // Ordina eventi
        events.sort((a, b) => {
            switch (this.currentSort) {
                case 'date':
                    return new Date(a.date) - new Date(b.date);
                case 'date-desc':
                    return new Date(b.date) - new Date(a.date);
                case 'importance':
                    const importanceOrder = { high: 3, medium: 2, low: 1 };
                    return importanceOrder[b.importance] - importanceOrder[a.importance];
                case 'title':
                    return a.title.localeCompare(b.title);
                default:
                    return new Date(a.date) - new Date(b.date);
            }
        });
        
        return events;
    }

    /**
     * Raggruppa eventi per periodo temporale
     */
    groupEventsByPeriod(events) {
        const groups = new Map();
        
        events.forEach(event => {
            const year = new Date(event.date).getFullYear();
            const century = Math.floor(year / 100) + 1;
            const period = this.getPeriodFromYear(year);
            
            let groupKey;
            if (this.currentSort === 'date' || this.currentSort === 'date-desc') {
                // Raggruppa per decennio per una migliore visualizzazione
                const decade = Math.floor(year / 10) * 10;
                groupKey = `${decade}s`;
            } else {
                groupKey = period;
            }
            
            if (!groups.has(groupKey)) {
                groups.set(groupKey, {
                    title: groupKey,
                    period: period,
                    events: []
                });
            }
            
            groups.get(groupKey).events.push(event);
        });
        
        return Array.from(groups.values());
    }

    /**
     * Determina il periodo storico dall'anno
     */
    getPeriodFromYear(year) {
        if (year < 500) return 'ancient';
        if (year < 1500) return 'medieval';
        if (year < 1800) return 'renaissance';
        if (year < 1900) return 'modern';
        return 'contemporary';
    }

    /**
     * Crea l'HTML della timeline
     */
    createTimelineHTML(groupedEvents) {
        return `
            <div class="timeline">
                ${groupedEvents.map(group => this.createTimelineGroup(group)).join('')}
            </div>
        `;
    }

    /**
     * Crea un gruppo della timeline
     */
    createTimelineGroup(group) {
        return `
            <div class="timeline-group period-${group.period}">
                <div class="timeline-group-header">
                    <h3 class="timeline-group-title">${group.title}</h3>
                    <span class="timeline-group-count">${group.events.length} eventi</span>
                </div>
                <div class="timeline-items">
                    ${group.events.map(event => this.createTimelineItem(event)).join('')}
                </div>
            </div>
        `;
    }

    /**
     * Crea un elemento della timeline
     */
    createTimelineItem(event) {
        const people = this.getEventPeople(event);
        const formattedDate = this.formatEventDate(event.date);
        
        return `
            <div class="timeline-item importance-${event.importance}" data-event-id="${event.id}">
                <div class="timeline-dot"></div>
                <div class="timeline-content">
                    <div class="timeline-header">
                        <h4 class="timeline-title">${this.escapeHtml(event.title)}</h4>
                        <span class="timeline-date">${formattedDate}</span>
                    </div>
                    
                    ${event.description ? `
                        <p class="timeline-description">${this.escapeHtml(event.description)}</p>
                    ` : ''}
                    
                    ${people.length > 0 ? `
                        <div class="timeline-people">
                            <strong>Persone coinvolte:</strong>
                            <div class="people-tags">
                                ${people.map(person => `
                                    <span class="person-tag" data-person-id="${person.id || ''}">
                                        ${this.escapeHtml(person.name)}
                                    </span>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                    
                    <div class="timeline-meta">
                        <div class="timeline-tags">
                            <span class="tag period-tag">${this.getPeriodLabel(event.period)}</span>
                            <span class="tag importance-tag importance-${event.importance}">
                                ${this.getImportanceLabel(event.importance)}
                            </span>
                            ${event.location ? `<span class="tag location-tag">📍 ${this.escapeHtml(event.location)}</span>` : ''}
                        </div>
                        
                        <div class="timeline-actions">
                            <button class="btn-small btn-edit" data-action="edit" data-event-id="${event.id}">
                                ✏️ Modifica
                            </button>
                            <button class="btn-small btn-delete" data-action="delete" data-event-id="${event.id}">
                                🗑️ Elimina
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Renderizza timeline vuota
     */
    renderEmptyTimeline() {
        this.timelineContainer.innerHTML = `
            <div class="empty-timeline">
                <div class="empty-state">
                    <div class="empty-state-icon">📅</div>
                    <h3 class="empty-state-title">Timeline vuota</h3>
                    <p class="empty-state-text">
                        ${this.currentFilter === 'all' 
                            ? 'Non ci sono eventi da visualizzare. Inizia aggiungendo il tuo primo evento storico!' 
                            : `Non ci sono eventi per il periodo "${this.getPeriodLabel(this.currentFilter)}".`
                        }
                    </p>
                    ${this.currentFilter === 'all' ? `
                        <button class="btn-primary" onclick="eventsManager.openEventModal()">
                            + Aggiungi il primo evento
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    }

    /**
     * Collega eventi della timeline
     */
    bindTimelineEvents() {
        // Azioni sui bottoni
        this.timelineContainer?.addEventListener('click', (e) => {
            const action = e.target.dataset.action;
            const eventId = e.target.dataset.eventId;
            
            if (action && eventId) {
                switch (action) {
                    case 'edit':
                        this.editEvent(eventId);
                        break;
                    case 'delete':
                        this.deleteEvent(eventId);
                        break;
                }
            }
        });
        
        // Click su tag delle persone
        this.timelineContainer?.addEventListener('click', (e) => {
            if (e.target.classList.contains('person-tag')) {
                const personId = e.target.dataset.personId;
                if (personId) {
                    this.showPersonDetails(personId);
                }
            }
        });
        
        // Animazioni di scroll
        this.observeTimelineItems();
    }

    /**
     * Modifica un evento
     */
    editEvent(eventId) {
        if (window.eventsManager) {
            const event = storageManager.getEventById(eventId);
            if (event) {
                window.eventsManager.openEventModal(event);
            }
        }
    }

    /**
     * Elimina un evento
     */
    deleteEvent(eventId) {
        const event = storageManager.getEventById(eventId);
        if (!event) return;
        
        if (confirm(`Sei sicuro di voler eliminare l'evento "${event.title}"?`)) {
            if (storageManager.deleteEvent(eventId)) {
                this.renderTimeline();
                this.showSuccessMessage('Evento eliminato con successo!');
            } else {
                this.showErrorMessage('Errore nell\'eliminazione dell\'evento');
            }
        }
    }

    /**
     * Mostra dettagli di una persona
     */
    showPersonDetails(personId) {
        if (window.peopleManager) {
            const person = storageManager.getPersonById(personId);
            if (person) {
                // Cambia alla tab delle persone e evidenzia la persona
                const peopleTab = document.querySelector('[data-tab="people"]');
                if (peopleTab) {
                    peopleTab.click();
                    
                    // Evidenzia la card della persona
                    setTimeout(() => {
                        const personCard = document.querySelector(`[data-person-id="${personId}"]`);
                        if (personCard) {
                            personCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            personCard.classList.add('highlighted');
                            setTimeout(() => personCard.classList.remove('highlighted'), 2000);
                        }
                    }, 100);
                }
            }
        }
    }

    /**
     * Osserva gli elementi della timeline per animazioni
     */
    observeTimelineItems() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });
        
        this.timelineContainer?.querySelectorAll('.timeline-item').forEach(item => {
            observer.observe(item);
        });
    }

    /**
     * Filtra timeline per ricerca
     */
    filterTimelineBySearch(query) {
        if (!query.trim()) {
            this.renderTimeline();
            return;
        }
        
        const events = storageManager.getEvents();
        const filteredEvents = events.filter(event => {
            const searchText = `${event.title} ${event.description} ${event.location} ${(event.people || []).join(' ')}`.toLowerCase();
            return searchText.includes(query.toLowerCase());
        });
        
        if (filteredEvents.length === 0) {
            this.timelineContainer.innerHTML = `
                <div class="empty-timeline">
                    <div class="empty-state">
                        <div class="empty-state-icon">🔍</div>
                        <h3 class="empty-state-title">Nessun risultato</h3>
                        <p class="empty-state-text">Nessun evento trovato per "${this.escapeHtml(query)}"</p>
                    </div>
                </div>
            `;
            return;
        }
        
        // Ordina eventi filtrati
        filteredEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
        
        // Raggruppa e renderizza
        const groupedEvents = this.groupEventsByPeriod(filteredEvents);
        this.timelineContainer.innerHTML = this.createTimelineHTML(groupedEvents);
        this.bindTimelineEvents();
    }

    /**
     * Naviga a un evento specifico
     */
    navigateToEvent(eventId) {
        this.renderTimeline();
        
        setTimeout(() => {
            const eventElement = document.querySelector(`[data-event-id="${eventId}"]`);
            if (eventElement) {
                eventElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                eventElement.classList.add('highlighted');
                setTimeout(() => eventElement.classList.remove('highlighted'), 2000);
            }
        }, 100);
    }

    /**
     * Esporta timeline come testo
     */
    exportTimeline() {
        const events = this.getFilteredAndSortedEvents();
        
        let text = 'TIMELINE STORICA\n';
        text += '================\n\n';
        
        const groupedEvents = this.groupEventsByPeriod(events);
        
        groupedEvents.forEach(group => {
            text += `${group.title.toUpperCase()}\n`;
            text += '-'.repeat(group.title.length) + '\n\n';
            
            group.events.forEach(event => {
                text += `📅 ${this.formatEventDate(event.date)}\n`;
                text += `📝 ${event.title}\n`;
                
                if (event.description) {
                    text += `   ${event.description}\n`;
                }
                
                if (event.location) {
                    text += `📍 ${event.location}\n`;
                }
                
                if (event.people && event.people.length > 0) {
                    text += `👥 ${event.people.join(', ')}\n`;
                }
                
                text += `⭐ ${this.getImportanceLabel(event.importance)}\n`;
                text += '\n';
            });
            
            text += '\n';
        });
        
        // Crea e scarica file
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `timeline-storica-${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showSuccessMessage('Timeline esportata con successo!');
    }

    // === UTILITÀ ===

    /**
     * Ottiene le persone di un evento
     */
    getEventPeople(event) {
        if (!event.people || !Array.isArray(event.people)) return [];
        
        const allPeople = storageManager.getPeople();
        return event.people.map(personName => {
            const person = allPeople.find(p => p.name.toLowerCase() === personName.toLowerCase());
            return person || { name: personName, id: null };
        });
    }

    /**
     * Formatta la data dell'evento
     */
    formatEventDate(dateString) {
        const date = new Date(dateString);
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric'
        };
        return date.toLocaleDateString('it-IT', options);
    }

    /**
     * Ottiene l'etichetta del periodo
     */
    getPeriodLabel(period) {
        const labels = {
            ancient: 'Antichità',
            medieval: 'Medioevo',
            renaissance: 'Rinascimento',
            modern: 'Età Moderna',
            contemporary: 'Età Contemporanea'
        };
        return labels[period] || period;
    }

    /**
     * Ottiene l'etichetta dell'importanza
     */
    getImportanceLabel(importance) {
        const labels = {
            low: 'Bassa',
            medium: 'Media',
            high: 'Alta'
        };
        return labels[importance] || importance;
    }

    /**
     * Escape HTML per prevenire XSS
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

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
        // Riutilizza la funzione toast del people manager o crea una versione semplificata
        if (window.peopleManager && typeof window.peopleManager.showToast === 'function') {
            window.peopleManager.showToast(message, type);
        } else {
            // Fallback semplice
            alert(message);
        }
    }

    /**
     * Ottiene statistiche della timeline
     */
    getTimelineStats() {
        const events = storageManager.getEvents();
        const people = storageManager.getPeople();
        
        const stats = {
            totalEvents: events.length,
            totalPeople: people.length,
            periods: {},
            importance: { low: 0, medium: 0, high: 0 },
            eventsWithPeople: 0,
            dateRange: null
        };
        
        events.forEach(event => {
            // Conta per periodo
            stats.periods[event.period] = (stats.periods[event.period] || 0) + 1;
            
            // Conta per importanza
            stats.importance[event.importance]++;
            
            // Eventi con persone
            if (event.people && event.people.length > 0) {
                stats.eventsWithPeople++;
            }
        });
        
        // Range di date
        if (events.length > 0) {
            const dates = events.map(e => new Date(e.date)).sort((a, b) => a - b);
            stats.dateRange = {
                start: dates[0],
                end: dates[dates.length - 1]
            };
        }
        
        return stats;
    }
}

// Inizializza il manager della timeline
window.timelineManager = new TimelineManager();