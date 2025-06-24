/**
 * Events Manager - Gestisce la creazione, modifica e visualizzazione degli eventi storici
 */
class EventsManager {
    constructor() {
        this.currentEditingEvent = null;
        this.eventModal = null;
        this.eventForm = null;
        this.eventsGrid = null;
        this.initializeElements();
        this.bindEvents();
    }

    /**
     * Inizializza gli elementi DOM
     */
    initializeElements() {
        this.eventModal = document.getElementById('event-modal');
        this.eventForm = document.getElementById('event-form');
        this.eventsGrid = document.getElementById('events-grid');
        this.addEventBtn = document.getElementById('add-event-btn');
        this.cancelEventBtn = document.getElementById('cancel-event');
        this.modalTitle = document.getElementById('event-modal-title');
        
        // Elementi del form
        this.titleInput = document.getElementById('event-title');
        this.dateInput = document.getElementById('event-date');
        this.periodSelect = document.getElementById('event-period');
        this.descriptionInput = document.getElementById('event-description');
        this.locationInput = document.getElementById('event-location');
        this.peopleInput = document.getElementById('event-people');
        this.importanceSelect = document.getElementById('event-importance');
    }

    /**
     * Collega gli eventi ai gestori
     */
    bindEvents() {
        // Bottone per aggiungere evento
        this.addEventBtn?.addEventListener('click', () => this.openEventModal());
        
        // Bottone per annullare
        this.cancelEventBtn?.addEventListener('click', () => this.closeEventModal());
        
        // Chiusura modal
        this.eventModal?.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', () => this.closeEventModal());
        });
        
        // Chiusura modal cliccando fuori
        this.eventModal?.addEventListener('click', (e) => {
            if (e.target === this.eventModal) {
                this.closeEventModal();
            }
        });
        
        // Submit del form
        this.eventForm?.addEventListener('submit', (e) => this.handleEventSubmit(e));
        
        // Validazione in tempo reale
        this.titleInput?.addEventListener('input', () => this.validateField('title'));
        this.dateInput?.addEventListener('input', () => this.validateField('date'));
    }

    /**
     * Apre il modal per aggiungere/modificare evento
     */
    openEventModal(event = null) {
        this.currentEditingEvent = event;
        
        if (event) {
            this.modalTitle.textContent = 'Modifica Evento';
            this.populateForm(event);
        } else {
            this.modalTitle.textContent = 'Aggiungi Evento';
            this.resetForm();
        }
        
        this.eventModal.classList.add('show');
        this.titleInput?.focus();
    }

    /**
     * Chiude il modal
     */
    closeEventModal() {
        this.eventModal.classList.remove('show');
        this.currentEditingEvent = null;
        this.resetForm();
    }

    /**
     * Popola il form con i dati dell'evento
     */
    populateForm(event) {
        this.titleInput.value = event.title || '';
        this.dateInput.value = event.date || '';
        this.periodSelect.value = event.period || 'modern';
        this.descriptionInput.value = event.description || '';
        this.locationInput.value = event.location || '';
        this.peopleInput.value = Array.isArray(event.people) ? event.people.join(', ') : (event.people || '');
        this.importanceSelect.value = event.importance || 'medium';
    }

    /**
     * Resetta il form
     */
    resetForm() {
        this.eventForm.reset();
        this.clearValidationErrors();
    }

    /**
     * Gestisce il submit del form
     */
    async handleEventSubmit(e) {
        e.preventDefault();
        
        if (!this.validateForm()) {
            return;
        }
        
        const eventData = this.getFormData();
        
        try {
            let result;
            if (this.currentEditingEvent) {
                result = storageManager.updateEvent(this.currentEditingEvent.id, eventData);
            } else {
                result = storageManager.addEvent(eventData);
            }
            
            if (result) {
                this.closeEventModal();
                this.renderEvents();
                this.showSuccessMessage(
                    this.currentEditingEvent ? 'Evento aggiornato con successo!' : 'Evento aggiunto con successo!'
                );
                
                // Aggiorna anche la timeline se visibile
                if (window.timelineManager) {
                    window.timelineManager.renderTimeline();
                }
            } else {
                this.showErrorMessage('Errore nel salvataggio dell\'evento');
            }
        } catch (error) {
            console.error('Errore nel salvataggio:', error);
            this.showErrorMessage('Errore nel salvataggio dell\'evento');
        }
    }

    /**
     * Ottiene i dati dal form
     */
    getFormData() {
        const people = this.peopleInput.value
            .split(',')
            .map(p => p.trim())
            .filter(p => p.length > 0);
            
        return {
            title: this.titleInput.value.trim(),
            date: this.dateInput.value,
            period: this.periodSelect.value,
            description: this.descriptionInput.value.trim(),
            location: this.locationInput.value.trim(),
            people: people,
            importance: this.importanceSelect.value
        };
    }

    /**
     * Valida il form
     */
    validateForm() {
        let isValid = true;
        
        // Valida titolo
        if (!this.titleInput.value.trim()) {
            this.showFieldError('title', 'Il titolo è obbligatorio');
            isValid = false;
        }
        
        // Valida data
        if (!this.dateInput.value) {
            this.showFieldError('date', 'La data è obbligatoria');
            isValid = false;
        }
        
        return isValid;
    }

    /**
     * Valida un singolo campo
     */
    validateField(fieldName) {
        switch (fieldName) {
            case 'title':
                if (this.titleInput.value.trim()) {
                    this.clearFieldError('title');
                }
                break;
            case 'date':
                if (this.dateInput.value) {
                    this.clearFieldError('date');
                }
                break;
        }
    }

    /**
     * Mostra errore per un campo
     */
    showFieldError(fieldName, message) {
        const field = document.getElementById(`event-${fieldName}`);
        const formGroup = field?.closest('.form-group');
        
        if (formGroup) {
            formGroup.classList.add('error');
            
            let errorElement = formGroup.querySelector('.form-error');
            if (!errorElement) {
                errorElement = document.createElement('div');
                errorElement.className = 'form-error';
                formGroup.appendChild(errorElement);
            }
            errorElement.textContent = message;
        }
    }

    /**
     * Rimuove errore per un campo
     */
    clearFieldError(fieldName) {
        const field = document.getElementById(`event-${fieldName}`);
        const formGroup = field?.closest('.form-group');
        
        if (formGroup) {
            formGroup.classList.remove('error');
            const errorElement = formGroup.querySelector('.form-error');
            if (errorElement) {
                errorElement.remove();
            }
        }
    }

    /**
     * Rimuove tutti gli errori di validazione
     */
    clearValidationErrors() {
        this.eventForm?.querySelectorAll('.form-group.error').forEach(group => {
            group.classList.remove('error');
            const errorElement = group.querySelector('.form-error');
            if (errorElement) {
                errorElement.remove();
            }
        });
    }

    /**
     * Renderizza la griglia degli eventi
     */
    renderEvents() {
        if (!this.eventsGrid) return;
        
        const events = storageManager.getEvents();
        
        if (events.length === 0) {
            this.renderEmptyState();
            return;
        }
        
        // Ordina eventi per data
        const sortedEvents = events.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        this.eventsGrid.innerHTML = sortedEvents.map(event => this.createEventCard(event)).join('');
        
        // Collega eventi ai bottoni
        this.bindEventCardActions();
    }

    /**
     * Crea una card per un evento
     */
    createEventCard(event) {
        const formattedDate = this.formatDate(event.date);
        const peopleList = Array.isArray(event.people) ? event.people.join(', ') : event.people || '';
        
        return `
            <div class="card period-${event.period}" data-event-id="${event.id}">
                <div class="card-header">
                    <h3 class="card-title">${this.escapeHtml(event.title)}</h3>
                    <span class="card-date">${formattedDate}</span>
                </div>
                <div class="card-content">
                    ${event.description ? `<p>${this.escapeHtml(event.description)}</p>` : ''}
                    ${event.location ? `<p><strong>Luogo:</strong> ${this.escapeHtml(event.location)}</p>` : ''}
                    ${peopleList ? `<p><strong>Persone:</strong> ${this.escapeHtml(peopleList)}</p>` : ''}
                </div>
                <div class="card-meta">
                    <div class="card-tags">
                        <span class="tag period-tag">${this.getPeriodLabel(event.period)}</span>
                        <span class="tag importance-${event.importance}">${this.getImportanceLabel(event.importance)}</span>
                    </div>
                    <div class="card-actions">
                        <button class="btn-small btn-edit" data-action="edit" data-event-id="${event.id}">
                            ✏️ Modifica
                        </button>
                        <button class="btn-small btn-delete" data-action="delete" data-event-id="${event.id}">
                            🗑️ Elimina
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Renderizza lo stato vuoto
     */
    renderEmptyState() {
        this.eventsGrid.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📅</div>
                <h3 class="empty-state-title">Nessun evento trovato</h3>
                <p class="empty-state-text">Inizia aggiungendo il tuo primo evento storico!</p>
                <button class="btn-primary" onclick="eventsManager.openEventModal()">
                    + Aggiungi il primo evento
                </button>
            </div>
        `;
    }

    /**
     * Collega le azioni delle card degli eventi
     */
    bindEventCardActions() {
        this.eventsGrid?.addEventListener('click', (e) => {
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
    }

    /**
     * Modifica un evento
     */
    editEvent(eventId) {
        const event = storageManager.getEventById(eventId);
        if (event) {
            this.openEventModal(event);
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
                this.renderEvents();
                this.showSuccessMessage('Evento eliminato con successo!');
                
                // Aggiorna anche la timeline se visibile
                if (window.timelineManager) {
                    window.timelineManager.renderTimeline();
                }
            } else {
                this.showErrorMessage('Errore nell\'eliminazione dell\'evento');
            }
        }
    }

    // === UTILITÀ ===

    /**
     * Formatta una data
     */
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('it-IT', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
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
            high: 'Alta',
            critical: 'Critica'
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
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <span class="toast-message">${message}</span>
                <button class="toast-close">&times;</button>
            </div>
        `;
        
        // Aggiungi stili se non esistono
        if (!document.querySelector('#toast-styles')) {
            const styles = document.createElement('style');
            styles.id = 'toast-styles';
            styles.textContent = `
                .toast {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 1rem;
                    border-radius: 8px;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                    z-index: 10000;
                    animation: slideInRight 0.3s ease;
                    max-width: 400px;
                }
                .toast-success { background: #28a745; color: white; }
                .toast-error { background: #dc3545; color: white; }
                .toast-info { background: #17a2b8; color: white; }
                .toast-content {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 1rem;
                }
                .toast-close {
                    background: none;
                    border: none;
                    color: inherit;
                    cursor: pointer;
                    font-size: 1.2rem;
                }
            `;
            document.head.appendChild(styles);
        }
        
        document.body.appendChild(toast);
        
        // Rimuovi il toast
        const removeToast = () => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        };
        
        setTimeout(removeToast, 3000);
        toast.querySelector('.toast-close').addEventListener('click', removeToast);
    }
}

// Inizializza il manager degli eventi
window.eventsManager = new EventsManager();