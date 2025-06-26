/**
 * Export Manager - Gestisce l'importazione e esportazione dei dati dell'applicazione
 */
class ExportManager {
    constructor() {
        this.storageManager = null;
        this.logger = null;
        this.supportedFormats = ['json'];
        this.exportData = {
            version: '1.0',
            timestamp: null,
            events: [],
            people: [],
            settings: {}
        };
    }

    /**
     * Imposta i manager necessari
     */
    setManagers(storageManager, logger = null) {
        this.storageManager = storageManager;
        this.logger = logger;
    }

    /**
     * Crea l'interfaccia per import/export
     */
    createExportInterface() {
        const exportModal = document.createElement('div');
        exportModal.id = 'export-modal';
        exportModal.className = 'modal';
        exportModal.innerHTML = `
            <div class="modal-content export-modal-content">
                <div class="modal-header">
                    <h2>📦 Import/Export Dati</h2>
                    <span class="close" onclick="document.getElementById('export-modal').style.display='none'">&times;</span>
                </div>
                <div class="modal-body">
                    <div class="export-tabs">
                        <button class="tab-btn active" data-tab="export">📤 Esporta</button>
                        <button class="tab-btn" data-tab="import">📥 Importa</button>
                    </div>
                    
                    <!-- Tab Esportazione -->
                    <div id="export-tab" class="tab-content active">
                        <div class="export-section">
                            <h3>Esporta i tuoi dati</h3>
                            <p>Scarica tutti i tuoi dati in un file JSON per trasferirli su un altro dispositivo.</p>
                            
                            <div class="export-options">
                                <label>
                                    <input type="checkbox" id="export-events" checked>
                                    Eventi storici (${this.getEventsCount()} elementi)
                                </label>
                                <label>
                                    <input type="checkbox" id="export-people" checked>
                                    Personaggi storici (${this.getPeopleCount()} elementi)
                                </label>
                                <label>
                                    <input type="checkbox" id="export-settings" checked>
                                    Impostazioni dell'applicazione
                                </label>
                            </div>
                            
                            <div class="export-actions">
                                <button id="export-btn" class="btn btn-primary">📤 Esporta Dati</button>
                                <button id="preview-export-btn" class="btn btn-secondary">👁️ Anteprima</button>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Tab Importazione -->
                    <div id="import-tab" class="tab-content">
                        <div class="import-section">
                            <h3>Importa i tuoi dati</h3>
                            <p>Carica un file JSON precedentemente esportato per ripristinare i tuoi dati.</p>
                            
                            <div class="import-options">
                                <div class="file-upload">
                                    <input type="file" id="import-file" accept=".json" style="display: none;">
                                    <button id="select-file-btn" class="btn btn-outline">📁 Seleziona File</button>
                                    <span id="file-name" class="file-name"></span>
                                </div>
                                
                                <div class="import-preview" id="import-preview" style="display: none;">
                                    <h4>Anteprima dati da importare:</h4>
                                    <div id="import-preview-content"></div>
                                </div>
                                
                                <div class="import-mode">
                                    <label>
                                        <input type="radio" name="import-mode" value="merge" checked>
                                        Unisci con dati esistenti
                                    </label>
                                    <label>
                                        <input type="radio" name="import-mode" value="replace">
                                        Sostituisci tutti i dati esistenti
                                    </label>
                                </div>
                            </div>
                            
                            <div class="import-actions">
                                <button id="import-btn" class="btn btn-success" disabled>📥 Importa Dati</button>
                                <button id="validate-btn" class="btn btn-info" disabled>✅ Valida File</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(exportModal);
        this.bindExportEvents();
    }

    /**
     * Collega gli eventi dell'interfaccia
     */
    bindExportEvents() {
        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabName = e.target.dataset.tab;
                this.switchTab(tabName);
            });
        });

        // Export events
        document.getElementById('export-btn').addEventListener('click', () => this.exportData());
        document.getElementById('preview-export-btn').addEventListener('click', () => this.previewExport());

        // Import events
        document.getElementById('select-file-btn').addEventListener('click', () => {
            document.getElementById('import-file').click();
        });
        
        document.getElementById('import-file').addEventListener('change', (e) => {
            this.handleFileSelection(e.target.files[0]);
        });
        
        document.getElementById('validate-btn').addEventListener('click', () => this.validateImportFile());
        document.getElementById('import-btn').addEventListener('click', () => this.importData());
    }

    /**
     * Cambia tab attiva
     */
    switchTab(tabName) {
        // Rimuovi classe active da tutti i tab
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        
        // Aggiungi classe active al tab selezionato
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        document.getElementById(`${tabName}-tab`).classList.add('active');
    }

    /**
     * Ottiene il numero di eventi
     */
    getEventsCount() {
        if (!this.storageManager) return 0;
        const events = this.storageManager.getEvents();
        return events ? events.length : 0;
    }

    /**
     * Ottiene il numero di persone
     */
    getPeopleCount() {
        if (!this.storageManager) return 0;
        const people = this.storageManager.getPeople();
        return people ? people.length : 0;
    }

    /**
     * Prepara i dati per l'esportazione
     */
    prepareExportData() {
        const exportEvents = document.getElementById('export-events').checked;
        const exportPeople = document.getElementById('export-people').checked;
        const exportSettings = document.getElementById('export-settings').checked;

        const data = {
            version: '1.0',
            timestamp: new Date().toISOString(),
            appName: 'Sistema di Appunti con Analytics Avanzate',
            events: exportEvents ? this.storageManager.getEvents() : [],
            people: exportPeople ? this.storageManager.getPeople() : [],
            settings: exportSettings ? this.storageManager.getSettings() : {}
        };

        return data;
    }

    /**
     * Esporta i dati in un file JSON
     */
    exportData() {
        try {
            const data = this.prepareExportData();
            const jsonString = JSON.stringify(data, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `appunti-storici-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            this.showSuccessMessage('Dati esportati con successo!');
            
            if (this.logger) {
                this.logger.log('Export completed', 'info', {
                    eventsCount: data.events.length,
                    peopleCount: data.people.length,
                    hasSettings: Object.keys(data.settings).length > 0
                });
            }
            
        } catch (error) {
            console.error('Errore nell\'esportazione:', error);
            this.showErrorMessage('Errore durante l\'esportazione dei dati');
            
            if (this.logger) {
                this.logger.log('Export failed', 'error', { error: error.message });
            }
        }
    }

    /**
     * Mostra anteprima dei dati da esportare
     */
    previewExport() {
        const data = this.prepareExportData();
        const preview = {
            'Versione': data.version,
            'Data creazione': new Date(data.timestamp).toLocaleString('it-IT'),
            'Eventi': data.events.length,
            'Personaggi': data.people.length,
            'Impostazioni': Object.keys(data.settings).length > 0 ? 'Incluse' : 'Non incluse'
        };

        let previewHtml = '<div class="export-preview"><h4>Anteprima esportazione:</h4>';
        for (const [key, value] of Object.entries(preview)) {
            previewHtml += `<div class="preview-item"><strong>${key}:</strong> ${value}</div>`;
        }
        previewHtml += '</div>';

        // Mostra in un modal temporaneo
        const previewModal = document.createElement('div');
        previewModal.className = 'modal';
        previewModal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>👁️ Anteprima Esportazione</h3>
                    <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
                </div>
                <div class="modal-body">
                    ${previewHtml}
                </div>
            </div>
        `;
        
        document.body.appendChild(previewModal);
        previewModal.style.display = 'block';
    }

    /**
     * Gestisce la selezione del file
     */
    handleFileSelection(file) {
        if (!file) return;
        
        if (file.type !== 'application/json') {
            this.showErrorMessage('Seleziona un file JSON valido');
            return;
        }
        
        document.getElementById('file-name').textContent = file.name;
        document.getElementById('validate-btn').disabled = false;
        
        this.selectedFile = file;
    }

    /**
     * Valida il file di importazione
     */
    validateImportFile() {
        if (!this.selectedFile) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                if (this.isValidImportData(data)) {
                    this.showImportPreview(data);
                    document.getElementById('import-btn').disabled = false;
                    this.importFileData = data;
                } else {
                    this.showErrorMessage('File non valido: struttura dati non riconosciuta');
                }
                
            } catch (error) {
                this.showErrorMessage('File non valido: errore nel parsing JSON');
            }
        };
        
        reader.readAsText(this.selectedFile);
    }

    /**
     * Valida la struttura dei dati di importazione
     */
    isValidImportData(data) {
        return data && 
               typeof data === 'object' &&
               data.version &&
               Array.isArray(data.events) &&
               Array.isArray(data.people) &&
               typeof data.settings === 'object';
    }

    /**
     * Mostra anteprima dei dati da importare
     */
    showImportPreview(data) {
        const preview = {
            'Versione': data.version,
            'Data creazione': data.timestamp ? new Date(data.timestamp).toLocaleString('it-IT') : 'Non disponibile',
            'Eventi da importare': data.events.length,
            'Personaggi da importare': data.people.length,
            'Impostazioni': Object.keys(data.settings).length > 0 ? 'Presenti' : 'Assenti'
        };

        let previewHtml = '<div class="import-data-preview">';
        for (const [key, value] of Object.entries(preview)) {
            previewHtml += `<div class="preview-item"><strong>${key}:</strong> ${value}</div>`;
        }
        previewHtml += '</div>';

        const previewContainer = document.getElementById('import-preview');
        document.getElementById('import-preview-content').innerHTML = previewHtml;
        previewContainer.style.display = 'block';
    }

    /**
     * Importa i dati dal file
     */
    importData() {
        if (!this.importFileData) {
            this.showErrorMessage('Nessun file valido selezionato');
            return;
        }
        
        const importMode = document.querySelector('input[name="import-mode"]:checked').value;
        
        try {
            if (importMode === 'replace') {
                this.replaceAllData(this.importFileData);
            } else {
                this.mergeData(this.importFileData);
            }
            
            this.showSuccessMessage('Dati importati con successo!');
            document.getElementById('export-modal').style.display = 'none';
            
            // Ricarica la pagina per aggiornare tutte le viste
            setTimeout(() => {
                window.location.reload();
            }, 1500);
            
            if (this.logger) {
                this.logger.log('Import completed', 'info', {
                    mode: importMode,
                    eventsImported: this.importFileData.events.length,
                    peopleImported: this.importFileData.people.length
                });
            }
            
        } catch (error) {
            console.error('Errore nell\'importazione:', error);
            this.showErrorMessage('Errore durante l\'importazione dei dati');
            
            if (this.logger) {
                this.logger.log('Import failed', 'error', { error: error.message });
            }
        }
    }

    /**
     * Sostituisce tutti i dati esistenti
     */
    replaceAllData(data) {
        this.storageManager.saveEvents(data.events);
        this.storageManager.savePeople(data.people);
        if (Object.keys(data.settings).length > 0) {
            this.storageManager.saveSettings(data.settings);
        }
    }

    /**
     * Unisce i dati con quelli esistenti
     */
    mergeData(data) {
        // Unisci eventi
        const existingEvents = this.storageManager.getEvents();
        const mergedEvents = [...existingEvents, ...data.events];
        this.storageManager.saveEvents(mergedEvents);
        
        // Unisci persone
        const existingPeople = this.storageManager.getPeople();
        const mergedPeople = [...existingPeople, ...data.people];
        this.storageManager.savePeople(mergedPeople);
        
        // Unisci impostazioni
        if (Object.keys(data.settings).length > 0) {
            const existingSettings = this.storageManager.getSettings();
            const mergedSettings = { ...existingSettings, ...data.settings };
            this.storageManager.saveSettings(mergedSettings);
        }
    }

    /**
     * Apre il modal di export
     */
    openExportModal() {
        if (!document.getElementById('export-modal')) {
            this.createExportInterface();
        }
        document.getElementById('export-modal').style.display = 'block';
    }

    /**
     * Mostra messaggio di successo
     */
    showSuccessMessage(message) {
        // Implementazione del messaggio di successo
        const toast = document.createElement('div');
        toast.className = 'toast success';
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    /**
     * Mostra messaggio di errore
     */
    showErrorMessage(message) {
        // Implementazione del messaggio di errore
        const toast = document.createElement('div');
        toast.className = 'toast error';
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
}

// Esporta la classe per l'uso in altri moduli
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ExportManager;
}