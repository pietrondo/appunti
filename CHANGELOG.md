# Changelog

Tutte le modifiche importanti a questo progetto saranno documentate in questo file.

Il formato è basato su [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
e questo progetto aderisce al [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Non Rilasciato]

### Aggiunto
- **Sistema di Importazione Dati da Testo**
  - Estrazione automatica di date, personaggi ed eventi da testo
  - Interfaccia intuitiva con anteprima dei dati estratti
  - Supporto per pattern regex avanzati per riconoscimento date
  - Integrazione con ChatGPT tramite prompt personalizzato
  - Validazione e collegamento automatico tra entità
  - Importazione batch con feedback in tempo reale

### Corretto
- **Sistema Analytics - v1.1.3**
  - Risolto TypeError: `this.calculateLearningVelocity is not a function`
  - Implementato metodo `calculateLearningVelocity` per calcolo velocità di apprendimento
  - Aggiunto metodo `generateVelocityRecommendations` per suggerimenti basati su velocità
  - Aggiornato cache-busting a v=1.3
- **Sistema Analytics - v1.1.2**
  - Risolto TypeError: `this.calculateReviewIntervals is not a function`
  - Implementati metodi per analisi spaced repetition: `calculateReviewIntervals`, `calculateIntervalEffectiveness`, `generateIntervalRecommendations`
  - Sistema di analisi intervalli di ripetizione ora completamente funzionale
- **Sistema Analytics - v1.1.1**
  - Risolto TypeError: this.analyzeQuizPerformance is not a function
  - Implementati metodi mancanti nella classe LearningAnalytics:
    - analyzeQuizPerformance() - Analisi performance quiz
    - analyzeFlashcardRetention() - Analisi ritenzione flashcard
    - calculateImprovementTrend() - Calcolo trend miglioramento
    - identifyWeakAreas() - Identificazione aree deboli
    - identifyStrongAreas() - Identificazione aree forti
    - calculateImprovementRate() - Calcolo tasso miglioramento
  - Aggiunto cache-busting per forzare reload dei file JavaScript
  - Migliorato sistema di logging per tracciare correzioni

## [1.1.0] - 2024-12-19

### Aggiunto
- **Sistema di Analytics Avanzate**
  - Dashboard interattiva con metriche di performance
  - Analisi predittiva per il miglioramento dello studio
  - Sistema di feedback adattivo
  - Confronto con i pari e analisi collaborative
  - Grafici e visualizzazioni in tempo reale
  - Esportazione dati in JSON, CSV e TXT

- **Gestione Configurazioni**
  - ConfigManager centralizzato per tutte le impostazioni
  - Configurazioni per app, studio, analytics, mappe mentali
  - Validazione e schema per generazione UI
  - Import/export configurazioni

- **Sistema di Logging**
  - Logger completo con livelli (error, warn, info, debug, trace)
  - Persistenza in localStorage
  - Filtri avanzati per data, livello, contenuto
  - Esportazione log in multipli formati
  - Statistiche e analisi dei log
  - Gestione errori automatica

- **Interfaccia Analytics**
  - Dashboard responsive con sezioni dedicate
  - Animazioni fluide e transizioni
  - Supporto dark mode
  - Navigazione intuitiva tra sezioni
  - Metriche in tempo reale

### Modificato
- Struttura modulare migliorata per tutti i componenti
- Integrazione sistema configurazione e logging in app.js
- Aggiornamento index.html con nuove funzionalità analytics

### Corretto
- Tag script malformati in index.html
- Gestione errori migliorata nel sistema di logging

### Pianificato
- Integrazione con API esterne per dati storici
- Modalità offline completa
- Sincronizzazione cloud
- Temi personalizzabili avanzati
- Export in formati aggiuntivi (PDF, XML)
- Collaborazione multi-utente
- Plugin system

## [1.0.0] - 2024-01-01

### Aggiunto
- **Applicazione Base**
  - Struttura HTML principale (`index.html`)
  - Sistema di navigazione a tab
  - Design responsive per tutti i dispositivi
  - Supporto per temi CSS

- **Gestione Eventi**
  - Creazione, modifica ed eliminazione eventi storici
  - Campi: titolo, data, periodo, descrizione, luogo, persone coinvolte, importanza
  - Validazione completa dei dati
  - Modal per inserimento/modifica
  - Lista eventi con filtri e ordinamento

- **Gestione Persone**
  - Database di persone storiche
  - Campi: nome, date nascita/morte, ruolo, biografia, realizzazioni, periodo
  - Calcolo automatico età e durata vita
  - Modal per inserimento/modifica
  - Lista persone con filtri

- **Timeline Storica**
  - Visualizzazione cronologica degli eventi
  - Filtri per periodo storico
  - Ordinamento per data e importanza
  - Raggruppamento per periodo/decennio
  - Interfaccia interattiva

- **Sistema di Ricerca**
  - Ricerca full-text su eventi e persone
  - Filtri avanzati per periodo, importanza, tipo
  - Suggerimenti automatici durante la digitazione
  - Navigazione risultati con evidenziazione
  - Calcolo rilevanza risultati

- **Storage e Persistenza**
  - Salvataggio automatico in localStorage
  - Validazione dati completa
  - Generazione ID univoci
  - Gestione timestamp creazione/modifica
  - Sistema di migrazione dati

- **Sistema di Backup**
  - Backup automatico ogni 5 minuti
  - Backup manuale su richiesta
  - Backup prima della chiusura pagina
  - Gestione versioni multiple (max 5)
  - Export/import backup in JSON
  - Ripristino selettivo
  - Statistiche backup

- **Sistema di Logging**
  - Log multi-livello (debug, info, warn, error)
  - Tracking azioni utente
  - Monitoraggio modifiche dati
  - Gestione errori globali
  - Export log in JSON/CSV
  - Ricerca e filtri nei log
  - Statistiche utilizzo

- **Configurazione**
  - File `config.json` per impostazioni
  - Configurazione storage, UI, logging
  - Impostazioni backup e timeline
  - Parametri di ricerca e validazione

- **Testing**
  - Suite di test automatizzati
  - Test per tutti i moduli principali
  - Test di integrazione
  - Report dettagliati
  - Statistiche test

- **Documentazione**
  - Guida installazione (`INSTALL.md`)
  - Documentazione completa (`DOCUMENTATION.md`)
  - Questo changelog
  - Commenti inline nel codice
  - API reference

- **Moduli JavaScript**
  - `app.js`: Manager principale applicazione
  - `storage.js`: Gestione dati e localStorage
  - `events.js`: Gestione eventi storici
  - `people.js`: Gestione persone
  - `timeline.js`: Visualizzazione timeline
  - `search.js`: Sistema di ricerca
  - `logger.js`: Sistema di logging
  - `backup.js`: Sistema di backup
  - `tests.js`: Suite di test

- **Stili CSS**
  - `main.css`: Stili principali e layout
  - `timeline.css`: Stili specifici timeline
  - `forms.css`: Stili moduli e modal
  - Design responsive
  - Variabili CSS per temi

### Caratteristiche Tecniche

- **Architettura Modulare**
  - Separazione responsabilità
  - Pattern MVC
  - Event-driven communication
  - Progressive enhancement

- **Performance**
  - Lazy loading componenti
  - Debounce per ricerca
  - Paginazione risultati
  - Ottimizzazione rendering

- **Sicurezza**
  - Sanitizzazione input
  - Prevenzione XSS
  - Validazione lato client
  - Escape HTML

- **Accessibilità**
  - Supporto screen reader
  - Navigazione da tastiera
  - Contrasto colori
  - Etichette ARIA

- **Browser Support**
  - Chrome 80+
  - Firefox 75+
  - Safari 13+
  - Edge 80+

### Limitazioni Note

- Dati salvati solo localmente (localStorage)
- Limite dimensioni dati (circa 5-10MB)
- Nessuna sincronizzazione tra dispositivi
- Backup manuali per sicurezza dati

## [0.9.0] - 2023-12-15 (Beta)

### Aggiunto
- Prototipo iniziale
- Struttura base HTML/CSS
- Gestione eventi basilare
- Storage localStorage

### Modificato
- Migliorata interfaccia utente
- Ottimizzata struttura dati

### Rimosso
- Dipendenze esterne non necessarie

## [0.5.0] - 2023-12-01 (Alpha)

### Aggiunto
- Concept iniziale
- Mockup interfaccia
- Analisi requisiti

---

## Tipi di Modifiche

- **Aggiunto** per nuove funzionalità
- **Modificato** per cambiamenti a funzionalità esistenti
- **Deprecato** per funzionalità che saranno rimosse
- **Rimosso** per funzionalità rimosse
- **Corretto** per bug fix
- **Sicurezza** per vulnerabilità

## Versioning

Questo progetto usa [Semantic Versioning](https://semver.org/):

- **MAJOR**: Cambiamenti incompatibili
- **MINOR**: Nuove funzionalità compatibili
- **PATCH**: Bug fix compatibili

## Contribuire

Per contribuire al progetto:

1. Aggiorna questo changelog per ogni modifica
2. Segui il formato [Keep a Changelog](https://keepachangelog.com/)
3. Usa [Conventional Commits](https://conventionalcommits.org/) per i commit
4. Testa tutte le modifiche prima del commit

## Link

- [Repository](https://github.com/user/cronologia-storica)
- [Issues](https://github.com/user/cronologia-storica/issues)
- [Releases](https://github.com/user/cronologia-storica/releases)
- [Documentazione](./DOCUMENTATION.md)
- [Installazione](./INSTALL.md)