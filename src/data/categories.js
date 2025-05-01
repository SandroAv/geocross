// 20 buckets  ▸  6 distinct “groups”  ──────────────────────────────
export const categoryDefs = {
    // ── CONTINENT ───────────────────────────────────────────────
    EUROPE:{label:'Europe',group:'continent',test:c=>c.continent==='Europe'},
    ASIA  :{label:'Asia',  group:'continent',test:c=>c.continent==='Asia'},
    AFRICA:{label:'Africa',group:'continent',test:c=>c.continent==='Africa'},
    N_AMERICA:{label:'North America',group:'continent',
               test:c=>c.continent==='North America'},
    S_AMERICA:{label:'South America',group:'continent',
               test:c=>c.continent==='South America'},
    OCEANIA:{label:'Oceania',group:'continent',test:c=>c.continent==='Oceania'},
  
    // ── POPULATION (millions) ──────────────────────────────────
    POP_GT_50 :{label:'> 50 M',group:'population',
                test:c=>c.population>50_000_000},
    POP_10_50 :{label:'10 – 50 M',group:'population',
                test:c=>c.population>10_000_000&&c.population<=50_000_000},
    POP_LT_10 :{label:'< 10 M',group:'population',
                test:c=>c.population&&c.population<=10_000_000},
  
    // ── GEOGRAPHY ──────────────────────────────────────────────
    LANDLOCKED:{label:'Land-locked',group:'geo',test:c=>c.isLandlocked},
    ISLAND    :{label:'Island state',group:'geo',
                test:c=>!c.isLandlocked&&c.coastlineKm>0&&c.neighbours===0},
    COASTAL   :{label:'Has a coast',group:'geo',
                test:c=>!c.isLandlocked},
  
    // ── HEMISPHERE (approx) ────────────────────────────────────
    NORTHERN  :{label:'Northern hemisphere',group:'hemisphere',
                /* ≥ 0 ° lat → north  (capital-based) */
                test:c=>c.latitude>=0},
    SOUTHERN  :{label:'Southern hemisphere',group:'hemisphere',
                /*  < 0 ° lat → south */
                test:c=>c.latitude<0},
    // ── DRIVING SIDE ───────────────────────────────────────────
    DRIVES_LEFT :{label:'Drives on left',group:'drive',
                  test:c=>c.driveSide==='left'},
    DRIVES_RIGHT:{label:'Drives on right',group:'drive',
                  test:c=>c.driveSide==='right'},
  
    // ── GDP (2018 bn USD) ─────────────────────────────────────
    GDP_GT_500:{label:'GDP > $500 bn',group:'gdp',test:c=>c.gdp>500},
    GDP_100_500:{label:'GDP 100-500',group:'gdp',
                 test:c=>c.gdp>100&&c.gdp<=500},
    GDP_LT_100:{label:'GDP < $100 bn',group:'gdp',test:c=>c.gdp&&c.gdp<=100},
  };
  