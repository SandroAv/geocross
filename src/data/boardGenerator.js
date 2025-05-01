import seedrandom from 'seedrandom';
import { categoryDefs } from './categories';
import { countries }    from './countries';

/* ------------------------------------------------ pre-compute buckets */
const CAT_KEYS = Object.keys(categoryDefs);
const catToCountries = Object.fromEntries(
  CAT_KEYS.map(k => [
    k,
    countries.filter(categoryDefs[k].test).map(c => c.name)
  ])
);

const overlapCnt = (a, b) => {
  const setB = new Set(catToCountries[b]);
  return catToCountries[a].reduce((n, c) => n + setB.has(c), 0);
};

/* ------------------------------------------------ helper: random pick */
function pickDistinct(arr, n, rng) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, n);
}

/* ------------------------------------------------ main export */
export function getBoard(seed, min = 10) {
  const rng = seedrandom(seed);
  const depths = [min, 7, 5];
  const MAX_TRIES = 2000;

  for (const depth of depths) {
    for (let t = 0; t < MAX_TRIES; t++) {
      const rows = pickDistinct(CAT_KEYS, 3, rng);
      const cols = pickDistinct(
        CAT_KEYS.filter(k => !rows.includes(k)), 3, rng
      );

      const ok = rows.every(r =>
        cols.every(c => overlapCnt(r, c) >= depth)
      );
      if (ok) return { rows, cols };
    }
  }
  throw new Error('Could not find a solvable board at any depth');
}
