# Guida Disinstallazione - Cronologia Storica

> Istruzioni complete per rimuovere l'applicazione Cronologia Storica dal tuo sistema.

## 📋 Indice

- [Panoramica](#panoramica)
- [Backup Dati](#backup-dati)
- [Disinstallazione](#disinstallazione)
- [Pulizia Dati](#pulizia-dati)
- [Verifica Rimozione](#verifica-rimozione)
- [Ripristino](#ripristino)
- [Supporto](#supporto)

## 📖 Panoramica

Cronologia Storica è un'applicazione web che utilizza principalmente:
- **File locali**: HTML, CSS, JavaScript
- **LocalStorage**: Per salvare i dati dell'applicazione
- **Nessun servizio di sistema**: Non installa servizi o driver
- **Nessun registro**: Non modifica il registro di Windows

La disinstallazione è semplice e non richiede strumenti speciali.

## 💾 Backup Dati

### ⚠️ IMPORTANTE: Salva i tuoi dati prima di disinstallare

Prima di procedere con la disinstallazione, assicurati di salvare tutti i dati importanti.

### Metodo 1: Export Automatico

1. **Apri l'applicazione**
   ```
   http://localhost:8000
   ```

2. **Vai alla sezione Export**
   - Apri la console del browser (F12)
   - Esegui il comando:
   ```javascript
   storage.exportData('json');
   ```

3. **Salva il file**
   - Il browser scaricherà un file `cronologia_backup_YYYY-MM-DD.json`
   - Conserva questo file in un luogo sicuro

### Metodo 2: Backup Manuale

1. **Apri Console Browser** (F12)

2. **Esporta tutti i dati**
   ```javascript
   // Esporta eventi
   const eventi = localStorage.getItem('cronologia_events');
   console.log('Eventi:', eventi);
   
   // Esporta persone
   const persone = localStorage.getItem('cronologia_people');
   console.log('Persone:', persone);
   
   // Esporta configurazione
   const config = localStorage.getItem('cronologia_config');
   console.log('Config:', config);
   
   // Esporta backup
   const backup = localStorage.getItem('cronologia_backups');
   console.log('Backup:', backup);
   ```

3. **Copia e salva** i dati mostrati in console

### Metodo 3: Backup Completo LocalStorage

```javascript
// Backup completo di tutti i dati Cronologia Storica
const backupData = {};
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  if (key.startsWith('cronologia_')) {
    backupData[key] = localStorage.getItem(key);
  }
}

// Scarica backup
const blob = new Blob([JSON.stringify(backupData, null, 2)], 
  { type: 'application/json' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = `cronologia_full_backup_${new Date().toISOString().split('T')[0]}.json`;
a.click();
URL.revokeObjectURL(url);
```

## 🗑️ Disinstallazione

### Metodo 1: Rimozione File (Raccomandato)

1. **Chiudi il browser** se l'applicazione è aperta

2. **Ferma il server locale** (se in esecuzione)
   - Premi `Ctrl+C` nel terminale dove hai avviato il server
   - Oppure chiudi la finestra del terminale

3. **Elimina la cartella dell'applicazione**
   ```bash
   # Windows
   rmdir /s "c:\Users\pietr\appunti"
   
   # Oppure tramite Esplora File
   # Naviga a c:\Users\pietr\
   # Elimina la cartella "appunti"
   ```

4. **Verifica eliminazione**
   - Controlla che la cartella non esista più
   - Verifica che non ci siano collegamenti sul desktop

### Metodo 2: Disinstallazione Selettiva

Se vuoi mantenere alcuni file ma rimuovere l'applicazione:

1. **Elimina file applicazione**
   ```
   Elimina:
   ├── index.html
   ├── config.json
   ├── js/ (intera cartella)
   ├── styles/ (intera cartella)
   └── file documentazione (opzionale)
   ```

2. **Mantieni file personali**
   ```
   Mantieni:
   ├── backup personali
   ├── export dati
   └── altri file non correlati
   ```

## 🧹 Pulizia Dati

### Pulizia LocalStorage

1. **Apri qualsiasi pagina web**

2. **Apri Console Browser** (F12)

3. **Rimuovi dati Cronologia Storica**
   ```javascript
   // Rimuovi tutti i dati dell'applicazione
   const keysToRemove = [];
   for (let i = 0; i < localStorage.length; i++) {
     const key = localStorage.key(i);
     if (key.startsWith('cronologia_')) {
       keysToRemove.push(key);
     }
   }
   
   keysToRemove.forEach(key => {
     localStorage.removeItem(key);
     console.log('Rimosso:', key);
   });
   
   console.log('Pulizia completata!');
   ```

4. **Verifica pulizia**
   ```javascript
   // Controlla che non ci siano più dati
   const remainingKeys = [];
   for (let i = 0; i < localStorage.length; i++) {
     const key = localStorage.key(i);
     if (key.startsWith('cronologia_')) {
       remainingKeys.push(key);
     }
   }
   
   if (remainingKeys.length === 0) {
     console.log('✅ Tutti i dati sono stati rimossi');
   } else {
     console.log('❌ Dati rimanenti:', remainingKeys);
   }
   ```

### Pulizia Cache Browser

1. **Chrome**
   - `Ctrl+Shift+Delete`
   - Seleziona "Immagini e file memorizzati nella cache"
   - Clicca "Cancella dati"

2. **Firefox**
   - `Ctrl+Shift+Delete`
   - Seleziona "Cache"
   - Clicca "Cancella adesso"

3. **Edge**
   - `Ctrl+Shift+Delete`
   - Seleziona "Immagini e file memorizzati nella cache"
   - Clicca "Cancella"

### Pulizia Cronologia Browser

1. **Rimuovi dalla cronologia**
   - Apri cronologia browser (`Ctrl+H`)
   - Cerca "localhost:8000" o il percorso dell'applicazione
   - Elimina le voci trovate

2. **Rimuovi segnalibri**
   - Controlla i segnalibri per link all'applicazione
   - Elimina eventuali segnalibri trovati

## ✅ Verifica Rimozione

### Checklist Completa

- [ ] **File applicazione eliminati**
  ```bash
  # Verifica che la cartella non esista
  dir "c:\Users\pietr\appunti"
  # Dovrebbe mostrare "File non trovato"
  ```

- [ ] **LocalStorage pulito**
  ```javascript
  // In console browser
  const cronologiaKeys = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith('cronologia_')) {
      cronologiaKeys.push(key);
    }
  }
  console.log('Chiavi rimanenti:', cronologiaKeys.length);
  // Dovrebbe essere 0
  ```

- [ ] **Server fermato**
  ```bash
  # Prova ad accedere
  # http://localhost:8000
  # Dovrebbe mostrare errore di connessione
  ```

- [ ] **Cache browser pulita**
- [ ] **Cronologia browser pulita**
- [ ] **Segnalibri rimossi**

### Test di Verifica

1. **Test accesso applicazione**
   - Prova ad aprire `http://localhost:8000`
   - Dovrebbe mostrare errore di connessione

2. **Test file locali**
   - Prova ad aprire il file `index.html`
   - Il file non dovrebbe esistere

3. **Test dati**
   - Apri console browser su qualsiasi sito
   - Esegui: `localStorage.getItem('cronologia_events')`
   - Dovrebbe restituire `null`

## 🔄 Ripristino

Se hai cambiato idea e vuoi ripristinare l'applicazione:

### Ripristino Completo

1. **Reinstalla applicazione**
   - Segui la [Guida Installazione](./INSTALL.md)

2. **Ripristina dati da backup**
   ```javascript
   // Se hai un file di backup
   // Carica il file e poi:
   storage.importData(backupData);
   ```

3. **Ripristina configurazione**
   - Ricopia il file `config.json` se salvato
   - Oppure riconfigura manualmente

### Ripristino Parziale

```javascript
// Ripristina solo eventi
const eventi = /* dati eventi dal backup */;
localStorage.setItem('cronologia_events', JSON.stringify(eventi));

// Ripristina solo persone
const persone = /* dati persone dal backup */;
localStorage.setItem('cronologia_people', JSON.stringify(persone));
```

## 🆘 Supporto

### Problemi Durante la Disinstallazione

#### File Non Eliminabili

**Causa**: File in uso o permessi insufficienti

**Soluzioni**:
1. Chiudi tutti i browser
2. Riavvia il computer
3. Prova come amministratore:
   ```bash
   # Esegui come amministratore
   rmdir /s /q "c:\Users\pietr\appunti"
   ```

#### LocalStorage Non Pulito

**Causa**: Browser non aggiornato o errori JavaScript

**Soluzioni**:
1. Aggiorna il browser
2. Prova in modalità incognito
3. Usa strumenti sviluppatore:
   - F12 → Application → Storage → Local Storage
   - Elimina manualmente le chiavi

#### Server Ancora Attivo

**Causa**: Processo non terminato correttamente

**Soluzioni**:
1. **Windows**:
   ```bash
   # Trova processi Python
   tasklist | findstr python
   
   # Termina processo (sostituisci PID)
   taskkill /PID <numero_processo> /F
   ```

2. **Task Manager**:
   - Apri Task Manager (`Ctrl+Shift+Esc`)
   - Cerca processi Python o server HTTP
   - Termina i processi trovati

### Script di Disinstallazione Automatica

```batch
@echo off
echo Disinstallazione Cronologia Storica
echo =====================================

echo Fermando eventuali server...
taskkill /F /IM python.exe 2>nul
taskkill /F /IM node.exe 2>nul

echo Eliminando file applicazione...
if exist "c:\Users\pietr\appunti" (
    rmdir /s /q "c:\Users\pietr\appunti"
    echo File eliminati con successo
) else (
    echo Cartella non trovata
)

echo.
echo Disinstallazione completata!
echo Ricorda di pulire manualmente:
echo - LocalStorage del browser
echo - Cache del browser
echo - Cronologia del browser
echo.
pause
```

Salva come `uninstall.bat` ed esegui come amministratore.

### Contatti

Per assistenza durante la disinstallazione:

- **Documentazione**: [DOCUMENTATION.md](./DOCUMENTATION.md)
- **Issues**: [GitHub Issues](https://github.com/user/cronologia-storica/issues)
- **Email**: support@cronologia-storica.com

---

**Nota**: La disinstallazione è irreversibile. Assicurati di aver salvato tutti i dati importanti prima di procedere.

**Ultimo aggiornamento**: 1 Gennaio 2024