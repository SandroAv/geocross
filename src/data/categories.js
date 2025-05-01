// src/data/categories.js
export const categoryDefs = {
    /* ─── CONTINENTS (6) ─── */
    EUROPE        : { label: 'Europe',         group: 'continent',
                      test: c => c.continent === 'Europe' },
    ASIA          : { label: 'Asia',           group: 'continent',
                      test: c => c.continent === 'Asia' },
    AFRICA        : { label: 'Africa',         group: 'continent',
                      test: c => c.continent === 'Africa' },
    NORTH_AMERICA : { label: 'North America',  group: 'continent',
                      test: c => c.continent === 'North America' },
    SOUTH_AMERICA : { label: 'South America',  group: 'continent',
                      test: c => c.continent === 'South America' },
    OCEANIA       : { label: 'Oceania',        group: 'continent',
                      test: c => c.continent === 'Oceania' },
  
    /* ─── POPULATION (4) ─── */
    POP_GT_200M   : { label: '> 200 M people', group: 'population',
                      test: c => c.population > 200_000_000 },
    POP_50_200M   : { label: '50 – 200 M',     group: 'population',
                      test: c => c.population > 50_000_000 && c.population <= 200_000_000 },
    POP_10_50M    : { label: '10 – 50 M',      group: 'population',
                      test: c => c.population > 10_000_000 && c.population <= 50_000_000 },
    POP_LT_10M    : { label: '< 10 M',         group: 'population',
                      test: c => c.population && c.population <= 10_000_000 },
  
    /* ─── AREA (5) ─── */
    AREA_GT_2M    : { label: '> 2 M km²',      group: 'area',
                      test: c => c.area > 2_000_000 },
    AREA_1_2M     : { label: '1 – 2 M km²',    group: 'area',
                      test: c => c.area > 1_000_000 && c.area <= 2_000_000 },
    AREA_0_5_1M   : { label: '0.5 – 1 M km²',  group: 'area',
                      test: c => c.area >   500_000 && c.area <= 1_000_000 },
    AREA_0_1_0_5M : { label: '0.1 – 0.5 M km²',group: 'area',
                      test: c => c.area >   100_000 && c.area <=   500_000 },
    AREA_LT_0_1M  : { label: '< 100 k km²',    group: 'area',
                      test: c => c.area && c.area <= 100_000 },
  
    /* ─── COASTLINE (3) ─── */
    COAST_GT_5000 : { label: '> 5 000 km coastline', group: 'coastline',
                      test: c => c.coastlineKm > 5_000 },
    COAST_500_5000: { label: '500 – 5 000 km coastline', group: 'coastline',
                      test: c => c.coastlineKm > 500 && c.coastlineKm <= 5_000 },
    COAST_LT_500  : { label: '< 500 km coastline', group: 'coastline',
                      test: c => c.coastlineKm && c.coastlineKm <= 500 },
  
    /* ─── HEMISPHERE (3) ─── */
    NORTHERN_HEMI : { label: 'Northern hemisphere', group: 'hemisphere',
                      test: c => c.latitude !== null && c.latitude > 20 },
    EQUATORIAL    : { label: 'Equatorial (±20°)',   group: 'hemisphere',
                      test: c => c.latitude !== null && Math.abs(c.latitude) <= 20 },
    SOUTHERN_HEMI : { label: 'Southern hemisphere', group: 'hemisphere',
                      test: c => c.latitude !== null && c.latitude < -20 },
  
    /* ─── GEOGRAPHY (3) ─── */
    LANDLOCKED    : { label: 'Landlocked',      group: 'geography',
                      test: c => c.isLandlocked },
    COASTAL       : { label: 'Has a coast',     group: 'geography',
                      test: c => !c.isLandlocked && c.coastlineKm > 0 },
    HUGE_COAST    : { label: 'Huge coast (>5 000 km)', group: 'geography',
                      test: c => !c.isLandlocked && c.coastlineKm > 5_000 },
  };
  