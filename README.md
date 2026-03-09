# Thailand Emergency Assistant

Eine mobile Web-App für Reisende in Thailand, die bei Notfällen und nicht-dringenden Situationen schnelle Hilfe und klare Kommunikation bietet. Die App unterstützt Englisch und Thai und integriert thailändische Notrufnummern (1669, 1155).

Das ursprüngliche Design stammt von [Figma: Emergency Assistance App Prototype](https://www.figma.com/design/g8xT6d1v4UNbsjvDB49oSy/Emergency-Assistance-App-Prototype).

---

## Funktionen

- **Notfall-Modus**: Direkte Anleitung bei medizinischen oder lebensbedrohlichen Notfällen mit Anzeige der thailändischen Notrufnummern
- **Kein Notfall**: Unterstützung bei kleineren Situationen wie:
  - Leichte medizinische Probleme
  - Fahrzeugpanne
  - Verirrt / allgemeine Hilfe
  - Verlorener Pass / Dokumente
- **Standort & Einrichtungen**: GPS-basierte Suche nach nahegelegenen Krankenhäusern, Polizei und Apotheken
- **Profil**: Speicherung von Versicherungsnummer, Nationalität, Geburtsdatum und Notfallkontakten (optional mit Supabase-Account)
- **Mehrsprachig**: Englisch und Thai
- **Dark Mode**: Automatische Anpassung an Systemeinstellungen

---

## Technologie

- **Frontend**: React 18, Vite 6, Tailwind CSS 4, React Router 7
- **Backend**: Supabase (Auth, Datenbank)
- **Icons**: Lucide React

---

## Voraussetzungen

- **Node.js** (Version 18 oder höher empfohlen) – [nodejs.org](https://nodejs.org)
- **npm** (wird mit Node.js mitgeliefert)

---

## Installation

### 1. Projekt klonen oder kopieren

```bash
cd Emergencyapp
```

### 2. Abhängigkeiten installieren

**Wichtig:** Beim Kopieren des Projekts auf einen anderen Rechner fehlt der Ordner `node_modules`. Dieser muss erst erstellt werden:

```bash
npm install
```

oder kurz:

```bash
npm i
```

### 3. Umgebungsvariablen einrichten

Kopiere die Beispiel-Datei und trage deinen Supabase-Anon-Key ein:

```bash
cp .env.example .env
```

Öffne `.env` und setze:

```
VITE_SUPABASE_ANON_KEY=dein_anon_key_hier
```

Den Anon Key findest du im [Supabase Dashboard](https://supabase.com/dashboard) unter:  
**Project Settings → API → Project API keys → anon public**

Ohne gültigen Key funktionieren Login, Registrierung und Profil-Speicherung nicht; die App läuft aber im Gastmodus weiter.

---

## Entwicklung starten

```bash
npm run dev
```

Die App ist dann unter `http://localhost:5173` erreichbar.

---

## Produktions-Build

```bash
npm run build
```

Die fertigen Dateien liegen im Ordner `dist/` und können auf einen beliebigen Webserver hochgeladen werden.

---

## Projektstruktur (Auszug)

```
src/
├── app/
│   ├── components/     # Header, BottomNav, HelpModal, ConsentScreen, …
│   ├── contexts/     # Auth, Profile, Language, Theme, Consent
│   ├── screens/      # Landing, Login, Register, Profile, …
│   ├── routes.tsx    # React Router Konfiguration
│   └── App.tsx
├── styles/           # theme.css, emergency-theme.css
utils/
├── supabase/         # Supabase Client, Profile, Auth, …
└── nearbyPlaces.ts   # Suche nach Krankenhäusern, Polizei, Apotheken
supabase/
└── migrations/       # Datenbank-Schema
```

---

## Fehlerbehebung

### „vite ist entweder falsch geschrieben oder konnte nicht gefunden werden“

**Ursache:** Die Abhängigkeiten wurden noch nicht installiert (z.B. nach dem Kopieren des Projekts).

**Lösung:**

1. Im Projektordner ein Terminal öffnen
2. `npm install` ausführen
3. Anschließend `npm run dev` starten

### Node.js wird nicht erkannt

- Node.js von [nodejs.org](https://nodejs.org) installieren
- Nach der Installation ein **neues Terminal** öffnen (damit die PATH-Variablen geladen werden)
- Mit `node -v` und `npm -v` prüfen, ob die Installation funktioniert

### Supabase-Fehler / Login funktioniert nicht

- Prüfen, ob `.env` existiert und `VITE_SUPABASE_ANON_KEY` gesetzt ist
- Dev-Server nach Änderungen an `.env` neu starten (`Ctrl+C`, dann `npm run dev`)

---

## Lizenz

Private / internes Projekt.
