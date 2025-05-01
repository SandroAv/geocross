/*  Build one rich record per country
 *  Fields we need for predicates:
 *    • continent     • population     • area
 *    • isLandlocked  • coastlineKm    • latitude
 */
import continents  from 'country-json/src/country-by-continent.json';
import populations from 'country-json/src/country-by-population.json';
import areas       from 'country-json/src/country-by-surface-area.json';
import landlocked  from 'country-json/src/country-by-landlocked.json';
import coastline   from 'country-json/src/country-by-costline.json';       // yes, “costline”
import coords      from 'country-json/src/country-by-geo-coordinates.json';

export const countries = continents.map(({ country, continent }) => {
  const pop   = +populations.find(p => p.country === country)?.population   || null;
  const area  = +areas      .find(a => a.country === country)?.surface_area || null;
  const coast = +coastline  .find(c => c.country === country)?.costline     || 0;
  const lock  =  landlocked .find(l => l.country === country)?.landlocked   === 'true';
  const lat   = +coords     .find(g => g.country === country)?.latitude     || null;

  return {
    name: country,
    continent,
    population: pop,
    area,
    coastlineKm: coast,
    isLandlocked: lock,
    latitude: lat,
  };
});
