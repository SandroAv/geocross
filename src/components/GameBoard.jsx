import React, { useState, useMemo, useEffect, Fragment } from 'react';
import { countries }      from '../data/countries';
import { categoryDefs }   from '../data/categories';
import { getBoard }       from '../data/boardGenerator';
import isoCountries       from 'i18n-iso-countries';
import enLocale           from 'i18n-iso-countries/langs/en.json';
import './board.css';

/* ---------- helpers -------------------------------------------------- */
isoCountries.registerLocale(enLocale);
const iso = name =>
  isoCountries.getAlpha2Code(name, 'en')?.toLowerCase() ?? null;
const allNames = countries.map(c => c.name).sort();
const initGrid = (r, c) => Array(r).fill(null).map(() => Array(c).fill(null));

/* ---------- component ------------------------------------------------ */
export default function GameBoard() {
  const [seed, setSeed] = useState(() => Date.now().toString());

  /* fresh board whenever seed changes */
  const { rows, cols } = useMemo(() => getBoard(seed, 3), [seed]);

  /* state per board */
  const [guesses, setGuesses] = useState(() => initGrid(rows.length, cols.length));
  const [used, setUsed]       = useState(() => new Set());
  const [editing, setEditing] = useState(null);
  const [won, setWon]         = useState(false);

  /* reset guesses when board changes */
  useEffect(() => {
    setGuesses(initGrid(rows.length, cols.length));
    setUsed(new Set());
    setWon(false);
  }, [rows, cols]);

  /* validation & commit ---------------------------------------------- */
  const validate = (r, c, raw) => {
    const nm = raw.trim();
    const ct = countries.find(x => x.name.toLowerCase() === nm.toLowerCase());
    if (!ct) return 'Not in data set';
    if (used.has(ct.name)) return 'Already used';
    if (
      !categoryDefs[rows[r]].test(ct) ||
      !categoryDefs[cols[c]].test(ct)
    )
      return 'Doesn’t fit both';
    return null;
  };

  const commit = (r, c, name) => {
    const err = validate(r, c, name);
    if (err) return alert(err);

    setGuesses(g => {
      const copy = g.map(row => [...row]);
      copy[r][c] = name;
      return copy;
    });
    setUsed(u => new Set(u).add(name));

    if ([...used].length === rows.length * cols.length - 1) setWon(true);
  };

  /* ---------- render ------------------------------------------------- */
  return (
    <>
      {/* NEW-GAME BUTTON */}
      <button
        className="new-game-btn"
        onClick={() => setSeed(crypto.randomUUID())}
      >
        🔄 New Game
      </button>

      {/* GRID */}
      <div className="board">
        <div className="blank" />
        {cols.map(k => (
          <Header key={k} label={categoryDefs[k].label} />
        ))}

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

      {/* INPUT MODAL */}
      {editing && (
        <Modal onClose={() => setEditing(null)}>
          <CountryInput
            onCancel={() => setEditing(null)}
            onSubmit={name => {
              commit(editing.r, editing.c, name);
              setEditing(null);
            }}
          />
        </Modal>
      )}

      {/* WIN MODAL */}
      {won && (
        <Modal onClose={() => setWon(false)}>
          <h2 style={{ marginTop: 0 }}>🎉 Congratulations!</h2>
          <p>You completed the grid!</p>
          <button onClick={() => setWon(false)}>Close</button>
        </Modal>
      )}
    </>
  );
}

/* ---------- tiny subs ----------------------------------------------- */
const Header = ({ label }) => <div className="header">{label}</div>;

const Cell = ({ value, onClick }) =>
  !value ? (
    <div className="cell" onClick={onClick}>
      ?
    </div>
  ) : (
    <div className="cell done" onClick={onClick}>
      {iso(value) ? (
        <span className={`fi fi-${iso(value)} flag`} />
      ) : (
        <div className="flag" />
      )}
      <div className="namebar">{value}</div>
    </div>
  );

const Modal = ({ children, onClose }) => (
  <div
    style={{
      position: 'fixed',
      inset: 0,
      zIndex: 999,
      background: 'rgba(0,0,0,.15)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}
    onClick={onClose}
  >
    <div
      style={{
        background: '#22253d',
        borderRadius: 12,
        padding: 24,
        minWidth: 280,
      }}
      onClick={e => e.stopPropagation()}
    >
      {children}
    </div>
  </div>
);

function CountryInput({ onCancel, onSubmit }) {
  const [txt, setTxt] = useState('');       /* ← stray C removed */

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        onSubmit(txt);
      }}
    >
      <label style={{ display: 'block', marginBottom: 8 }}>
        Enter country:
      </label>
      <input
        list="countries"
        value={txt}
        onChange={e => setTxt(e.target.value)}
        style={{
          width: '100%',
          padding: '8px 10px',               /* 10px, not 1C0px */
          borderRadius: 6,
          border: '1px solid #555',
          background: '#2d304b',
          color: '#fff',
        }}
        autoFocus
      />
      <datalist id="countries">
        {allNames.map(name => (
          <option value={name} key={name} />
        ))}
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
