# 🛡️ hCaptcha Complete Setup

Ein komplettes hCaptcha-Integrations-Setup mit Frontend, Backend und Tests.

## 📋 Features

- ✅ Express.js Backend
- ✅ HTML/CSS Frontend mit hCaptcha Widget
- ✅ Token-Verifizierung über hCaptcha API
- ✅ Dummy Keys für Testing
- ✅ Test Dashboard (Browser)
- ✅ Test Suite (Node.js)
- ✅ CORS aktiviert
- ✅ Fehlerbehandlung

## 🚀 Quick Start

### 1. Dependencies installieren

```bash
cd hcaptcha-project
npm install
```

### 2. Server starten

```bash
npm start
```

Der Server läuft dann auf:
- 🏠 Frontend: http://localhost:3000
- 🧪 Test Dashboard: http://localhost:3000/test
- ⚙️ Config API: http://localhost:3000/api/config

### 3. Tests ausführen

In einem neuen Terminal:

```bash
npm test
```

## 📁 Dateistruktur

```
hcaptcha-project/
├── server.js              # Express Backend
├── test.js               # Test Suite
├── package.json          # Dependencies
├── .env                  # Umgebungsvariablen (mit Dummy Keys)
├── .env.example          # Template für echte Keys
└── public/
    ├── index.html        # Hauptseite mit hCaptcha
    ├── app.js            # Frontend JavaScript
    ├── style.css         # Styling
    └── test.html         # Test Dashboard
```

## 🔑 Echte Keys einrichten

1. Gehe zu https://dashboard.hcaptcha.com
2. Registriere dich kostenlos
3. Erstelle ein neues "Site"
4. Kopiere **Site Key** und **Secret Key**
5. Aktualisiere `.env`:

```bash
HCAPTCHA_SITE_KEY=your-actual-site-key
HCAPTCHA_SECRET_KEY=your-actual-secret-key
```

## 🧪 Testing

### Automatische Tests

```bash
npm test
```

Dies testet:
- Server Status
- Config API
- Verify Endpoint
- Token Validierung
- CORS Headers

### Manuelles Testing

1. Öffne http://localhost:3000
2. Löse das hCaptcha Widget
3. Klicke "Verifizieren"
4. Sehe das Ergebnis

### Test Dashboard

Öffne http://localhost:3000/test für:
- API Tests
- Server Status Check
- System Info
- Live-Ausgabe

## 📡 API Endpoints

### GET `/`
Hauptseite mit hCaptcha Widget

### GET `/api/config`
Lädt die hCaptcha Site Key

```json
{
  "siteKey": "10000000-ffff-ffff-ffff-000000000001",
  "status": "✅ Server läuft"
}
```

### POST `/api/verify-captcha`
Verifiziert einen hCaptcha Token

**Request:**
```json
{
  "token": "P1_eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

**Response (Erfolg):**
```json
{
  "success": true,
  "message": "✅ Verifizierung erfolgreich!",
  "score": 0.9,
  "challenge_ts": "2024-01-15T10:30:45Z",
  "hostname": "localhost"
}
```

**Response (Fehler):**
```json
{
  "success": false,
  "message": "❌ Verifizierung fehlgeschlagen",
  "errors": ["invalid-input-response"]
}
```

## 🔧 Environment Variablen

```bash
PORT=3000                                          # Server Port
HCAPTCHA_SITE_KEY=10000000-ffff-ffff-ffff-...    # Public Key
HCAPTCHA_SECRET_KEY=0x0000000000000000000000...  # Secret Key
NODE_ENV=development                              # Environment
```

## 🎯 Workflow

1. **Nutzer öffnet Seite**
   - Frontend lädt Site Key von Server
   - hCaptcha Widget wird gerendert

2. **Nutzer löst Captcha**
   - Widget generiert einen Token
   - Token wird an Backend gesendet

3. **Backend verifiziert**
   - Sendet Token + Secret Key an hCaptcha API
   - Erhält Verifizierungsergebnis

4. **Nutzer sieht Ergebnis**
   - Erfolgsmeldung oder Fehler

## 📊 Logs & Debugging

Der Server logt alle Requests:

```
🚀 hCaptcha Server läuft!
📍 http://localhost:3000
🧪 Test: http://localhost:3000/test
⚙️ Config: http://localhost:3000/api/config

📍 2024-01-15T10:30:45Z - GET /
📍 2024-01-15T10:30:46Z - GET /api/config
🔍 Verifiziere Token...
✅ Verifizierung erfolgreich!
```

## 🐛 Troubleshooting

### Server startet nicht
```bash
# Port ist bereits in Verwendung?
kill -9 $(lsof -t -i:3000)
npm start
```

### hCaptcha Widget wird nicht angezeigt
- Öffne Browser Console (F12)
- Prüfe auf Fehler
- Stelle sicher, dass Site Key vorhanden ist

### Verifizierung schlägt fehl
- Prüfe `.env` auf korrekte Keys
- Stelle sicher, dass Internet verbunden ist
- Siehe Server Logs für Details

## 📚 Weitere Ressourcen

- [hCaptcha Dokumentation](https://docs.hcaptcha.com)
- [hCaptcha Dashboard](https://dashboard.hcaptcha.com)
- [Express.js Docs](https://expressjs.com)
- [Node-Fetch Docs](https://github.com/node-fetch/node-fetch)

## 📝 Lizenz

MIT License - Frei verwendbar

## 🎉 Viel Spaß!

Bei Fragen oder Problemen, schau in die Logs oder öffne ein GitHub Issue! 🚀
