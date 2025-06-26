# 📚 Sistema di Appunti con Analytics Avanzate

> Un'applicazione web moderna per tracciare eventi storici, gestire appunti e analizzare l'apprendimento con dashboard analytics integrata.

[![Versione](https://img.shields.io/badge/versione-1.1.0-blue.svg)](./CHANGELOG.md)
[![Licenza](https://img.shields.io/badge/licenza-GPL--3.0-green.svg)](./LICENSE)
[![Stato](https://img.shields.io/badge/stato-analytics--edition-brightgreen.svg)](#)
[![Nuove Funzionalità](https://img.shields.io/badge/analytics-dashboard-orange.svg)](#)

## 📋 Indice

- [Caratteristiche](#caratteristiche)
- [Demo](#demo)
- [Installazione](#installazione)
- [Utilizzo](#utilizzo)
- [Documentazione](#documentazione)
- [Sviluppo](#sviluppo)
- [Contribuire](#contribuire)
- [Licenza](#licenza)
- [Supporto](#supporto)

## ✨ Caratteristiche

### 🎯 Funzionalità Principali

- **📅 Timeline Interattiva**: Visualizzazione cronologica degli eventi con filtri avanzati
- **📝 Gestione Eventi**: Creazione, modifica ed eliminazione di eventi storici dettagliati
- **👥 Database Persone**: Gestione completa di persone storiche con biografie
- **🔍 Ricerca Avanzata**: Sistema di ricerca full-text con suggerimenti automatici
- **📊 Analytics Dashboard**: Dashboard interattiva per analisi dell'apprendimento
- **🤖 Analisi Predittiva**: Algoritmi per prevedere performance e suggerire miglioramenti
- **🎯 Feedback Adattivo**: Sistema di raccomandazioni personalizzate
- **📈 Metriche Performance**: Tracciamento dettagliato di progressi e utilizzo
- **💾 Backup Automatico**: Sistema di backup e ripristino dati integrato
- **📊 Logging Avanzato**: Sistema di logging multi-livello con esportazione
- **📱 Design Responsive**: Interfaccia adattiva per tutti i dispositivi

### 🛠️ Caratteristiche Tecniche

- **🚀 Zero Dipendenze**: Costruito con tecnologie web standard (HTML, CSS, JavaScript)
- **💾 Storage Locale**: Dati salvati in localStorage del browser
- **☁️ Cloud Storage (opzionale)**: Integrazione sperimentale con [Supabase](https://supabase.com) per sincronizzare i dati gratuitamente
- **🔧 Architettura Modulare**: Sistema di manager specializzati per ogni funzionalità
- **⚙️ ConfigManager**: Gestione centralizzata delle configurazioni
- **📝 Logger System**: Sistema di logging completo con livelli e esportazione
- **📊 Analytics Engine**: Motore di analisi con algoritmi predittivi
- **🧪 Testato**: Suite di test automatizzati integrata
- **📖 Documentato**: Documentazione completa e API reference
- **🎨 Personalizzabile**: Temi CSS e configurazione flessibile
- **📱 Progressive Web App**: Supporto per installazione e uso offline

## 🎮 Demo

### Screenshot

```
┌─────────────────────────────────────────────────────────────┐
│ 📅 Timeline    📝 Eventi    👥 Persone    🔍 Ricerca      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  🏛️ Antichità     🏰 Medioevo     🎨 Rinascimento          │
│  ⚔️ Guerre        🔬 Moderna      🌐 Contemporanea         │
│                                                             │
│  📊 1453 - Caduta di Costantinopoli                       │
│      🏛️ Evento di alta importanza                          │
│      📍 Costantinopoli (Istanbul)                          │
│      👥 Mehmet II, Costantino XI                           │
│                                                             │
│  📊 1492 - Scoperta dell'America                          │
│      🌊 Evento di alta importanza                          │
│      📍 Americhe                                            │
│      👥 Cristoforo Colombo                                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Funzionalità in Azione

- **Aggiunta Eventi**: Modal intuitivo con validazione in tempo reale
- **Filtri Timeline**: Filtra per periodo storico, importanza, persone coinvolte
- **Ricerca Intelligente**: Suggerimenti automatici e risultati rilevanti
- **Backup Automatico**: Salvataggio automatico ogni 5 minuti

## 🚀 Installazione

### Metodo 1: Download Diretto

1. **Scarica i file**
   ```bash
   git clone https://github.com/pietrondo/appunti.git
   cd appunti
   ```

2. **Avvia l'applicazione**
   ```bash
   npm start
   ```

3. **Apri nel browser**
   ```
   http://localhost:8000
   ```

### Metodo 2: Apertura Diretta

1. **Scarica i file**
2. **Apri `index.html`** direttamente nel browser
3. **Nota**: Alcune funzionalità potrebbero essere limitate

### Requisiti Sistema

- **Browser Moderno**: Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
- **JavaScript Abilitato**: Richiesto per tutte le funzionalità
- **LocalStorage**: Per il salvataggio dati (5-10MB disponibili)

## 📖 Utilizzo

### Guida Rapida

1. **🎯 Primo Avvio**
   - Apri l'applicazione nel browser
   - L'applicazione si inizializza automaticamente
   - Inizia dalla tab "Timeline" per una panoramica

2. **📝 Aggiungere Eventi**
   ```
   Tab "Eventi" → "+ Aggiungi Evento" → Compila form → Salva
   ```
   - **Campi obbligatori**: Titolo, Data, Periodo
   - **Campi opzionali**: Descrizione, Luogo, Persone, Importanza

3. **👥 Aggiungere Persone**
   ```
   Tab "Persone" → "+ Aggiungi Persona" → Compila form → Salva
   ```
   - **Campi obbligatori**: Nome, Periodo
   - **Campi opzionali**: Date, Ruolo, Biografia, Realizzazioni

4. **🔍 Ricerca**
   ```
   Tab "Ricerca" → Inserisci query → Applica filtri → Naviga risultati
   ```
   - **Ricerca full-text** su tutti i campi
   - **Filtri avanzati** per periodo, tipo, importanza
   - **Suggerimenti automatici** durante la digitazione

### Funzionalità Avanzate

#### 💾 Backup e Ripristino

```javascript
// Backup manuale
backupManager.createBackup('manual');

// Lista backup disponibili
backupManager.getAllBackups();

// Ripristino da backup
backupManager.restoreFromBackup('backup_key');
```

#### 📊 Export/Import Dati

```javascript
// Export tutti i dati
storage.exportData('json');

// Import da file
storage.importData(fileData);
```

#### 🔧 Configurazione

Modifica `config.json` per personalizzare:

```json
{
  "ui": {
    "theme": "default",
    "itemsPerPage": 20,
    "defaultTab": "timeline"
  },
  "storage": {
    "autoSave": true,
    "backupInterval": 300000
  }
}
```

## 📚 Documentazione

### File Documentazione

- **[📖 DOCUMENTATION.md](./DOCUMENTATION.md)**: Documentazione completa
- **[🚀 INSTALL.md](./INSTALL.md)**: Guida installazione dettagliata
- **[📝 CHANGELOG.md](./CHANGELOG.md)**: Storia delle modifiche
- **[⚖️ LICENSE](./LICENSE)**: Termini di licenza

### API Reference

#### Storage API

```javascript
// Eventi
storage.addEvent(eventData)        // Aggiunge evento
storage.getEvent(eventId)          // Ottiene evento
storage.updateEvent(id, updates)   // Aggiorna evento
storage.deleteEvent(eventId)       // Elimina evento
storage.getAllEvents()             // Ottiene tutti gli eventi

// Persone
storage.addPerson(personData)      // Aggiunge persona
storage.getPerson(personId)        // Ottiene persona
storage.updatePerson(id, updates)  // Aggiorna persona
storage.deletePerson(personId)     // Elimina persona
storage.getAllPeople()             // Ottiene tutte le persone
```

#### Logger API

```javascript
logger.info('Messaggio info', data);     // Log informativo
logger.warn('Messaggio warning', data);  // Log warning
logger.error('Messaggio errore', error); // Log errore
logger.userAction('click_button');       // Log azione utente
logger.dataChange('event', 'create');    // Log modifica dati
```

## 🛠️ Sviluppo

### Setup Ambiente

1. **Clone Repository**
   ```bash
   git clone https://github.com/pietrondo/appunti.git
   cd appunti
   ```

2. **Avvia Development Server**
   ```bash
   python -m http.server 8000
   ```

3. **Apri Browser**
   ```
   http://localhost:8000
   ```

### Struttura Progetto

```
appunti/
├── 📄 index.html              # Pagina principale
├── ⚙️ config.json             # Configurazione
├── 📚 DOCUMENTATION.md        # Documentazione
├── 🚀 INSTALL.md              # Guida installazione
├── 📝 CHANGELOG.md            # Storia modifiche
├── ⚖️ LICENSE                 # Licenza
├── 📖 README.md               # Questo file
├── 📁 js/                     # Moduli JavaScript
│   ├── 🎯 app.js             # Manager principale
│   ├── 💾 storage.js         # Gestione dati
│   ├── 📅 events.js          # Gestione eventi
│   ├── 👥 people.js          # Gestione persone
│   ├── 📊 timeline.js        # Timeline
│   ├── 🔍 search.js          # Ricerca
│   ├── 📝 logger.js          # Logging
│   ├── 💾 backup.js          # Backup
│   └── 🧪 tests.js           # Test suite
└── 📁 styles/                 # Fogli di stile
    ├── 🎨 main.css           # Stili principali
    ├── 📊 timeline.css       # Stili timeline
    └── 📝 forms.css          # Stili moduli
```

### Testing

```javascript
// Esegui tutti i test
runAllTests();

// Test per categoria
runTestCategory('Storage');

// Statistiche test
getTestStats();
```

Per eseguire i test da riga di comando:

```bash
npm test
```

### Convenzioni Codice

- **File**: kebab-case (`event-manager.js`)
- **Classi**: PascalCase (`EventManager`)
- **Funzioni**: camelCase (`createEvent`)
- **Costanti**: UPPER_SNAKE_CASE (`MAX_EVENTS`)

## 🤝 Contribuire

### Come Contribuire

1. **Fork del repository**
2. **Crea branch feature** (`git checkout -b feature/nuova-funzionalita`)
3. **Commit modifiche** (`git commit -am 'Aggiunge nuova funzionalità'`)
4. **Push al branch** (`git push origin feature/nuova-funzionalita`)
5. **Crea Pull Request**

### Linee Guida

- ✅ Segui le convenzioni di codice esistenti
- ✅ Aggiungi test per nuove funzionalità
- ✅ Aggiorna la documentazione
- ✅ Testa su browser multipli
- ✅ Mantieni file sotto 500 righe

### Aree di Contribuzione

- 🐛 **Bug Fix**: Correzione errori
- ✨ **Nuove Funzionalità**: Implementazione features
- 📖 **Documentazione**: Miglioramento docs
- 🎨 **UI/UX**: Miglioramenti interfaccia
- 🧪 **Testing**: Aggiunta test
- 🔧 **Performance**: Ottimizzazioni

## ⚖️ Licenza

Questo progetto è rilasciato sotto licenza **GPL-3.0**. Vedi il file [LICENSE](./LICENSE) per i dettagli completi.

### Riassunto Licenza

- ✅ **Uso commerciale** consentito
- ✅ **Modifica** consentita
- ✅ **Distribuzione** consentita
- ✅ **Uso privato** consentito
- ❗ **Responsabilità** limitata
- ❗ **Garanzia** non fornita
- 📋 **Codice sorgente** deve rimanere aperto

## 🆘 Supporto

### Ottenere Aiuto

1. **📖 Consulta la documentazione**: [DOCUMENTATION.md](./DOCUMENTATION.md)
2. **🔍 Cerca nei problemi esistenti**: [Issues](https://github.com/pietrondo/appunti/issues)
3. **❓ Crea nuovo issue**: Descrivi il problema dettagliatamente
4. **💬 Discussioni**: [Discussions](https://github.com/pietrondo/appunti/discussions)

### Problemi Comuni

#### 💾 Dati Non Salvati
```javascript
// Debug storage
console.log('LocalStorage disponibile:', typeof Storage !== 'undefined');
console.log('Spazio usato:', JSON.stringify(localStorage).length);
```

#### 🐌 Prestazioni Lente
- Riduci `itemsPerPage` in `config.json`
- Abilita paginazione
- Controlla dimensione dati

#### 🚫 Errori JavaScript
- Apri console browser (F12)
- Controlla errori nella console
- Verifica log applicazione

### Debug Mode

```javascript
// Abilita debug globale
window.DEBUG = true;

// Debug storage
window.debugStorage();

// Debug backup
window.debugBackup();

// Esegui test
runAllTests();
```

## 📊 Statistiche

- **📁 File**: 15+ file sorgente
- **📝 Righe di codice**: ~3000+ righe
- **🧪 Test**: 50+ test automatizzati
- **📖 Documentazione**: 100% coperta
- **🌐 Browser supportati**: 4 principali
- **📱 Responsive**: 100% mobile-friendly

## 🗺️ Roadmap

### Versione 1.3.0 (Q1 2025)
- 🌙 Tema scuro migliorato
- `npm start` per avvio rapido
- Documentazione aggiornata

### Versione 2.0.0 (Q2 2025)
- ☁️ Sincronizzazione cloud via Supabase
- 👥 Collaborazione multi-utente
- 🔌 Sistema plugin
- 📄 Export PDF avanzato

### Versione 3.0.0 (Q4 2025)
- 🏗️ Architettura completamente rinnovata
- 🚀 Performance migliorate
- 🤖 Funzionalità AI evolute
- 🌍 Internazionalizzazione

---

<div align="center">

**Cronologia Storica** - Preserva la storia, costruisci il futuro

[🌟 Stella su GitHub](https://github.com/pietrondo/appunti) •
[🐛 Segnala Bug](https://github.com/pietrondo/appunti/issues) •
[💡 Richiedi Feature](https://github.com/pietrondo/appunti/issues) •
[📖 Documentazione](./DOCUMENTATION.md)

Realizzato con ❤️ da [Pietro](https://github.com/pietrondo)

</div>
