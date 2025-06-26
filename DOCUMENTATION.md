# Documentazione - Cronologia Storica

## Indice

1. [Panoramica](#panoramica)
2. [Architettura](#architettura)
3. [Moduli](#moduli)
4. [API Reference](#api-reference)
5. [Configurazione](#configurazione)
6. [Utilizzo](#utilizzo)
7. [Sviluppo](#sviluppo)
8. [Testing](#testing)
9. [Troubleshooting](#troubleshooting)

## Panoramica

Cronologia Storica è un'applicazione web per tracciare e visualizzare eventi storici, persone importanti e creare timeline interattive. L'applicazione è costruita con tecnologie web standard (HTML, CSS, JavaScript) e utilizza localStorage per la persistenza dei dati.

### Caratteristiche Principali

- **Timeline Interattiva**: Visualizzazione cronologica degli eventi
- **Gestione Eventi**: Creazione, modifica ed eliminazione di eventi storici
- **Gestione Persone**: Database di persone storiche con biografie
- **Ricerca Avanzata**: Sistema di ricerca con filtri e suggerimenti
- **Backup Automatico**: Sistema di backup e ripristino dei dati
- **Logging**: Sistema di logging per debugging e monitoraggio
- **Responsive Design**: Interfaccia adattiva per tutti i dispositivi

## Architettura

### Struttura del Progetto

```
appunti/
├── index.html              # Pagina principale
├── config.json             # Configurazione applicazione
├── INSTALL.md              # Guida installazione
├── DOCUMENTATION.md        # Questa documentazione
├── js/                     # Moduli JavaScript
│   ├── app.js             # Manager principale applicazione
│   ├── storage.js         # Gestione dati e localStorage
│   ├── events.js          # Gestione eventi
│   ├── people.js          # Gestione persone
│   ├── timeline.js        # Visualizzazione timeline
│   ├── search.js          # Sistema di ricerca
│   ├── logger.js          # Sistema di logging
│   ├── backup.js          # Sistema di backup
│   └── tests.js           # Suite di test
└── styles/                # Fogli di stile
    ├── main.css           # Stili principali
    ├── timeline.css       # Stili timeline
    └── forms.css          # Stili moduli
```

### Pattern Architetturali

- **Modular Design**: Ogni funzionalità è separata in moduli indipendenti
- **Event-Driven**: Comunicazione tra moduli tramite eventi DOM
- **MVC Pattern**: Separazione tra logica, dati e presentazione
- **Progressive Enhancement**: Funzionalità base senza JavaScript

## Moduli

### AppManager (`app.js`)

Manager principale dell'applicazione che coordina tutti gli altri moduli.

**Responsabilità:**
- Inizializzazione applicazione
- Navigazione tra tab
- Gestione eventi globali
- Coordinamento moduli

**Metodi Principali:**
```javascript
// Inizializza l'applicazione
appManager.init()

// Cambia tab attiva
appManager.setActiveTab(tabName)

// Mostra messaggio all'utente
appManager.showMessage(message, type)
```

### Storage (`storage.js`)

Gestisce la persistenza dei dati utilizzando localStorage.

**Responsabilità:**
- Salvataggio/caricamento dati
- Validazione dati
- Import/export
- Gestione ID univoci

**Struttura Dati:**
```javascript
// Evento
{
  id: 'unique_id',
  title: 'Titolo evento',
  date: '2024-01-01',
  period: 'contemporary',
  description: 'Descrizione',
  location: 'Luogo',
  people: ['persona1', 'persona2'],
  importance: 'high',
  tags: ['tag1', 'tag2'],
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z'
}

// Persona
{
  id: 'unique_id',
  name: 'Nome Cognome',
  birth: '1900-01-01',
  death: '2000-01-01',
  role: 'Ruolo/Professione',
  biography: 'Biografia',
  achievements: 'Realizzazioni',
  period: 'contemporary',
  tags: ['tag1', 'tag2'],
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z'
}
```

### EventsManager (`events.js`)

Gestisce la creazione, modifica e visualizzazione degli eventi.

**Responsabilità:**
- Form di creazione/modifica eventi
- Validazione input
- Rendering lista eventi
- Gestione modal

### PeopleManager (`people.js`)

Gestisce la creazione, modifica e visualizzazione delle persone.

**Responsabilità:**
- Form di creazione/modifica persone
- Calcolo età/durata vita
- Rendering lista persone
- Gestione modal

### TimelineManager (`timeline.js`)

Gestisce la visualizzazione della timeline storica.

**Responsabilità:**
- Rendering timeline
- Filtri e ordinamento
- Raggruppamento per periodo
- Interazioni timeline

### SearchManager (`search.js`)

Implementa il sistema di ricerca avanzata.

**Responsabilità:**
- Ricerca full-text
- Filtri avanzati
- Suggerimenti automatici
- Navigazione risultati

**Algoritmo di Ricerca:**
```javascript
// Calcolo rilevanza
function calculateRelevance(item, query) {
  let score = 0;
  
  // Titolo/Nome (peso 3)
  if (item.title?.toLowerCase().includes(query)) score += 3;
  
  // Descrizione/Biografia (peso 2)
  if (item.description?.toLowerCase().includes(query)) score += 2;
  
  // Altri campi (peso 1)
  if (item.location?.toLowerCase().includes(query)) score += 1;
  
  return score;
}
```

### Logger (`logger.js`)

Sistema di logging per debugging e monitoraggio.

**Livelli di Log:**
- `debug`: Informazioni dettagliate per debugging
- `info`: Informazioni generali
- `warn`: Avvisi
- `error`: Errori

**Utilizzo:**
```javascript
logger.info('Evento creato', { eventId: 'abc123' });
logger.error('Errore nel salvataggio', error);
logger.userAction('click_add_event');
logger.dataChange('event', 'create', 'abc123');
```

### BackupManager (`backup.js`)

Sistema di backup automatico e manuale.

**Caratteristiche:**
- Backup automatico ogni 5 minuti
- Backup prima della chiusura pagina
- Export/import backup
- Gestione versioni multiple

**Utilizzo:**
```javascript
// Backup manuale
const backupKey = backupManager.createBackup('manual');

// Ripristino
backupManager.restoreFromBackup(backupKey);

// Export
backupManager.exportBackup(backupKey);
```

### TestSuite (`tests.js`)

Suite di test automatizzati per verificare il funzionamento.

**Categorie di Test:**
- Storage
- Validazione
- Ricerca
- Timeline
- Backup
- Logger
- UI

## API Reference

### Storage API

#### Eventi

```javascript
// Aggiunge un evento
storage.addEvent(eventData)

// Ottiene un evento per ID
storage.getEvent(eventId)

// Aggiorna un evento
storage.updateEvent(eventId, updates)

// Elimina un evento
storage.deleteEvent(eventId)

// Ottiene tutti gli eventi
storage.getAllEvents()

// Cerca eventi
storage.searchEvents(query, filters)
```

#### Persone

```javascript
// Aggiunge una persona
storage.addPerson(personData)

// Ottiene una persona per ID
storage.getPerson(personId)

// Aggiorna una persona
storage.updatePerson(personId, updates)

// Elimina una persona
storage.deletePerson(personId)

// Ottiene tutte le persone
storage.getAllPeople()

// Cerca persone
storage.searchPeople(query, filters)
```

#### Utilità

```javascript
// Genera ID univoco
storage.generateId()

// Valida evento
storage.validateEvent(eventData)

// Valida persona
storage.validatePerson(personData)

// Export dati
// format può essere 'json' o 'csv'
storage.exportData(format)

// Import dati
storage.importData(data)

// Statistiche
storage.getStats()
```

### Logger API

```javascript
// Logging base
logger.debug(message, data)
logger.info(message, data)
logger.warn(message, data)
logger.error(message, data)

// Logging specializzato
logger.userAction(action, details)
logger.dataChange(type, operation, itemId, changes)

// Gestione log
logger.getAllLogs()
logger.getLogsByLevel(level)
logger.getLogsByDateRange(startDate, endDate)
logger.searchLogs(query)
logger.clearLogs()
logger.exportLogs(format)
```

### Backup API

```javascript
// Gestione backup
backupManager.createBackup(type)
backupManager.getAllBackups()
backupManager.getLatestBackup()
backupManager.restoreFromBackup(backupKey)
backupManager.deleteBackup(backupKey)

// Import/Export
backupManager.exportBackup(backupKey)
backupManager.importBackup(file)

// Configurazione
backupManager.startAutoBackup()
backupManager.stopAutoBackup()
```

## Configurazione

### File config.json

```json
{
  "app": {
    "name": "Cronologia Storica",
    "version": "1.0.0",
    "language": "it"
  },
  "storage": {
    "prefix": "cronologia_",
    "autoSave": true,
    "backupInterval": 300000,
    "maxBackups": 5
  },
  "ui": {
    "theme": "default",
    "itemsPerPage": 20,
    "defaultTab": "timeline"
  },
  "logging": {
    "enabled": true,
    "level": "info",
    "maxLogSize": 1000
  }
}
```

### Personalizzazione

#### Temi

Per creare un tema personalizzato:

1. Copia `styles/main.css`
2. Modifica le variabili CSS:

```css
:root {
  --primary-color: #your-color;
  --secondary-color: #your-color;
  --background-color: #your-color;
  --text-color: #your-color;
}
```

#### Periodi Storici

Per aggiungere nuovi periodi, modifica:

1. `config.json` - sezione periodi
2. CSS per i colori dei periodi
3. Logica di validazione

## Utilizzo

### Workflow Base

1. **Aggiungere Eventi**
   - Vai alla tab "Eventi"
   - Clicca "+ Aggiungi Evento"
   - Compila il form
   - Salva

2. **Aggiungere Persone**
   - Vai alla tab "Persone"
   - Clicca "+ Aggiungi Persona"
   - Compila il form
   - Salva

3. **Visualizzare Timeline**
   - Vai alla tab "Timeline"
   - Usa filtri per periodo
   - Ordina per data/importanza

4. **Ricercare**
   - Vai alla tab "Ricerca"
   - Inserisci query
   - Applica filtri
   - Naviga risultati

### Funzionalità Avanzate

#### Export/Import

```javascript
// Export tutti i dati in JSON
storage.exportData('json');

// Export in CSV
storage.exportData('csv');

// Import da file
const fileInput = document.getElementById('import-file');
fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  storage.importData(file);
});
```

#### Backup/Ripristino

```javascript
// Backup manuale
const backupKey = backupManager.createBackup('manual');

// Lista backup
const backups = backupManager.getAllBackups();

// Ripristino
backupManager.restoreFromBackup(backupKey);
```

## Sviluppo

### Setup Ambiente

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd appunti
   ```

2. **Avvia server locale**
   ```bash
   python -m http.server 8000
   ```

3. **Apri browser**
   ```
   http://localhost:8000
   ```

### Struttura Codice

#### Convenzioni

- **Nomi file**: kebab-case (es. `event-manager.js`)
- **Nomi classi**: PascalCase (es. `EventManager`)
- **Nomi funzioni**: camelCase (es. `createEvent`)
- **Costanti**: UPPER_SNAKE_CASE (es. `MAX_EVENTS`)

#### Commenti

```javascript
/**
 * Descrizione funzione
 * @param {string} param1 - Descrizione parametro
 * @param {Object} param2 - Descrizione oggetto
 * @returns {boolean} Descrizione ritorno
 */
function exampleFunction(param1, param2) {
  // Implementazione
}
```

### Aggiungere Nuove Funzionalità

1. **Crea nuovo modulo**
   ```javascript
   class NewFeatureManager {
     constructor() {
       this.init();
     }
     
     init() {
       // Inizializzazione
     }
   }
   ```

2. **Registra in AppManager**
   ```javascript
   // In app.js
   this.managers.newFeature = new NewFeatureManager();
   ```

3. **Aggiungi test**
   ```javascript
   // In tests.js
   this.addTest('NewFeature - Test', () => this.testNewFeature());
   ```

## Testing

### Esecuzione Test

```javascript
// Tutti i test
runAllTests();

// Test per categoria
runTestCategory('Storage');

// Statistiche
getTestStats();
```

### Tipi di Test

1. **Unit Test**: Test singole funzioni
2. **Integration Test**: Test interazione moduli
3. **UI Test**: Test interfaccia utente
4. **Performance Test**: Test prestazioni

### Aggiungere Test

```javascript
// In tests.js
testSuite.addTest('Nome Test', async () => {
  // Setup
  const testData = { /* dati test */ };
  
  // Azione
  const result = functionToTest(testData);
  
  // Verifica
  if (!result) {
    throw new Error('Test fallito');
  }
});
```

## Troubleshooting

### Problemi Comuni

#### Dati Non Salvati

**Sintomi**: I dati scompaiono al refresh

**Soluzioni**:
1. Verifica localStorage abilitato
2. Controlla spazio disponibile
3. Verifica console per errori

```javascript
// Debug storage
console.log('LocalStorage disponibile:', typeof Storage !== 'undefined');
console.log('Spazio usato:', JSON.stringify(localStorage).length);
```

#### Prestazioni Lente

**Sintomi**: Applicazione lenta con molti dati

**Soluzioni**:
1. Riduci `itemsPerPage` in config
2. Abilita paginazione
3. Ottimizza ricerca

```javascript
// Profiling prestazioni
console.time('operazione');
// ... codice da testare
console.timeEnd('operazione');
```

#### Errori JavaScript

**Sintomi**: Funzionalità non funzionano

**Soluzioni**:
1. Apri console browser (F12)
2. Controlla errori
3. Verifica log applicazione

```javascript
// Debug logging
logger.debug('Debug info', { data: debugData });
console.log('Logger stats:', logger.getLogStats());
```

### Debug Avanzato

#### Modalità Debug

```javascript
// Abilita debug globale
window.DEBUG = true;

// Debug storage
window.debugStorage = () => {
  console.log('Eventi:', storage.getAllEvents());
  console.log('Persone:', storage.getAllPeople());
  console.log('Stats:', storage.getStats());
};

// Debug backup
window.debugBackup = () => {
  console.log('Backup:', backupManager.getAllBackups());
  console.log('Stats:', backupManager.getBackupStats());
};
```

#### Monitoring

```javascript
// Monitor performance
const observer = new PerformanceObserver((list) => {
  list.getEntries().forEach((entry) => {
    logger.debug('Performance', {
      name: entry.name,
      duration: entry.duration
    });
  });
});
observer.observe({ entryTypes: ['measure'] });
```

### Supporto

Per supporto aggiuntivo:

1. **Controlla log**: `logger.getAllLogs()`
2. **Esegui test**: `runAllTests()`
3. **Verifica backup**: `backupManager.getAllBackups()`
4. **Controlla configurazione**: Verifica `config.json`

---

**Versione Documentazione**: 1.0.0  
**Ultimo Aggiornamento**: 2024-01-01  
**Autore**: Pietro