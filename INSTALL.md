# Guida all'Installazione - Cronologia Storica

## Requisiti di Sistema

### Browser Supportati
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

### Requisiti Minimi
- JavaScript abilitato
- LocalStorage disponibile (minimo 10MB)
- Risoluzione schermo: 1024x768 o superiore

## Installazione

### Metodo 1: Download Diretto

1. **Scarica i file**
   ```bash
   git clone https://github.com/username/cronologia-storica.git
   cd cronologia-storica
   ```

2. **Verifica la struttura dei file**
   ```
   cronologia-storica/
   ├── index.html
   ├── config.json
   ├── js/
   │   ├── app.js
   │   ├── events.js
   │   ├── people.js
   │   ├── timeline.js
   │   ├── search.js
   │   ├── storage.js
   │   ├── logger.js
   │   └── backup.js
   └── styles/
       ├── main.css
       ├── timeline.css
       └── forms.css
   ```

3. **Avvia un server locale**
   
   **Opzione A: Python**
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   ```
   
   **Opzione B: Node.js**
   ```bash
   npx http-server -p 8000
   ```
   
   **Opzione C: PHP**
   ```bash
   php -S localhost:8000
   ```

4. **Apri nel browser**
   - Vai su `http://localhost:8000`
   - L'applicazione dovrebbe caricarsi automaticamente

### Metodo 2: Apertura Diretta

1. **Scarica tutti i file** nella stessa cartella
2. **Apri `index.html`** direttamente nel browser
   - **Nota**: Alcune funzionalità potrebbero non funzionare correttamente a causa delle restrizioni CORS

## Configurazione

### 1. Configurazione Base

Modifica il file `config.json` per personalizzare l'applicazione:

```json
{
  "app": {
    "name": "Il Tuo Nome App",
    "language": "it"
  },
  "storage": {
    "prefix": "tuoprefix_",
    "maxBackups": 10
  },
  "ui": {
    "theme": "default",
    "itemsPerPage": 50
  }
}
```

### 2. Personalizzazione Tema

Per personalizzare l'aspetto, modifica i file CSS in `styles/`:

- `main.css`: Stili generali
- `timeline.css`: Stili della timeline
- `forms.css`: Stili dei moduli

### 3. Configurazione Logging

Nel file `config.json`, sezione `logging`:

```json
"logging": {
  "enabled": true,
  "level": "info",
  "maxLogSize": 1000
}
```

Livelli disponibili: `debug`, `info`, `warn`, `error`

## Verifica dell'Installazione

### Test Funzionalità Base

1. **Apri l'applicazione** nel browser
2. **Verifica le tab**: Timeline, Eventi, Persone, Ricerca
3. **Aggiungi un evento di test**:
   - Vai alla tab "Eventi"
   - Clicca "+ Aggiungi Evento"
   - Compila i campi obbligatori
   - Salva
4. **Verifica la timeline**:
   - Vai alla tab "Timeline"
   - L'evento dovrebbe apparire
5. **Test ricerca**:
   - Vai alla tab "Ricerca"
   - Cerca l'evento creato

### Test Funzionalità Avanzate

1. **Test backup**:
   - Apri la console del browser (F12)
   - Digita: `backupManager.createBackup('test')`
   - Verifica che non ci siano errori

2. **Test logging**:
   - Nella console: `logger.info('Test installazione')`
   - Verifica che il log appaia

3. **Test storage**:
   - Ricarica la pagina
   - Verifica che i dati persistano

## Risoluzione Problemi

### Problemi Comuni

#### L'applicazione non si carica
- **Verifica** che tutti i file siano nella stessa cartella
- **Controlla** la console del browser per errori
- **Assicurati** che JavaScript sia abilitato

#### I dati non vengono salvati
- **Verifica** che localStorage sia abilitato
- **Controlla** lo spazio disponibile (almeno 10MB)
- **Prova** in modalità incognito per escludere estensioni

#### Errori CORS
- **Usa un server locale** invece di aprire il file direttamente
- **Verifica** che tutti i file siano serviti dallo stesso dominio

#### Prestazioni lente
- **Riduci** il numero di elementi per pagina in `config.json`
- **Disabilita** il logging se non necessario
- **Pulisci** i dati vecchi periodicamente

### Log di Debug

Per abilitare il debug completo:

1. Modifica `config.json`:
   ```json
   "logging": {
     "level": "debug",
     "logToConsole": true
   }
   ```

2. Apri la console del browser
3. Ricarica l'applicazione
4. Osserva i messaggi di debug

### Backup e Ripristino

#### Backup Manuale
```javascript
// Nella console del browser
backupManager.createBackup('manual');
backupManager.exportBackup('backup_key');
```

#### Ripristino
```javascript
// Lista backup disponibili
backupManager.getAllBackups();

// Ripristina da backup
backupManager.restoreFromBackup('backup_key');
```

## Aggiornamenti

### Aggiornamento Manuale

1. **Backup dei dati**:
   ```javascript
   backupManager.createBackup('pre_update');
   backupManager.exportBackup('latest_backup_key');
   ```

2. **Scarica la nuova versione**
3. **Sostituisci i file** (mantieni `config.json` personalizzato)
4. **Testa l'applicazione**
5. **Ripristina i dati** se necessario

### Migrazione Dati

Per migrare da versioni precedenti:

1. **Esporta i dati** dalla versione vecchia
2. **Installa la nuova versione**
3. **Importa i dati** nella nuova versione

## Supporto

### Documentazione
- `README.md`: Panoramica del progetto
- `CHANGELOG.md`: Cronologia delle modifiche
- `TODO.md`: Funzionalità pianificate

### Segnalazione Bug
1. **Verifica** che il bug non sia già noto
2. **Raccogli informazioni**:
   - Versione browser
   - Passi per riprodurre
   - Log di errore
3. **Crea un issue** nel repository

### Contributi
Vedi `CONTRIBUTING.md` per le linee guida sui contributi.

---

**Versione**: 1.0.0  
**Ultimo aggiornamento**: 2024-01-01  
**Autore**: Pietro