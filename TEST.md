# 🧪 Guida ai Test

> Documentazione completa per testare il Sistema di Appunti con Analytics Avanzate

## 📋 Panoramica Testing

Questo documento fornisce procedure di test complete per verificare il corretto funzionamento di tutte le componenti dell'applicazione.

## 🎯 Obiettivi dei Test

- **Funzionalità**: Verificare che tutte le funzionalità funzionino correttamente
- **Performance**: Assicurare tempi di risposta accettabili
- **Compatibilità**: Testare su diversi browser e dispositivi
- **Usabilità**: Verificare l'esperienza utente
- **Sicurezza**: Controllare la gestione dei dati
- **Affidabilità**: Testare la stabilità dell'applicazione

## 🔧 Configurazione Test Environment

### Prerequisiti

1. **Browser di test**:
   - Chrome (ultima versione)
   - Firefox (ultima versione)
   - Safari (se su Mac)
   - Edge (ultima versione)

2. **Strumenti di sviluppo**:
   - DevTools del browser
   - Console JavaScript
   - Network tab per monitoraggio
   - Performance tab per analisi

3. **Dati di test**:
   ```javascript
   // Dati di esempio per i test
   const testData = {
       events: [
           {
               title: "Test Event 1",
               date: "2024-01-15",
               description: "Evento di test per verificare funzionalità",
               importance: 5
           },
           {
               title: "Test Event 2",
               date: "2024-01-20",
               description: "Secondo evento di test",
               importance: 3
           }
       ],
       people: [
           {
               name: "Test Person 1",
               birthDate: "1990-01-01",
               role: "Tester",
               biography: "Persona di test per verificare funzionalità"
           }
       ]
   };
   ```

## 🧪 Test Funzionali

### Test Gestione Eventi

#### TC001: Creazione Evento
**Obiettivo**: Verificare la creazione di un nuovo evento

**Passi**:
1. Aprire l'applicazione
2. Navigare alla sezione "Eventi"
3. Cliccare "Aggiungi Evento"
4. Compilare tutti i campi obbligatori
5. Cliccare "Salva"

**Risultato Atteso**:
- Evento creato e visibile nella lista
- Dati salvati correttamente in localStorage
- Messaggio di conferma mostrato

**Verifica**:
```javascript
// Verifica in console
const events = JSON.parse(localStorage.getItem('appunti_events') || '[]');
console.log('Eventi salvati:', events.length);
```

#### TC002: Modifica Evento
**Obiettivo**: Verificare la modifica di un evento esistente

**Passi**:
1. Selezionare un evento dalla lista
2. Cliccare "Modifica"
3. Cambiare alcuni campi
4. Salvare le modifiche

**Risultato Atteso**:
- Modifiche salvate correttamente
- Lista aggiornata
- Timestamp di modifica aggiornato

#### TC003: Eliminazione Evento
**Obiettivo**: Verificare l'eliminazione di un evento

**Passi**:
1. Selezionare un evento
2. Cliccare "Elimina"
3. Confermare l'eliminazione

**Risultato Atteso**:
- Evento rimosso dalla lista
- Dati rimossi da localStorage
- Conferma dell'operazione

### Test Gestione Persone

#### TC004: Creazione Persona
**Obiettivo**: Verificare l'aggiunta di una nuova persona

**Passi**:
1. Navigare alla sezione "Persone"
2. Cliccare "Aggiungi Persona"
3. Compilare i campi
4. Salvare

**Risultato Atteso**:
- Persona aggiunta alla lista
- Calcolo automatico dell'età
- Dati persistiti

#### TC005: Collegamento Persona-Evento
**Obiettivo**: Verificare il collegamento tra persone ed eventi

**Passi**:
1. Creare/modificare un evento
2. Aggiungere persone coinvolte
3. Salvare
4. Verificare i collegamenti

**Risultato Atteso**:
- Collegamenti salvati correttamente
- Navigazione bidirezionale funzionante

### Test Sistema di Ricerca

#### TC006: Ricerca Base
**Obiettivo**: Verificare la funzionalità di ricerca

**Passi**:
1. Inserire termine di ricerca
2. Premere Invio o cliccare cerca
3. Verificare risultati

**Risultato Atteso**:
- Risultati pertinenti mostrati
- Evidenziazione dei termini trovati
- Filtri funzionanti

#### TC007: Ricerca Avanzata
**Obiettivo**: Testare filtri avanzati

**Passi**:
1. Usare filtri per data
2. Filtrare per tipo
3. Combinare più filtri

**Risultato Atteso**:
- Filtri applicati correttamente
- Risultati aggiornati in tempo reale

