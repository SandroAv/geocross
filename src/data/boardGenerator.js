// src/data/boardGenerator.js
import seedrandom from 'seedrandom';
import { categoryDefs } from './categories';
import { catToCountries } from './catMaps';          // created earlier

/* helpers ---------------------------------------------------- */
const CAT_KEYS = Object.keys(categoryDefs);
const byGroup   = group => CAT_KEYS.filter(k => categoryDefs[k].group === group);
const sizeOf    = k     => catToCountries[k].length;

function combos(arr, k) {
  if (k === 0) return [[]];
  if (arr.length < k) return [];
  const [head, ...tail] = arr;
  return [
    ...combos(tail, k - 1).map(c => [head, ...c]),
    ...combos(tail, k),
  ];
}

function allBoards(groupRows, groupCols, min) {
  const rowsPool = byGroup(groupRows).filter(k => sizeOf(k) >= min);
  const colsPool = byGroup(groupCols).filter(k => sizeOf(k) >= min);
  if (rowsPool.length < 3 || colsPool.length < 3) return [];

  const valid = [];
  for (const rows of combos(rowsPool, 3))
    for (const cols of combos(colsPool, 3))
      if (rows.every(r =>
            cols.every(c =>
              rows.includes(c) ? false  /* same key on both axes – skip */
              : catToCountries[r].filter(name =>
                  catToCountries[c].includes(name)
                ).length >= min)))
        valid.push({ rows, cols });
  return valid;
}

/* main export ------------------------------------------------ */
export function getDailyBoard(dateStr, minPerCell = 10) {
  const rng   = seedrandom(dateStr);
  // only groups that have ≥ 3 categories each of which has ≥ min answers
  const groups = [...new Set(Object.values(categoryDefs).map(c => c.group))]
                   .filter(g =>
                     byGroup(g).filter(k => sizeOf(k) >= minPerCell).length >= 3);

  // pick two distinct groups deterministically
  const g1 = groups[Math.floor(rng() * groups.length)];
  let g2;
  do { g2 = groups[Math.floor(rng() * groups.length)]; } while (g2 === g1);

  const choices = allBoards(g1, g2, minPerCell);
  if (!choices.length)
    throw new Error(`No ${minPerCell}-deep board using groups ${g1}/${g2}`);

  // deterministic pick among the valid boards
  const idx = Math.floor(rng() * choices.length);
  return choices[idx];
}
