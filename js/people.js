/**
 * People Manager - Gestisce la creazione, modifica e visualizzazione delle persone storiche
 */
class PeopleManager {
    constructor() {
        this.currentEditingPerson = null;
        this.personModal = null;
        this.personForm = null;
        this.peopleGrid = null;
        this.initializeElements();
        this.bindEvents();
    }

    /**
     * Inizializza gli elementi DOM
     */
    initializeElements() {
        this.personModal = document.getElementById('person-modal');
        this.personForm = document.getElementById('person-form');
        this.peopleGrid = document.getElementById('people-grid');
        this.addPersonBtn = document.getElementById('add-person-btn');
        this.cancelPersonBtn = document.getElementById('cancel-person');
        this.modalTitle = document.getElementById('person-modal-title');
        
        // Elementi del form
        this.nameInput = document.getElementById('person-name');
        this.birthInput = document.getElementById('person-birth');
        this.deathInput = document.getElementById('person-death');
        this.roleInput = document.getElementById('person-role');
        this.biographyInput = document.getElementById('person-biography');
        this.achievementsInput = document.getElementById('person-achievements');
        this.periodSelect = document.getElementById('person-period');
    }

    /**
     * Collega gli eventi ai gestori
     */
    bindEvents() {
        // Bottone per aggiungere persona
        this.addPersonBtn?.addEventListener('click', () => this.openPersonModal());
        
        // Bottone per annullare
        this.cancelPersonBtn?.addEventListener('click', () => this.closePersonModal());
        
        // Chiusura modal
        this.personModal?.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', () => this.closePersonModal());
        });
        
        // Chiusura modal cliccando fuori
        this.personModal?.addEventListener('click', (e) => {
            if (e.target === this.personModal) {
                this.closePersonModal();
            }
        });
        
        // Submit del form
        this.personForm?.addEventListener('submit', (e) => this.handlePersonSubmit(e));
        
        // Validazione in tempo reale
        this.nameInput?.addEventListener('input', () => this.validateField('name'));
        this.birthInput?.addEventListener('input', () => this.validateDateFields());
        this.deathInput?.addEventListener('input', () => this.validateDateFields());
    }

    /**
     * Apre il modal per aggiungere/modificare persona
     */
    openPersonModal(person = null) {
        this.currentEditingPerson = person;
        
        if (person) {
            this.modalTitle.textContent = 'Modifica Persona';
            this.populateForm(person);
        } else {
            this.modalTitle.textContent = 'Aggiungi Persona';
            this.resetForm();
        }
        
        this.personModal.classList.add('show');
        this.nameInput?.focus();
    }

    /**
     * Chiude il modal
     */
    closePersonModal() {
        this.personModal.classList.remove('show');
        this.currentEditingPerson = null;
        this.resetForm();
    }

    /**
     * Popola il form con i dati della persona
     */
    populateForm(person) {
        this.nameInput.value = person.name || '';
        this.birthInput.value = person.birth || '';
        this.deathInput.value = person.death || '';
        this.roleInput.value = person.role || '';
        this.biographyInput.value = person.biography || '';
        this.achievementsInput.value = person.achievements || '';
        this.periodSelect.value = person.period || 'modern';
    }

    /**
     * Resetta il form
     */
    resetForm() {
        this.personForm.reset();
        this.clearValidationErrors();
    }

    /**
     * Gestisce il submit del form
     */
    async handlePersonSubmit(e) {
        e.preventDefault();
        
        if (!this.validateForm()) {
            return;
        }
        
        const personData = this.getFormData();
        
        try {
            let result;
            if (this.currentEditingPerson) {
                result = storageManager.updatePerson(this.currentEditingPerson.id, personData);
            } else {
                result = storageManager.addPerson(personData);
            }
            
            if (result) {
                this.closePersonModal();
                this.renderPeople();
                this.showSuccessMessage(
                    this.currentEditingPerson ? 'Persona aggiornata con successo!' : 'Persona aggiunta con successo!'
                );
            } else {
                this.showErrorMessage('Errore nel salvataggio della persona');
            }
        } catch (error) {
            console.error('Errore nel salvataggio:', error);
            this.showErrorMessage('Errore nel salvataggio della persona');
        }
    }

    /**
     * Ottiene i dati dal form
     */
    getFormData() {
        return {
            name: this.nameInput.value.trim(),
            birth: this.birthInput.value,
            death: this.deathInput.value,
            role: this.roleInput.value.trim(),
            biography: this.biographyInput.value.trim(),
            achievements: this.achievementsInput.value.trim(),
            period: this.periodSelect.value
        };
    }

    /**
     * Valida il form
     */
    validateForm() {
        let isValid = true;
        
        // Valida nome
        if (!this.nameInput.value.trim()) {
            this.showFieldError('name', 'Il nome è obbligatorio');
            isValid = false;
        }
        
        // Valida date
        if (!this.validateDateFields()) {
            isValid = false;
        }
        
        return isValid;
    }

    /**
     * Valida i campi data
     */
    validateDateFields() {
        const birthDate = this.birthInput.value;
        const deathDate = this.deathInput.value;
        
        if (birthDate && deathDate) {
            const birth = new Date(birthDate);
            const death = new Date(deathDate);
            
            if (death <= birth) {
                this.showFieldError('death', 'La data di morte deve essere successiva alla nascita');
                return false;
            } else {
                this.clearFieldError('death');
            }
        }
        
        return true;
    }

    /**
     * Valida un singolo campo
     */
    validateField(fieldName) {
        switch (fieldName) {
            case 'name':
                if (this.nameInput.value.trim()) {
                    this.clearFieldError('name');
                }
                break;
        }
    }

    /**
     * Mostra errore per un campo
     */
    showFieldError(fieldName, message) {
        const field = document.getElementById(`person-${fieldName}`);
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
        const field = document.getElementById(`person-${fieldName}`);
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
        this.personForm?.querySelectorAll('.form-group.error').forEach(group => {
            group.classList.remove('error');
            const errorElement = group.querySelector('.form-error');
            if (errorElement) {
                errorElement.remove();
            }
        });
    }

    /**
     * Renderizza la griglia delle persone
     */
    renderPeople() {
        if (!this.peopleGrid) return;
        
        const people = storageManager.getPeople();
        
        if (people.length === 0) {
            this.renderEmptyState();
            return;
        }
        
        // Ordina persone per nome
        const sortedPeople = people.sort((a, b) => a.name.localeCompare(b.name));
        
        this.peopleGrid.innerHTML = sortedPeople.map(person => this.createPersonCard(person)).join('');
        
        // Collega eventi ai bottoni
        this.bindPersonCardActions();
    }

    /**
     * Crea una card per una persona
     */
    createPersonCard(person) {
        const lifespan = this.getLifespan(person);
        const age = this.calculateAge(person);
        
        return `
            <div class="card period-${person.period}" data-person-id="${person.id}">
                <div class="card-header">
                    <h3 class="card-title">${this.escapeHtml(person.name)}</h3>
                    <span class="card-date">${lifespan}</span>
                </div>
                <div class="card-content">
                    ${person.role ? `<p><strong>Ruolo:</strong> ${this.escapeHtml(person.role)}</p>` : ''}
                    ${age ? `<p><strong>Età:</strong> ${age}</p>` : ''}
                    ${person.biography ? `<p class="biography">${this.escapeHtml(person.biography)}</p>` : ''}
                    ${person.achievements ? `<p><strong>Realizzazioni:</strong> ${this.escapeHtml(person.achievements)}</p>` : ''}
                </div>
                <div class="card-meta">
                    <div class="card-tags">
                        <span class="tag period-tag">${this.getPeriodLabel(person.period)}</span>
                        ${person.death ? '<span class="tag deceased">Deceduto</span>' : '<span class="tag living">Vivente</span>'}
                    </div>
                    <div class="card-actions">
                        <button class="btn-small btn-edit" data-action="edit" data-person-id="${person.id}">
                            ✏️ Modifica
                        </button>
                        <button class="btn-small btn-delete" data-action="delete" data-person-id="${person.id}">
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
        this.peopleGrid.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">👥</div>
                <h3 class="empty-state-title">Nessuna persona trovata</h3>
                <p class="empty-state-text">Inizia aggiungendo la tua prima persona storica!</p>
                <button class="btn-primary" onclick="peopleManager.openPersonModal()">
                    + Aggiungi la prima persona
                </button>
            </div>
        `;
    }

    /**
     * Collega le azioni delle card delle persone
     */
    bindPersonCardActions() {
        this.peopleGrid?.addEventListener('click', (e) => {
            const action = e.target.dataset.action;
            const personId = e.target.dataset.personId;
            
            if (action && personId) {
                switch (action) {
                    case 'edit':
                        this.editPerson(personId);
                        break;
                    case 'delete':
                        this.deletePerson(personId);
                        break;
                }
            }
        });
    }

    /**
     * Modifica una persona
     */
    editPerson(personId) {
        const person = storageManager.getPersonById(personId);
        if (person) {
            this.openPersonModal(person);
        }
    }

    /**
     * Elimina una persona
     */
    deletePerson(personId) {
        const person = storageManager.getPersonById(personId);
        if (!person) return;
        
        if (confirm(`Sei sicuro di voler eliminare "${person.name}"?`)) {
            if (storageManager.deletePerson(personId)) {
                this.renderPeople();
                this.showSuccessMessage('Persona eliminata con successo!');
            } else {
                this.showErrorMessage('Errore nell\'eliminazione della persona');
            }
        }
    }

    /**
     * Filtra le persone per periodo
     */
    filterPeopleByPeriod(period) {
        const people = storageManager.getPeople();
        const filteredPeople = period === 'all' ? people : people.filter(p => p.period === period);
        
        if (filteredPeople.length === 0) {
            this.peopleGrid.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">🔍</div>
                    <h3 class="empty-state-title">Nessuna persona trovata</h3>
                    <p class="empty-state-text">Non ci sono persone per il periodo selezionato.</p>
                </div>
            `;
            return;
        }
        
        const sortedPeople = filteredPeople.sort((a, b) => a.name.localeCompare(b.name));
        this.peopleGrid.innerHTML = sortedPeople.map(person => this.createPersonCard(person)).join('');
        this.bindPersonCardActions();
    }

    // === UTILITÀ ===

    /**
     * Ottiene il periodo di vita
     */
    getLifespan(person) {
        const birth = person.birth ? this.formatYear(person.birth) : '?';
        const death = person.death ? this.formatYear(person.death) : 'presente';
        return `${birth} - ${death}`;
    }

    /**
     * Calcola l'età
     */
    calculateAge(person) {
        if (!person.birth) return null;
        
        const birthDate = new Date(person.birth);
        const endDate = person.death ? new Date(person.death) : new Date();
        
        let age = endDate.getFullYear() - birthDate.getFullYear();
        const monthDiff = endDate.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && endDate.getDate() < birthDate.getDate())) {
            age--;
        }
        
        return age > 0 ? `${age} anni` : null;
    }

    /**
     * Formatta un anno da una data
     */
    formatYear(dateString) {
        const date = new Date(dateString);
        return date.getFullYear();
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
     * Escape HTML per prevenire XSS
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Ottiene le persone per un evento
     */
    getPeopleForEvent(eventPeople) {
        if (!Array.isArray(eventPeople)) return [];
        
        const allPeople = storageManager.getPeople();
        return eventPeople.map(personName => {
            return allPeople.find(p => p.name.toLowerCase() === personName.toLowerCase()) || {
                name: personName,
                id: null
            };
        });
    }

    /**
     * Ottiene suggerimenti per l'autocompletamento
     */
    getPeopleSuggestions(query) {
        const people = storageManager.getPeople();
        const lowerQuery = query.toLowerCase();
        
        return people
            .filter(person => person.name.toLowerCase().includes(lowerQuery))
            .map(person => person.name)
            .slice(0, 5);
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
                .tag.deceased { background: #6c757d; color: white; }
                .tag.living { background: #28a745; color: white; }
                .biography { font-style: italic; margin: 0.5rem 0; }
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

// Inizializza il manager delle persone
window.peopleManager = new PeopleManager();