### Test Analytics Dashboard

#### TC008: Apertura Dashboard
**Obiettivo**: Verificare l'accesso al dashboard analytics

**Passi**:
1. Cliccare "Analytics Avanzate"
2. Verificare caricamento dashboard
3. Controllare tutte le sezioni

**Risultato Atteso**:
- Dashboard caricata correttamente
- Tutte le sezioni visibili
- Dati mostrati correttamente

**Verifica**:
```javascript
// Verifica inizializzazione analytics
console.log('Analytics Manager:', window.app?.analyticsManager);
console.log('Learning Analytics:', window.app?.learningAnalytics);
```

#### TC009: Metriche Performance
**Obiettivo**: Verificare il calcolo delle metriche

**Passi**:
1. Navigare alla sezione Performance
2. Verificare metriche mostrate
3. Controllare aggiornamenti in tempo reale

**Risultato Atteso**:
- Metriche calcolate correttamente
- Grafici renderizzati
- Dati aggiornati

#### TC010: Esportazione Dati
**Obiettivo**: Testare l'esportazione dei dati analytics

**Passi**:
1. Andare alla sezione esportazione
2. Selezionare formato (JSON/CSV/TXT)
3. Esportare dati

**Risultato Atteso**:
- File generato correttamente
- Formato rispettato
- Dati completi

### Test Sistema di Logging

#### TC011: Generazione Log
**Obiettivo**: Verificare la generazione di log

**Passi**:
1. Eseguire azioni nell'app
2. Controllare console
3. Verificare localStorage

**Risultato Atteso**:
- Log generati per azioni importanti
- Livelli di log rispettati
- Persistenza funzionante

**Verifica**:
```javascript
// Verifica log
const logs = logger.getLogs();
console.log('Log totali:', logs.length);
console.log('Log per livello:', logger.getStats().byLevel);
```

#### TC012: Esportazione Log
**Obiettivo**: Testare l'esportazione dei log

**Passi**:
1. Generare alcuni log
2. Esportare in diversi formati
3. Verificare contenuto

**Risultato Atteso**:
- Export funzionante per tutti i formati
- Dati completi e corretti

## ⚡ Test di Performance

### TC013: Tempo di Caricamento
**Obiettivo**: Misurare i tempi di caricamento

**Procedura**:
```javascript
// Misura performance di caricamento
const startTime = performance.now();
// ... carica applicazione ...
const endTime = performance.now();
console.log(`Tempo di caricamento: ${endTime - startTime}ms`);
```

**Criteri di Accettazione**:
- Caricamento iniziale < 3 secondi
- Navigazione tra sezioni < 500ms
- Apertura modal < 200ms

### TC014: Utilizzo Memoria
**Obiettivo**: Verificare l'uso della memoria

**Procedura**:
```javascript
// Monitora uso memoria
if (performance.memory) {
    console.log('Memoria utilizzata:', performance.memory.usedJSHeapSize);
    console.log('Limite memoria:', performance.memory.jsHeapSizeLimit);
}
```

**Criteri di Accettazione**:
- Uso memoria stabile nel tempo
- Nessun memory leak evidente
- Garbage collection efficace

### TC015: Stress Test
**Obiettivo**: Testare l'app con molti dati

**Procedura**:
```javascript
// Genera molti dati di test
function generateTestData(count) {
    const events = [];
    for (let i = 0; i < count; i++) {
        events.push({
            id: i,
            title: `Test Event ${i}`,
            date: new Date(2024, 0, i % 30 + 1).toISOString(),
            description: `Descrizione evento ${i}`,
            importance: Math.floor(Math.random() * 5) + 1
        });
    }
    return events;
}

// Test con 1000 eventi
const testEvents = generateTestData(1000);
localStorage.setItem('appunti_events', JSON.stringify(testEvents));
location.reload();
```

**Criteri di Accettazione**:
- App funziona con 1000+ eventi
- Performance accettabile
- UI responsive

## 🌐 Test di Compatibilità

### TC016: Test Multi-Browser
**Obiettivo**: Verificare compatibilità cross-browser

**Browser da testare**:
- Chrome (Windows, Mac, Linux)
- Firefox (Windows, Mac, Linux)
- Safari (Mac, iOS)
- Edge (Windows)
- Opera (Windows, Mac)

**Test per ogni browser**:
1. Caricamento applicazione
2. Funzionalità base
3. Analytics dashboard
4. LocalStorage
5. Performance

### TC017: Test Responsive
**Obiettivo**: Verificare design responsive

