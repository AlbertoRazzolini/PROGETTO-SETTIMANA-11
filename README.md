# Spotify Redux

Applicazione simil-Spotify minimale realizzata con **React**, **Redux Toolkit** e **React-Bootstrap**, con ricerca di brani in tempo reale tramite l'API di Deezer, gestione dei preferiti e un player audio puramente estetico.

## Indice

- [Panoramica](#panoramica)
- [Stack tecnologico](#stack-tecnologico)
- [Struttura del progetto (scaffolding)](#struttura-del-progetto-scaffolding)
- [Stato Redux](#stato-redux)
- [Funzionalità](#funzionalità)
  - [Sidebar](#sidebar)
  - [TopBar](#topbar)
  - [Main Content e Song Card](#main-content-e-song-card)
  - [Player](#player)
- [Responsive / Mobile](#responsive--mobile)
- [Come avviare il progetto](#come-avviare-il-progetto)
- [Limiti noti e possibili estensioni](#limiti-noti-e-possibili-estensioni)

## Panoramica

L'app è divisa in tre macro-aree, come nel layout di Spotify:

- **Sidebar** (sinistra, nera): logo, navigazione, ricerca, autenticazione.
- **Main Content** (centro/destra, gradiente blu scuro): barra di navigazione orizzontale e griglia di risultati.
- **Player** (fisso in basso, grigio scuro): traccia corrente e controlli di riproduzione (solo estetici, nessun audio reale).

## Stack tecnologico

| Libreria | Uso |
|---|---|
| [React](https://react.dev/) (19, functional components + hooks) | UI |
| [Redux Toolkit](https://redux-toolkit.js.org/) | Stato globale (`configureStore`, `createSlice`, `createAsyncThunk`) |
| [React Redux](https://react-redux.js.org/) | Binding React ↔ Redux (`useSelector`, `useDispatch`) |
| [React-Bootstrap](https://react-bootstrap.netlify.app/) + [Bootstrap 5](https://getbootstrap.com/) | Grid system, componenti (`Container`, `Row`, `Col`, `Card`, `Offcanvas`, `Form`, `Button`...) |
| [React Icons](https://react-icons.github.io/react-icons/) | Icone (cuore, home, libreria, burger, controlli player) |
| [Vite](https://vite.dev/) | Build tool e dev server |
| API [Deezer](https://developers.deezer.com/) (via proxy [striveschool-api](https://striveschool-api.herokuapp.com/)) | Ricerca brani |

## Struttura del progetto (scaffolding)

```
src/
├── api/
│   └── deezer.js              # Funzione condivisa searchTracks(query) verso l'API Deezer
├── assets/
│   └── spotify-logo.svg       # Logo usato nella Sidebar (desktop + mobile)
├── redux/
│   ├── store.js               # configureStore
│   └── musicSlice.js          # Slice unico: state, reducers, thunk di ricerca
├── components/
│   ├── Sidebar/
│   │   ├── Sidebar.jsx        # Logo, nav, ricerca, auth, Offcanvas responsive
│   │   └── Sidebar.css
│   ├── TopBar/
│   │   ├── TopBar.jsx         # Link di navigazione orizzontali (dead link)
│   │   └── TopBar.css
│   ├── MainContent/
│   │   ├── MainContent.jsx    # Sezioni di default + risultati di ricerca
│   │   └── MainContent.css
│   ├── SongCard/
│   │   ├── SongCard.jsx       # Copertina, titolo, artista, cuore preferiti
│   │   └── SongCard.css
│   └── Player/
│       ├── Player.jsx         # Traccia corrente + controlli estetici
│       └── Player.css
├── App.jsx                    # Layout a 3 aree (Bootstrap grid)
├── App.css                    # Variabili CSS del tema (colori, gradiente, altezza player)
├── main.jsx                   # Entry point, <Provider store={store}>
└── index.css
```

Ogni componente vive nella propria cartella con il proprio foglio di stile dedicato: le variabili di tema condivise (colori, gradiente di sfondo, altezza del player) sono centralizzate come custom property CSS in `App.css` (`:root`), così i singoli componenti le richiamano con `var(--nome)` invece di ripetere valori fissi.

## Stato Redux

Un unico slice (`music`) gestisce tutto lo stato applicativo:

```js
{
  searchQuery: "",       // stringa corrente della barra di ricerca
  searchResults: [],     // risultati dell'ultima ricerca effettuata
  currentTrack: null,    // { id, title, artist, image } della traccia in riproduzione nel Player
  favorites: [],         // array di ID brano aggiunti ai preferiti
  isLoading: false,      // true durante la fetch di ricerca
  isError: false,        // true se la fetch fallisce
}
```

Azioni disponibili: `setSearchQuery`, `resetSearch`, `setCurrentTrack`, `toggleFavorite` (reducer sincroni) e il thunk asincrono `fetchSearchResults`, che effettua la chiamata a Deezer tramite `api/deezer.js` e popola `searchResults` (gestendo `pending` / `fulfilled` / `rejected`).

## Funzionalità

### Sidebar

- **Logo "Spotify"** cliccabile: dispaccia `resetSearch()`, riportando l'app allo stato iniziale (svuota ricerca e risultati).
- **Home** / **Your Library**: link morti (`preventDefault`).
- **Barra di ricerca**: input controllato direttamente da `searchQuery` (Redux); submit (Invio o click su **GO**) dispaccia `fetchSearchResults`.
- **Sign Up** / **Login**: bottoni non funzionali, solo estetici.
- **Cookie Policy** / **Privacy**: link morti.
- Su schermi **≥ 768px** la sidebar resta `sticky` in cima allo schermo durante lo scroll, con i bottoni di autenticazione ancorati in fondo.
- Su schermi **< 768px** collassa in un **Offcanvas** (menu a scomparsa) apribile tramite pulsante burger, che sostituisce la sidebar fissa (pattern responsivo nativo di React-Bootstrap tramite la prop `responsive="md"`).

### TopBar

Cinque link di navigazione in maiuscolo (`TRENDING`, `PODCAST`, `MOODS AND GENRES`, `NEW RELEASES`, `DISCOVER`), tutti dead link.

### Main Content e Song Card

- **Prima di ogni ricerca**: mostra tre sezioni di default precaricate (`Metal`, `Pop-Rock`, `#HipHop`), ciascuna con i primi 4 risultati di una query fissa.
- **Dopo una ricerca**: mostra un'unica sezione con i risultati, titolata con la query cercata.
- **Nessun risultato**: se la ricerca non produce brani, viene mostrato un messaggio dedicato con un pulsante **Riprova** (utile anche in caso di risposta lenta/instabile dell'API gratuita).
- **Errore di rete**: messaggio di errore con pulsante **Riprova**.
- Ogni **Song Card** mostra copertina (lazy-loaded), titolo (troncato con ellissi se troppo lungo), artista e un'icona a forma di cuore.
  - Click sulla card (fuori dal cuore) → aggiorna `currentTrack`, il brano appare nel Player.
  - Click sul cuore → aggiunge/rimuove l'ID brano da `favorites` (con `stopPropagation` per non attivare anche il click della card); l'icona si riempie o si svuota in base allo stato.

### Player

Fisso in basso su tutta la larghezza (`position: fixed`), sempre visibile:

- **Sinistra**: miniatura, titolo e artista del brano selezionato (vuoto se nessun brano è stato ancora scelto).
- **Centro**: controlli Shuffle / Previous / Play / Next / Repeat, centrati indipendentemente dalla larghezza dell'area sinistra (layout a griglia CSS a 3 colonne). Puramente estetici, nessuna riproduzione audio reale.

## Responsive / Mobile

Approccio mobile-first:

- La **Sidebar** collassa in Offcanvas sotto i 768px, con barra compatta (logo + burger) in sostituzione della colonna fissa.
- **TopBar**, **griglia delle card** e **Player** riducono padding, gap e dimensioni dei testi/icone sotto specifiche soglie (767.98px e 575.98px) per restare leggibili e senza overflow su schermi stretti.
- Le sezioni di default (sempre 4 tracce) usano una disposizione a griglia dedicata (2 per riga tra 576–768px) per evitare righe con un singolo elemento "orfano"; la griglia dei risultati di ricerca (numero di tracce variabile) resta invece invariata su quella fascia.

## Come avviare il progetto

```bash
npm install
npm run dev
```

Altri comandi disponibili:

```bash
npm run build      # build di produzione
npm run preview    # anteprima della build
npm run lint       # controllo ESLint
```

## Limiti noti e possibili estensioni

- Il player è **esclusivamente estetico**: nessun audio viene realmente riprodotto.
- I **preferiti** vivono solo in memoria (stato Redux): al refresh della pagina vengono persi. Una persistenza su `localStorage` è stata individuata come possibile estensione futura ma non è stata implementata.
- L'API di ricerca (`striveschool-api`, hosted su Heroku free tier) può avere un tempo di risposta più lungo al primo utilizzo dopo un periodo di inattività ("cold start"); il pulsante **Riprova** mitiga l'impatto lato utente.
