import { countries }   from './countries';      // from the previous step-by-step
import { categoryDefs} from './categories';

export const CAT_KEYS = Object.keys(categoryDefs);

// for speed we store an *array* of matching country names per category
export const catToCountries = Object.fromEntries(
  CAT_KEYS.map(k => [k, countries
                        .filter(categoryDefs[k].test)
                        .map(c => c.name)])
);