**Risoluzioni da testare**:
- Mobile: 320px, 375px, 414px
- Tablet: 768px, 1024px
- Desktop: 1280px, 1920px

**Verifica per ogni risoluzione**:
- Layout corretto
- Navigazione funzionante
- Testo leggibile
- Bottoni cliccabili

### TC018: Test Touch
**Obiettivo**: Verificare interazioni touch

**Su dispositivi touch**:
1. Tap su bottoni
2. Swipe per navigazione
3. Pinch to zoom
4. Long press

## 🔒 Test di Sicurezza

### TC019: Validazione Input
**Obiettivo**: Verificare validazione dati input

**Test**:
1. Inserire dati non validi
2. Tentare XSS
3. Inserire caratteri speciali
4. Testare limiti di lunghezza

**Risultato Atteso**:
- Input validato correttamente
- Errori gestiti gracefully
- Nessuna esecuzione di codice malevolo

### TC020: Gestione Errori
**Obiettivo**: Verificare gestione errori

**Scenari**:
1. LocalStorage pieno
2. JavaScript disabilitato
3. Connessione interrotta
4. File mancanti

**Risultato Atteso**:
- Errori gestiti correttamente
- Messaggi informativi
- Graceful degradation

## 📊 Test di Usabilità

### TC021: Navigazione Intuitiva
**Obiettivo**: Verificare facilità di navigazione

**Criteri**:
- Menu chiari e comprensibili
- Breadcrumb funzionanti
- Back button del browser
- Shortcuts da tastiera

### TC022: Accessibilità
**Obiettivo**: Verificare accessibilità WCAG

**Test**:
1. Navigazione con tastiera
2. Screen reader compatibility
3. Contrasto colori
4. Alt text per immagini

## 🔄 Test di Regressione

### TC023: Test Dopo Aggiornamenti
**Obiettivo**: Verificare che nuove funzionalità non rompano quelle esistenti

**Procedura**:
1. Eseguire tutti i test funzionali
2. Verificare compatibilità dati
3. Controllare performance
4. Testare nuove funzionalità

## 📝 Reporting

### Template Report Test

```markdown
# Test Report - [Data]

## Sommario
- Test eseguiti: X/Y
- Test passati: X
- Test falliti: Y
- Copertura: Z%

## Dettagli Test Falliti
### TC001 - Creazione Evento
- **Stato**: FALLITO
- **Errore**: Descrizione errore
- **Passi per riprodurre**: ...
- **Workaround**: ...

## Raccomandazioni
- Lista di azioni da intraprendere
- Priorità dei fix
- Timeline stimata
```

### Metriche di Qualità

```javascript
// Calcolo metriche qualità
const qualityMetrics = {
    testCoverage: (testsPassed / totalTests) * 100,
    bugDensity: bugsFound / linesOfCode,
    performanceScore: averageLoadTime < 3000 ? 'Good' : 'Poor',
    userSatisfaction: userFeedbackScore
};
```

## 🚀 Automazione Test

### Script di Test Automatici

```javascript
// Test runner semplice
class TestRunner {
    constructor() {
        this.tests = [];
        this.results = [];
    }
    
    addTest(name, testFunction) {
        this.tests.push({ name, testFunction });
    }
    
    async runAll() {
        for (const test of this.tests) {
            try {
                await test.testFunction();
                this.results.push({ name: test.name, status: 'PASS' });
                console.log(`✅ ${test.name}: PASS`);
            } catch (error) {
                this.results.push({ 
                    name: test.name, 
                    status: 'FAIL', 
                    error: error.message 
                });
                console.log(`❌ ${test.name}: FAIL - ${error.message}`);
            }
        }
        
        this.printSummary();
    }
    
    printSummary() {
        const passed = this.results.filter(r => r.status === 'PASS').length;
        const total = this.results.length;
        console.log(`\n📊 Test Summary: ${passed}/${total} passed`);
    }
}

// Esempio di utilizzo
const runner = new TestRunner();

runner.addTest('LocalStorage Test', () => {
    localStorage.setItem('test', 'value');
    const value = localStorage.getItem('test');
    if (value !== 'value') throw new Error('LocalStorage not working');
    localStorage.removeItem('test');
});

runner.addTest('Analytics Initialization', () => {
    if (!window.app?.analyticsManager) {
        throw new Error('Analytics Manager not initialized');
    }
});

// Esegui tutti i test
runner.runAll();
```

## 📞 Supporto Testing

Per problemi con i test:

1. **Consulta** questa documentazione
2. **Verifica** setup dell'ambiente
3. **Controlla** log di errore
4. **Documenta** bug trovati

---

**Happy Testing! 🧪✨**