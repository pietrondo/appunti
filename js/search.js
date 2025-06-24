/**
 * Search Manager - Gestisce la ricerca globale e la navigazione
 */
class SearchManager {
    constructor() {
        this.searchInput = null;
        this.searchResults = null;
        this.searchSuggestions = null;
        this.currentQuery = '';
        this.searchTimeout = null;
        this.isSearching = false;
        this.initializeElements();
        this.bindEvents();
    }

    /**
     * Inizializza gli elementi DOM
     */
    initializeElements() {
        this.searchInput = document.getElementById('search-input');
        this.searchResults = document.getElementById('search-results');
        this.searchSuggestions = document.getElementById('search-suggestions');
        this.searchContainer = document.querySelector('.search-container');
        this.clearSearchBtn = document.getElementById('clear-search');
    }

    /**
     * Collega gli eventi ai gestori
     */
    bindEvents() {
        // Input di ricerca
        this.searchInput?.addEventListener('input', (e) => {
            this.handleSearchInput(e.target.value);
        });
        
        // Focus e blur per suggerimenti
        this.searchInput?.addEventListener('focus', () => {
            if (this.currentQuery) {
                this.showSuggestions();
            }
        });
        
        this.searchInput?.addEventListener('blur', () => {
            // Ritarda la chiusura per permettere il click sui suggerimenti
            setTimeout(() => this.hideSuggestions(), 200);
        });
        
        // Tasti speciali
        this.searchInput?.addEventListener('keydown', (e) => {
            this.handleKeyDown(e);
        });
        
        // Bottone per pulire ricerca
        this.clearSearchBtn?.addEventListener('click', () => {
            this.clearSearch();
        });
        
        // Click fuori per chiudere suggerimenti
        document.addEventListener('click', (e) => {
            if (!this.searchContainer?.contains(e.target)) {
                this.hideSuggestions();
            }
        });
    }

    /**
     * Gestisce l'input di ricerca
     */
    handleSearchInput(query) {
        this.currentQuery = query.trim();
        
        // Mostra/nasconde bottone clear
        if (this.clearSearchBtn) {
            this.clearSearchBtn.style.display = this.currentQuery ? 'block' : 'none';
        }
        
        // Cancella timeout precedente
        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }
        
