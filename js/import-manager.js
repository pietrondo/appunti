/**
 * ImportManager - Sistema di importazione dati da testo
 * Estrae automaticamente date, personaggi ed eventi da testo fornito
 */
class ImportManager {
    constructor() {
        this.logger = new Logger('ImportManager');
        this.eventsManager = null;
        this.peopleManager = null;
        this.initializeElements();
    }

    /**
     * Inizializza gli elementi DOM
     */
    initializeElements() {
        this.importModal = null;
        this.importTextarea = null;
        this.importButton = null;
        this.previewContainer = null;
    }

    /**
     * Imposta i riferimenti ai manager
     */
    setManagers(eventsManager, peopleManager) {
        this.eventsManager = eventsManager;
        this.peopleManager = peopleManager;
    }

    /**
     * Crea l'interfaccia di importazione
     */
    createImportInterface() {
        const importHTML = `
            <div id="import-modal" class="modal" style="display: none;">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>📥 Importa Dati da Testo</h2>
                        <span class="close" onclick="importManager.closeImportModal()">&times;</span>
                    </div>
                    <div class="modal-body">
                        <div class="import-instructions">
                            <h3>Istruzioni per l'importazione:</h3>
                            <p>Incolla il testo che contiene informazioni storiche. Il sistema estrarrà automaticamente:</p>
                            <ul>
                                <li>📅 <strong>Date</strong>: anni, date complete, periodi storici</li>
                                <li>👤 <strong>Personaggi</strong>: nomi di persone storiche</li>
                                <li>📝 <strong>Eventi</strong>: descrizioni di eventi storici</li>
                            </ul>
                        </div>
                        
                        <div class="import-form">
                            <label for="import-text">Testo da importare:</label>
                            <textarea id="import-text" placeholder="Incolla qui il testo da cui estrarre i dati..." rows="10"></textarea>
                            
                            <div class="import-options">
                                <label>
                                    <input type="checkbox" id="auto-link" checked>
                                    Collega automaticamente eventi e personaggi
                                </label>
                                <label>
                                    <input type="checkbox" id="validate-dates" checked>
                                    Valida le date estratte
                                </label>
                            </div>
                            
                            <div class="import-actions">
                                <button id="analyze-text" class="btn btn-secondary">🔍 Analizza Testo</button>
                                <button id="import-data" class="btn btn-primary" disabled>📥 Importa Dati</button>
                                <button id="chatgpt-prompt" class="btn btn-info">🤖 Prompt ChatGPT</button>
                                <button id="copy-prompt-btn" class="btn btn-outline">📋 Copia Prompt</button>
                            </div>
                        </div>
                        
                        <div id="import-preview" class="import-preview" style="display: none;">
                            <h3>Anteprima dati estratti:</h3>
                            <div id="preview-content"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', importHTML);
        this.bindImportEvents();
    }

    /**
     * Collega gli eventi dell'interfaccia di importazione
     */
    bindImportEvents() {
        this.importModal = document.getElementById('import-modal');
        this.importTextarea = document.getElementById('import-text');
        this.analyzeButton = document.getElementById('analyze-text');
        this.importButton = document.getElementById('import-data');
        this.previewContainer = document.getElementById('import-preview');
        
        this.analyzeButton.addEventListener('click', () => this.analyzeText());
        this.importButton.addEventListener('click', () => this.importExtractedData());
        document.getElementById('chatgpt-prompt').addEventListener('click', () => this.showChatGPTPrompt());
        
        // Aggiungi event listener per il pulsante di copia rapida
        const copyPromptBtn = document.getElementById('copy-prompt-btn');
        if (copyPromptBtn) {
            copyPromptBtn.addEventListener('click', () => this.copyPromptToClipboard());
        }
    }

    /**
     * Apre il modal di importazione
     */
    openImportModal() {
        if (!this.importModal) {
            this.createImportInterface();
        }
        this.importModal.style.display = 'block';
        this.logger.log('Modal di importazione aperto');
    }

    /**
     * Chiude il modal di importazione
     */
    closeImportModal() {
        if (this.importModal) {
            this.importModal.style.display = 'none';
        }
    }

    /**
     * Analizza il testo e estrae i dati
     */
    analyzeText() {
        const text = this.importTextarea.value.trim();
        if (!text) {
            alert('Inserisci del testo da analizzare');
            return;
        }

        this.logger.log('Inizio analisi testo', { textLength: text.length });
        
        const extractedData = this.extractDataFromText(text);
        this.displayPreview(extractedData);
        
        this.previewContainer.style.display = 'block';
        this.importButton.disabled = false;
        
        this.logger.log('Analisi completata', extractedData);
    }

    /**
     * Estrae dati dal testo usando pattern regex
     */
    extractDataFromText(text) {
        const data = {
            dates: this.extractDates(text),
            people: this.extractPeople(text),
            events: this.extractEvents(text)
        };
        
        return data;
    }

    /**
     * Estrae le date dal testo
     */
    extractDates(text) {
        const datePatterns = [
            // Anni (es. 1492, 476 d.C., 44 a.C.)
            /\b(\d{1,4})\s*(d\.C\.|a\.C\.)?\b/gi,
            // Date complete (es. 12 ottobre 1492)
            /(\d{1,2})\s+(gennaio|febbraio|marzo|aprile|maggio|giugno|luglio|agosto|settembre|ottobre|novembre|dicembre)\s+(\d{4})/gi,
            // Periodi (es. XV secolo, Medioevo)
            /\b(I{1,3}V?|V|VI{1,3}|I?X{1,3})\s*secolo/gi,
            // Periodi storici
            /\b(Medioevo|Rinascimento|Illuminismo|Rivoluzione\s+francese|Prima\s+guerra\s+mondiale|Seconda\s+guerra\s+mondiale)/gi
        ];
        
        const dates = new Set();
        
        datePatterns.forEach(pattern => {
            const matches = text.match(pattern);
            if (matches) {
                matches.forEach(match => dates.add(match.trim()));
            }
        });
        
        return Array.from(dates);
    }

    /**
     * Estrae i personaggi dal testo
     */
    extractPeople(text) {
        // Pattern per nomi propri (maiuscole seguite da minuscole)
        const namePattern = /\b[A-Z][a-z]+\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?/g;
        const matches = text.match(namePattern) || [];
        
        // Filtra nomi comuni e mantieni solo quelli che sembrano nomi di persona
        const commonWords = ['Il', 'La', 'Di', 'Da', 'Del', 'Della', 'San', 'Santa', 'Santo'];
        const people = matches.filter(name => {
            const words = name.split(' ');
            return !commonWords.some(common => words.includes(common));
        });
        
        return [...new Set(people)];
    }

    /**
     * Estrae gli eventi dal testo con migliore associazione date-eventi
     */
    extractEvents(text) {
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
        const events = [];
        
        sentences.forEach(sentence => {
            const trimmed = sentence.trim();
            
            // Cerca pattern di eventi storici
            const eventPatterns = [
                /\b(rivoluzione|guerra|battaglia|trattato|scoperta|fondazione|nascita|morte|conquista|invasione|pace|accordo|costituzione)\b/gi,
                /\b(impero|regno|repubblica|dinastia|confederazione|unione|alleanza)\b/gi,
                /\b(movimento|partito|organizzazione|società|gruppo)\b/gi
            ];
            
            const hasEventKeyword = eventPatterns.some(pattern => pattern.test(trimmed));
            const hasDate = this.containsDate(trimmed);
            
            if (hasEventKeyword || hasDate) {
                const eventData = this.parseEventWithDate(trimmed);
                events.push(eventData);
            }
        });
        
        return events;
    }

    /**
     * Verifica se una frase contiene una data
     */
    containsDate(text) {
        const datePattern = /\b(\d{1,4}|I{1,3}V?|V|VI{1,3}|I?X{1,3}\s*secolo|Medioevo|Rinascimento|fine\s+del|inizi\s+del|dopo\s+il|prima\s+del)/i;
        return datePattern.test(text);
    }

    /**
     * Analizza un evento e estrae la data associata
     */
    parseEventWithDate(eventText) {
        const dateMatch = eventText.match(/\b(\d{4})\b/) || 
                         eventText.match(/\b(I{1,3}V?|V|VI{1,3}|I?X{1,3})\s*secolo\b/i) ||
                         eventText.match(/\b(fine\s+del\s+\w+\s+secolo|inizi\s+del\s+\w+\s+secolo)\b/i);
        
        let extractedDate = null;
        if (dateMatch) {
            extractedDate = dateMatch[0];
        }
        
        return {
            text: eventText,
            date: extractedDate,
            title: this.generateEventTitle(eventText)
        };
    }

    /**
     * Genera un titolo per l'evento basato sul contenuto
     */
    generateEventTitle(eventText) {
        const words = eventText.split(' ');
        
        // Cerca parole chiave per il titolo
        const keywords = ['rivoluzione', 'guerra', 'battaglia', 'trattato', 'scoperta', 'fondazione', 'nascita', 'morte', 'conquista', 'pace', 'accordo'];
        
        for (const keyword of keywords) {
            const index = words.findIndex(word => word.toLowerCase().includes(keyword.toLowerCase()));
            if (index !== -1) {
                // Prendi 3-5 parole intorno alla keyword
                const start = Math.max(0, index - 2);
                const end = Math.min(words.length, index + 3);
                return words.slice(start, end).join(' ');
            }
        }
        
        // Se non trova keywords, prendi le prime 5 parole
        return words.slice(0, 5).join(' ') + (words.length > 5 ? '...' : '');
    }

    /**
     * Mostra l'anteprima dei dati estratti
     */
    displayPreview(data) {
        const previewContent = document.getElementById('preview-content');
        
        let html = '';
        
        if (data.dates.length > 0) {
            html += `
                <div class="preview-section">
                    <h4>📅 Date estratte (${data.dates.length}):</h4>
                    <div class="preview-items">
                        ${data.dates.map(date => `<span class="preview-tag date-tag">${date}</span>`).join('')}
                    </div>
                </div>
            `;
        }
        
        if (data.people.length > 0) {
            html += `
                <div class="preview-section">
                    <h4>👤 Personaggi estratti (${data.people.length}):</h4>
                    <div class="preview-items">
                        ${data.people.map(person => `<span class="preview-tag person-tag">${person}</span>`).join('')}
                    </div>
                </div>
            `;
        }
        
        if (data.events.length > 0) {
            html += `
                <div class="preview-section">
                    <h4>📝 Eventi estratti (${data.events.length}):</h4>
                    <div class="preview-items">
                        ${data.events.map((event, index) => {
                            const eventObj = typeof event === 'object' ? event : { text: event, date: null, title: `Evento ${index + 1}` };
                            return `
                                <div class="preview-event">
                                    <div class="event-header">
                                        <strong>${eventObj.title}</strong>
                                        ${eventObj.date ? `<span class="event-date">📅 ${eventObj.date}</span>` : ''}
                                    </div>
                                    <div class="event-description">${eventObj.text.substring(0, 150)}${eventObj.text.length > 150 ? '...' : ''}</div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            `;
        }
        
        if (html === '') {
            html = '<p class="no-data">⚠️ Nessun dato rilevante estratto dal testo.</p>';
        }
        
        previewContent.innerHTML = html;
    }

    /**
     * Importa i dati estratti nel sistema
     */
    importExtractedData() {
        const text = this.importTextarea.value.trim();
        const extractedData = this.extractDataFromText(text);
        
        let importedCount = 0;
        
        try {
            // Importa personaggi
            extractedData.people.forEach(person => {
                if (this.peopleManager) {
                    this.peopleManager.addPerson({
                        name: person,
                        description: `Importato automaticamente da testo`,
                        importDate: new Date().toISOString()
                    });
                    importedCount++;
                }
            });
            
            // Importa eventi
            extractedData.events.forEach((event, index) => {
                if (this.eventsManager) {
                    const eventObj = typeof event === 'object' ? event : { text: event, date: null, title: `Evento ${index + 1}` };
                    const eventDate = eventObj.date ? this.convertDateToISO(eventObj.date) : this.extractDateFromEvent(eventObj.text);
                    
                    this.eventsManager.addEvent({
                        title: eventObj.title,
                        description: eventObj.text,
                        date: eventDate || new Date().toISOString().split('T')[0],
                        category: 'Importato',
                        importDate: new Date().toISOString()
                    });
                    importedCount++;
                }
            });
            
            this.logger.log('Importazione completata', { 
                importedItems: importedCount,
                people: extractedData.people.length,
                events: extractedData.events.length
            });
            
            alert(`✅ Importazione completata!\n${importedCount} elementi importati con successo.`);
            this.closeImportModal();
            
            // Aggiorna le visualizzazioni
            if (window.appManager) {
                window.appManager.refreshAllViews();
            }
            
        } catch (error) {
            this.logger.error('Errore durante l\'importazione', error);
            alert('❌ Errore durante l\'importazione dei dati.');
        }
    }

    /**
     * Estrae una data da un evento
     */
    extractDateFromEvent(eventText) {
        const yearMatch = eventText.match(/\b(\d{4})\b/);
        if (yearMatch) {
            return `${yearMatch[1]}-01-01`;
        }
        return null;
    }

    /**
     * Converte una data estratta in formato ISO
     */
    convertDateToISO(dateStr) {
        // Gestisce anni semplici
        const yearMatch = dateStr.match(/\b(\d{4})\b/);
        if (yearMatch) {
            return `${yearMatch[1]}-01-01`;
        }
        
        // Gestisce secoli
        const centuryMatch = dateStr.match(/\b(I{1,3}V?|V|VI{1,3}|I?X{1,3})\s*secolo\b/i);
        if (centuryMatch) {
            const romanToNumber = {
                'I': 1, 'II': 2, 'III': 3, 'IV': 4, 'V': 5,
                'VI': 6, 'VII': 7, 'VIII': 8, 'IX': 9, 'X': 10,
                'XI': 11, 'XII': 12, 'XIII': 13, 'XIV': 14, 'XV': 15,
                'XVI': 16, 'XVII': 17, 'XVIII': 18, 'XIX': 19, 'XX': 20
            };
            const century = romanToNumber[centuryMatch[1].toUpperCase()];
            if (century) {
                const year = (century - 1) * 100 + 1;
                return `${year}-01-01`;
            }
        }
        
        // Gestisce periodi come "fine del XVIII secolo"
        const periodMatch = dateStr.match(/\b(fine|inizi)\s+del\s+(\w+)\s+secolo\b/i);
        if (periodMatch) {
            const romanToNumber = {
                'XVIII': 18, 'XIX': 19, 'XX': 20
            };
            const century = romanToNumber[periodMatch[2].toUpperCase()];
            if (century) {
                const baseYear = (century - 1) * 100;
                const year = periodMatch[1].toLowerCase() === 'fine' ? baseYear + 90 : baseYear + 10;
                return `${year}-01-01`;
            }
        }
        
        return null;
    }

    /**
     * Genera il prompt per ChatGPT
     */
    generateChatGPTPrompt() {
        return `
Analizza il seguente testo storico ed estrai informazioni strutturate:

**ISTRUZIONI:**
1. **DATE**: Estrai anni, date complete, periodi storici (es. "XVIII secolo", "fine del 1800")
2. **PERSONAGGI**: Nomi completi di persone storiche con ruoli/professioni se menzionati
3. **EVENTI**: Descrizioni dettagliate con date specifiche associate

**FORMATO RICHIESTO:**

**DATE:**
- 1769
- XVIII secolo
- Fine del XVIII secolo
- 1776
- Tra il 1811 e il 1816
- 1834
- 1848

**PERSONAGGI:**
- James Watt
- David Ricardo
- Robert Malthus
- Robert Owen
- Saint Simon
- Charles Fourier
- Louis Blanc
- Louis Blanqui
- Pierre-Joseph Proudhon
- Karl Marx
- Friedrich Engels

**EVENTI:**
- Perfezionamento della macchina a vapore (1769)
- Dichiarazione di Indipendenza americana (1776)
- Movimento luddista in Inghilterra (1811-1816)
- Fondazione della prima confederazione generale dei lavoratori (1834)
- Pubblicazione del Manifesto del Partito Comunista (1848)
- Sviluppo del pensiero socialista (inizi XIX secolo)
- Rivoluzione industriale (fine XVIII secolo)
- Rivoluzione agricola (XVIII secolo)
- Nascita del proletariato industriale (dopo il 1800)
- Costituzione delle Trade Unions (XIX secolo)

**IMPORTANTE:**
- Associa sempre una data specifica agli eventi quando possibile
- Mantieni le descrizioni degli eventi concise ma informative
- Includi il contesto storico negli eventi

**TESTO DA ANALIZZARE:**
[INCOLLA QUI IL TUO TESTO]
        `;
    }

    /**
     * Mostra il prompt per ChatGPT
     */
    showChatGPTPrompt() {
        const prompt = this.generateChatGPTPrompt();
        
        // Crea modal per il prompt
        const modal = document.createElement('div');
        modal.className = 'prompt-modal';
        modal.innerHTML = `
            <div class="prompt-content">
                <h3>🤖 Prompt per ChatGPT</h3>
                <textarea readonly>${prompt}</textarea>
                <div class="prompt-actions">
                    <button onclick="navigator.clipboard.writeText(this.parentElement.previousElementSibling.value); this.textContent='✅ Copiato!'; setTimeout(() => this.textContent='📋 Copia', 2000)">📋 Copia</button>
                    <button onclick="this.closest('.prompt-modal').remove()">❌ Chiudi</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Chiudi modal cliccando fuori
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    /**
     * Copia il prompt direttamente negli appunti
     */
    async copyPromptToClipboard() {
        try {
            const prompt = this.generateChatGPTPrompt();
            await navigator.clipboard.writeText(prompt);
            
            // Feedback visivo
            const btn = document.getElementById('copyPromptBtn');
            const originalText = btn.textContent;
            btn.textContent = '✅ Copiato!';
            btn.style.backgroundColor = '#28a745';
            
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.backgroundColor = '';
            }, 2000);
            
        } catch (err) {
            console.error('Errore nella copia:', err);
            alert('Errore nella copia del prompt. Prova a usare il pulsante "Prompt ChatGPT" per copiare manualmente.');
        }
    }
}

// Inizializzazione globale
if (typeof window !== 'undefined') {
    window.ImportManager = ImportManager;
}