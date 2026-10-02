# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Pounce is a real-time multiplayer solitaire card game (4 players) built with React + Socket.io. The client is a "dumb" display layer — all game state and validation lives on the server. The game is deployed live at pounce.onrender.com.

## Commands

### Client (`client/`)
```bash
npm run dev      # Vite dev server on port 5173
npm run build    # Build to dist/ (served by Express in production)
npm run lint     # ESLint
npm run preview  # Preview production build
```

### Server (`server/`)
```bash
npm start        # Express + Socket.io on port 3001 (or $PORT)
```

### Environment Variables
- `PORT` — server port (default 3001)
- `CLIENT_URL` — CORS origin (default `http://localhost:5173`)
- `REACT_APP_SERVER_URL` — client socket URL (default `https://pounce.onrender.com`, hardcoded in `client/src/socket.js` and `client/src/HomePage.jsx`)

## Architecture

### Client (`client/src/`)
- **`App.jsx`** — React Router with two routes: `/` (HomePage) and `/game` (GamePage)
- **`GamePage.jsx`** — Central game UI component; owns all game state received from socket events and passes data down to components
- **`socket.js`** — Singleton Socket.io client; connects to `REACT_APP_SERVER_URL`
- **`components/`** — Presentational components: `Hand` (wraps all 4 of a player's piles), `Foundation` (12 shared center piles), `Scoreboard`, `Cards`, `Stock`, `Waste`, `Tableau`, `Pounce`

### Server (`server/src/`)
- **`index.js`** — Express + Socket.io setup; mounts routes and socket handlers
- **`sockets/roomSockets.js`** — Core game logic engine (~445 lines): handles all card movement events, validates moves, updates game state, and broadcasts changes
- **`utils/roomUtils.js`** — Room lifecycle: join/leave, player tracking, stock cycling
- **`utils/createDeck.js`** — Deck creation and shuffle; splits 52 cards into Tableau (21), Stock (22), Pounce (9)
- **`routes/roomRoutes.js`** + **`controllers/roomController.js`** — `POST /api/rooms/create` endpoint

### Game State Shape (server `rD` object)
```js
{
  hands: [/* 4 players */{ stockPile, wastePile, tableau: [6 piles], pouncePile }],
  foundation: Array(12),   // 12 shared center piles
  curPts: [0,0,0,0],       // Points this round
  totalPts: [0,0,0,0],     // Cumulative points
  playing: boolean          // False after someone pounces (blocks moves)
}
```

## Game Rules & Validation

**Card movement rules (validated server-side in `roomSockets.js`):**
- **Tableau → Tableau**: alternating red/black, descending value; only Kings to empty slots
- **→ Foundation**: same suit, ascending (A→K); only Aces to empty foundation slots
- **Pounce → Tableau**: any card to empty; otherwise must follow tableau rules
- **Stock → Waste**: single draw; stock cycles from waste when empty

**Scoring:**
- +1 pt per card placed on Foundation
- −2 pts per card remaining in Pounce pile when someone calls pounce
- First player to reach **100 total points** wins

## Socket Event Reference

| Direction | Event | Purpose |
|-----------|-------|---------|
| Client→Server | `join(roomId)` | Join a room |
| Client→Server | `startGame()` | Start/restart a round |
| Client→Server | `drawCard()` | Draw from stock to waste |
| Client→Server | `dropTableau(data)` | Move card to tableau |
| Client→Server | `dropFoundation(data)` | Move card to foundation |
| Client→Server | `pounce()` | End the round |
| Server→Client | `joinStatus(status, roomId)` | 0=ok, 1=not found, 2=full, 3=start |
| Server→Client | `finalCheck(roomId)` | 4th player joined, trigger mount |
| Server→Client | `playerNum(index)` | Tell player their index (0–3) |
| Server→Client | `dealHands(hands)` | Initial card distribution |
| Server→Client | `updateHands(hands)` | Hand state after any move |
| Server→Client | `updateFoundation(foundation)` | Foundation state after any move |
| Server→Client | `updateScores(curPts, totalPts)` | Score broadcast |

## Known Limitations / TODOs

- Server URL is hardcoded to production in `client/src/socket.js` — must change for local dev
- No room cleanup on player disconnect (rooms persist in memory)
- No custom usernames — players are identified by index (0–3)
- No test suite — `npm test` is a placeholder