        // Ricerca con debounce
        this.searchTimeout = setTimeout(() => {
            if (this.currentQuery.length >= 2) {
                this.performSearch(this.currentQuery);
                this.showSuggestions();
            } else {
                this.clearResults();
                this.hideSuggestions();
            }
        }, 300);
    }

    /**
     * Gestisce i tasti speciali
     */
    handleKeyDown(e) {
        switch (e.key) {
            case 'Escape':
                this.clearSearch();
                this.searchInput.blur();
                break;
            case 'Enter':
                e.preventDefault();
                if (this.currentQuery) {
                    this.performFullSearch();
                }
                break;
            case 'ArrowDown':
                e.preventDefault();
                this.navigateSuggestions('down');
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.navigateSuggestions('up');
                break;
        }
    }

    /**
     * Esegue la ricerca
     */
    performSearch(query) {
        this.isSearching = true;
        
        const results = {
            events: this.searchEvents(query),
            people: this.searchPeople(query),
            suggestions: this.generateSuggestions(query)
        };
        
        this.displayResults(results);
        this.isSearching = false;
    }

    /**
     * Cerca negli eventi
     */
    searchEvents(query) {
        const events = storageManager.getEvents();
        const lowerQuery = query.toLowerCase();
        
        return events.filter(event => {
            const searchText = `${event.title} ${event.description} ${event.location} ${(event.people || []).join(' ')}`.toLowerCase();
            return searchText.includes(lowerQuery);
        }).map(event => ({
            ...event,
            type: 'event',
            relevance: this.calculateEventRelevance(event, lowerQuery)
        })).sort((a, b) => b.relevance - a.relevance);
    }

    /**
     * Cerca nelle persone
     */
    searchPeople(query) {
        const people = storageManager.getPeople();
        const lowerQuery = query.toLowerCase();
        
        return people.filter(person => {
            const searchText = `${person.name} ${person.role} ${person.biography} ${person.achievements}`.toLowerCase();
            return searchText.includes(lowerQuery);
        }).map(person => ({
            ...person,
            type: 'person',
            relevance: this.calculatePersonRelevance(person, lowerQuery)
        })).sort((a, b) => b.relevance - a.relevance);
    }

    /**
     * Calcola la rilevanza di un evento
     */
    calculateEventRelevance(event, query) {
        let score = 0;
        
        // Titolo ha peso maggiore
        if (event.title.toLowerCase().includes(query)) {
            score += 10;
            if (event.title.toLowerCase().startsWith(query)) {
                score += 5;
            }
        }
        
        // Descrizione
        if (event.description && event.description.toLowerCase().includes(query)) {
            score += 5;
        }
        
        // Persone coinvolte
        if (event.people && event.people.some(person => person.toLowerCase().includes(query))) {
            score += 7;
        }
        
        // Località
        if (event.location && event.location.toLowerCase().includes(query)) {
            score += 3;
        }
        
        // Bonus per importanza
        const importanceBonus = { high: 3, medium: 2, low: 1 };
        score += importanceBonus[event.importance] || 0;
        
        return score;
    }

    /**
     * Calcola la rilevanza di una persona
     */
    calculatePersonRelevance(person, query) {
        let score = 0;
        
        // Nome ha peso maggiore
        if (person.name.toLowerCase().includes(query)) {
            score += 10;
            if (person.name.toLowerCase().startsWith(query)) {
                score += 5;
            }
        }
        
        // Ruolo
        if (person.role && person.role.toLowerCase().includes(query)) {
            score += 7;
        }
        
        // Biografia
        if (person.biography && person.biography.toLowerCase().includes(query)) {
            score += 3;
        }
        
        // Realizzazioni
        if (person.achievements && person.achievements.toLowerCase().includes(query)) {
            score += 4;
        }
        
        return score;
    }

    /**
     * Genera suggerimenti di ricerca
     */
    generateSuggestions(query) {
        const suggestions = new Set();
        const lowerQuery = query.toLowerCase();
        
        // Suggerimenti da eventi
        const events = storageManager.getEvents();
        events.forEach(event => {
            // Titoli simili
            if (event.title.toLowerCase().includes(lowerQuery)) {
                suggestions.add(event.title);
            }
            
            // Persone
            if (event.people) {
                event.people.forEach(person => {
                    if (person.toLowerCase().includes(lowerQuery)) {
                        suggestions.add(person);
                    }
                });
            }
            
            // Località
            if (event.location && event.location.toLowerCase().includes(lowerQuery)) {
                suggestions.add(event.location);
            }
        });
        
        // Suggerimenti da persone
        const people = storageManager.getPeople();
        people.forEach(person => {
            if (person.name.toLowerCase().includes(lowerQuery)) {
                suggestions.add(person.name);
            }
            if (person.role && person.role.toLowerCase().includes(lowerQuery)) {
                suggestions.add(person.role);
            }
        });
        
        return Array.from(suggestions).slice(0, 8);
    }

    /**
     * Mostra i risultati
     */
    displayResults(results) {
        if (!this.searchResults) return;
        
        const totalResults = results.events.length + results.people.length;
        
        if (totalResults === 0) {
            this.searchResults.innerHTML = `
                <div class="search-no-results">
                    <div class="empty-state-icon">🔍</div>
                    <h3>Nessun risultato trovato</h3>
                    <p>Prova con termini diversi o controlla l'ortografia.</p>
                </div>
            `;
            this.searchResults.style.display = 'block';
            return;
        }
        
        let html = `<div class="search-results-header">
            <h3>Risultati per "${this.escapeHtml(this.currentQuery)}" (${totalResults})</h3>
        </div>`;
        
        // Eventi
        if (results.events.length > 0) {
            html += `
                <div class="search-section">
                    <h4 class="search-section-title">📅 Eventi (${results.events.length})</h4>
                    <div class="search-items">
                        ${results.events.slice(0, 5).map(event => this.createEventResult(event)).join('')}
                    </div>
                    ${results.events.length > 5 ? `
                        <button class="btn-link show-more" data-type="events">
                            Mostra altri ${results.events.length - 5} eventi
                        </button>
                    ` : ''}
                </div>
            `;
        }
        
        // Persone
        if (results.people.length > 0) {
            html += `
                <div class="search-section">
                    <h4 class="search-section-title">👥 Persone (${results.people.length})</h4>
                    <div class="search-items">
                        ${results.people.slice(0, 5).map(person => this.createPersonResult(person)).join('')}
                    </div>
                    ${results.people.length > 5 ? `
                        <button class="btn-link show-more" data-type="people">
                            Mostra altre ${results.people.length - 5} persone
                        </button>
                    ` : ''}
                </div>
            `;
        }
        
        this.searchResults.innerHTML = html;
        this.searchResults.style.display = 'block';
        
        // Collega eventi
        this.bindResultEvents();
    }

    /**
     * Crea risultato evento
     */
    createEventResult(event) {
        const formattedDate = this.formatDate(event.date);
        const highlightedTitle = this.highlightText(event.title, this.currentQuery);
        const highlightedDescription = event.description ? this.highlightText(event.description.substring(0, 100), this.currentQuery) : '';
        
        return `
            <div class="search-item" data-type="event" data-id="${event.id}">
                <div class="search-item-header">
                    <h5 class="search-item-title">${highlightedTitle}</h5>
                    <span class="search-item-date">${formattedDate}</span>
                </div>
                ${highlightedDescription ? `
                    <p class="search-item-description">${highlightedDescription}${event.description.length > 100 ? '...' : ''}</p>
                ` : ''}
                <div class="search-item-meta">
                    <span class="tag period-tag">${this.getPeriodLabel(event.period)}</span>
                    <span class="tag importance-tag importance-${event.importance}">
                        ${this.getImportanceLabel(event.importance)}
                    </span>
                    ${event.location ? `<span class="tag location-tag">📍 ${event.location}</span>` : ''}
                </div>
            </div>
        `;
    }

    /**
     * Crea risultato persona
     */
    createPersonResult(person) {
        const highlightedName = this.highlightText(person.name, this.currentQuery);
        const highlightedRole = person.role ? this.highlightText(person.role, this.currentQuery) : '';
        const lifespan = this.getLifespan(person);
        
        return `
            <div class="search-item" data-type="person" data-id="${person.id}">
                <div class="search-item-header">
                    <h5 class="search-item-title">${highlightedName}</h5>
                    <span class="search-item-date">${lifespan}</span>
                </div>
                ${highlightedRole ? `
                    <p class="search-item-description">${highlightedRole}</p>
                ` : ''}
                <div class="search-item-meta">
                    <span class="tag period-tag">${this.getPeriodLabel(person.period)}</span>
                    ${person.death ? '<span class="tag deceased">Deceduto</span>' : '<span class="tag living">Vivente</span>'}
                </div>
            </div>
        `;
    }

    /**
     * Evidenzia il testo cercato
     */
    highlightText(text, query) {
        if (!query) return this.escapeHtml(text);
        
        const escapedText = this.escapeHtml(text);
        const escapedQuery = this.escapeHtml(query);
        const regex = new RegExp(`(${escapedQuery})`, 'gi');
        
        return escapedText.replace(regex, '<mark>$1</mark>');
    }

    /**
     * Mostra suggerimenti
     */
    showSuggestions() {
        if (!this.searchSuggestions || !this.currentQuery) return;
        
        const suggestions = this.generateSuggestions(this.currentQuery);
        
        if (suggestions.length === 0) {
            this.hideSuggestions();
            return;
        }
        
        const html = suggestions.map(suggestion => `
            <div class="suggestion-item" data-suggestion="${this.escapeHtml(suggestion)}">
                <span class="suggestion-text">${this.highlightText(suggestion, this.currentQuery)}</span>
                <span class="suggestion-icon">🔍</span>
            </div>
        `).join('');
        
        this.searchSuggestions.innerHTML = html;
        this.searchSuggestions.style.display = 'block';
        
        // Collega eventi suggerimenti
        this.bindSuggestionEvents();
    }

    /**
     * Nasconde suggerimenti
     */
    hideSuggestions() {
        if (this.searchSuggestions) {
            this.searchSuggestions.style.display = 'none';
        }
    }

    /**
     * Collega eventi dei risultati
     */
    bindResultEvents() {
        this.searchResults?.addEventListener('click', (e) => {
            const searchItem = e.target.closest('.search-item');
            if (searchItem) {
                const type = searchItem.dataset.type;
                const id = searchItem.dataset.id;
                this.navigateToResult(type, id);
            }
            
            // Bottoni "Mostra altro"
            const showMoreBtn = e.target.closest('.show-more');
            if (showMoreBtn) {
                this.showMoreResults(showMoreBtn.dataset.type);
            }
        });
    }

    /**
     * Collega eventi dei suggerimenti
     */
    bindSuggestionEvents() {
        this.searchSuggestions?.addEventListener('click', (e) => {
            const suggestionItem = e.target.closest('.suggestion-item');
            if (suggestionItem) {
                const suggestion = suggestionItem.dataset.suggestion;
                this.searchInput.value = suggestion;
                this.handleSearchInput(suggestion);
                this.hideSuggestions();
            }
        });
    }

    /**
     * Naviga al risultato
     */
    navigateToResult(type, id) {
        this.clearSearch();
        
        if (type === 'event') {
            // Vai alla timeline e evidenzia l'evento
            const timelineTab = document.querySelector('[data-tab="timeline"]');
            if (timelineTab) {
                timelineTab.click();
                if (window.timelineManager) {
                    window.timelineManager.navigateToEvent(id);
                }
            }
        } else if (type === 'person') {
            // Vai alle persone e evidenzia la persona
            const peopleTab = document.querySelector('[data-tab="people"]');
            if (peopleTab) {
                peopleTab.click();
                setTimeout(() => {
                    const personCard = document.querySelector(`[data-person-id="${id}"]`);
                    if (personCard) {
                        personCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        personCard.classList.add('highlighted');
                        setTimeout(() => personCard.classList.remove('highlighted'), 2000);
                    }
                }, 100);
            }
        }
    }

    /**
     * Mostra più risultati
     */
    showMoreResults(type) {
        // Implementa logica per mostrare tutti i risultati
        this.performFullSearch();
    }

    /**
     * Esegue ricerca completa
     */
    performFullSearch() {
        // Cambia alla tab di ricerca se esiste
        const searchTab = document.querySelector('[data-tab="search"]');
        if (searchTab) {
            searchTab.click();
        }
        
        // Filtra timeline e persone
        if (window.timelineManager) {
            window.timelineManager.filterTimelineBySearch(this.currentQuery);
        }
    }

    /**
     * Pulisce la ricerca
     */
    clearSearch() {
        this.currentQuery = '';
        this.searchInput.value = '';
        this.clearResults();
        this.hideSuggestions();
        
        if (this.clearSearchBtn) {
            this.clearSearchBtn.style.display = 'none';
        }
        
        // Ripristina visualizzazioni
        if (window.timelineManager) {
            window.timelineManager.renderTimeline();
        }
        if (window.peopleManager) {
            window.peopleManager.renderPeople();
        }
    }

    /**
     * Pulisce i risultati
     */
    clearResults() {
        if (this.searchResults) {
            this.searchResults.style.display = 'none';
            this.searchResults.innerHTML = '';
        }
    }

    /**
     * Naviga nei suggerimenti con tastiera
     */
    navigateSuggestions(direction) {
        const suggestions = this.searchSuggestions?.querySelectorAll('.suggestion-item');
        if (!suggestions || suggestions.length === 0) return;
        
        const current = this.searchSuggestions.querySelector('.suggestion-item.active');
        let index = current ? Array.from(suggestions).indexOf(current) : -1;
        
        // Rimuovi classe active
        if (current) {
            current.classList.remove('active');
        }
        
        // Calcola nuovo indice
        if (direction === 'down') {
            index = (index + 1) % suggestions.length;
        } else {
            index = index <= 0 ? suggestions.length - 1 : index - 1;
        }
        
        // Aggiungi classe active
        suggestions[index].classList.add('active');
        
        // Aggiorna input
        const suggestion = suggestions[index].dataset.suggestion;
        this.searchInput.value = suggestion;
    }

    // === UTILITÀ ===

    /**
     * Formatta una data
     */
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('it-IT', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    /**
     * Ottiene il periodo di vita
     */
    getLifespan(person) {
        const birth = person.birth ? new Date(person.birth).getFullYear() : '?';
        const death = person.death ? new Date(person.death).getFullYear() : 'presente';
        return `${birth} - ${death}`;
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
     * Ottiene statistiche di ricerca
     */
    getSearchStats() {
        const events = storageManager.getEvents();
        const people = storageManager.getPeople();
        
        return {
            totalSearchableItems: events.length + people.length,
            events: events.length,
            people: people.length,
            lastSearch: this.currentQuery,
            searchesPerformed: this.searchesPerformed || 0
        };
    }
}

// Inizializza il manager di ricerca
window.searchManager = new SearchManager();