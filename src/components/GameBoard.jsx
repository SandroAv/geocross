// src/components/GameBoard.jsx
import React, { useState, useMemo, Fragment } from 'react';   // ← React added
import { countries }     from '../data/countries';
import { categoryDefs }  from '../data/categories';
import { getDailyBoard } from '../data/boardGenerator';
import isoCountries      from 'i18n-iso-countries';
import enLocale          from 'i18n-iso-countries/langs/en.json';
import './board.css';

/* ---------- ISO helper ------------------------------------------------ */
isoCountries.registerLocale(enLocale);   // ← sync, no await

function isoLower(name) {
  return isoCountries.getAlpha2Code(name, 'en')?.toLowerCase() ?? null;
}

/* ---------- misc constants ------------------------------------------- */
const allCountryNames = countries.map(c => c.name).sort();

/* ---------- main component ------------------------------------------- */
export default function GameBoard() {
  /* deterministic rows / cols for today */
  const today = new Date().toISOString().slice(0, 10);
  const { rows, cols } = useMemo(() => {
    try   { return getDailyBoard(today, 10); }
    catch { return getDailyBoard(today, 5); }
  }, [today]);

  /* state */
  const [guesses, setGuesses] = useState(
    Array(rows.length).fill(null).map(() => Array(cols.length).fill(null))
  );
  const [used, setUsed]       = useState(() => new Set());
  const [editing, setEditing] = useState(null);    // {r,c} | null
  const [won, setWon]         = useState(false);

  /* validate & commit -------------------------------------------------- */
  const validate = (r, c, raw) => {
    const name = raw.trim();
    const country = countries.find(
      x => x.name.toLowerCase() === name.toLowerCase()
    );
    if (!country)                       return 'Not in data set';
    if (used.has(country.name))         return 'Already used';
    if (!categoryDefs[rows[r]].test(country) ||
        !categoryDefs[cols[c]].test(country)) return 'Doesn’t match row & column';
    return null;
  };

  const commitGuess = (r, c, name) => {
    const err = validate(r, c, name);
    if (err) return alert(err);

    setGuesses(g => {
      const copy = g.map(row => [...row]);
      copy[r][c] = name;
      return copy;
    });
    setUsed(u => new Set(u).add(name));

    /* win check */
    if (guesses.flat().filter(Boolean).length === rows.length * cols.length - 1)
      setWon(true);
  };

  /* render ------------------------------------------------------------- */
  return (
    <>
      <div className="board">
        <div className="blank" />
        {cols.map(k => <Header key={k} label={categoryDefs[k].label} />)}

        {rows.map((rk, r) => (
          <Fragment key={rk}>
            <Header label={categoryDefs[rk].label} />
            {cols.map((ck, c) => (
              <Cell
                key={`${rk}-${ck}`}
                value={guesses[r][c]}
                onClick={() => !guesses[r][c] && setEditing({ r, c })}
              />
            ))}
          </Fragment>
        ))}
      </div>

      {editing && (
        <Modal onClose={() => setEditing(null)}>
          <CountryInput
            onCancel={() => setEditing(null)}
            onSubmit={name => {
              commitGuess(editing.r, editing.c, name);
              setEditing(null);
            }}
          />
        </Modal>
      )}

      {won && (
        <Modal onClose={() => setWon(false)}>
          <h2 style={{ marginTop: 0 }}>🎉 Congratulations!</h2>
          <p>You completed today’s grid.</p>
          <button onClick={() => setWon(false)}>Close</button>
        </Modal>
      )}
    </>
  );
}

/* ---------- tiny sub-components ------------------------------------- */
function Header({ label }) {
  return <div className="header">{label}</div>;
}

function Cell({ value, onClick }) {
  if (!value) return <div className="cell" onClick={onClick}>?</div>;

  const iso = isoLower(value);
  return (
    <div className="cell done" onClick={onClick}>
      {iso
        ? <span className={`fi fi-${iso} flag`} />
        : <div className="flag" />}    {/* fallback square if ISO lookup fails */}
      <div className="namebar">{value}</div>
    </div>
  );
}

function Modal({ children, onClose }) {
  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 999,
        background: 'rgba(0,0,0,0.45)',
        display: 'flex', justifyContent: 'center', alignItems: 'center',
      }}
      onClick={onClose}
    >
      <div
        style={{ background: '#22253d', borderRadius: 12, padding: 24, minWidth: 280 }}
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

function CountryInput({ onCancel, onSubmit }) {
  const [text, setText] = useState('');

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        onSubmit(text);
      }}
    >
      <label style={{ display: 'block', marginBottom: 8 }}>Enter country:</label>
      <input
        list="countries"
        value={text}
        onChange={e => setText(e.target.value)}
        style={{
          width: '100%', padding: '8px 10px',
          borderRadius: 6, border: '1px solid #555',
          background: '#2d304b', color: '#fff', fontSize: 16,
        }}
        autoFocus
      />
      <datalist id="countries">
        {allCountryNames.map(n => <option value={n} key={n} />)}
      </datalist>

      <div style={{ marginTop: 16, textAlign: 'right' }}>
        <button type="button" onClick={onCancel} style={{ marginRight: 8 }}>
          Cancel
        </button>
        <button type="submit">OK</button>
      </div>
    </form>
  );
}
