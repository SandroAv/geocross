//  src/App.jsx
import React from 'react';                 //  👈  add this line
import 'flag-icons/css/flag-icons.min.css';
import './components/board.css';
import GameBoard from './components/GameBoard.jsx';
import './index.css';

export default function App() {
  return (
    <main className="app">
      <h1 className="title">🌎 GeoCross</h1>
      <GameBoard />
    </main>
  );
}
