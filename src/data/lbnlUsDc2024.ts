/**
 * Lawrence Berkeley National Laboratory, 2024 United States Data Center Energy Usage Report.
 * LBNL-2001637 · DOI 10.71468/P1WC7Q · published Dec 2024.
 *
 * Bottom-up model estimates (not facility meter readings). See report §2, §5, limitations §7.
 */

export const LBNL_US_DC_REPORT = {
  reportNumber: 'LBNL-2001637',
  doi: '10.71468/P1WC7Q',
  publishedYear: 2024,
} as const;

/** Direct consumptive water at the data center site (Figure 5.9), billion liters/year. */
export const LBNL_US_DC_DIRECT_WATER_BIL_L: Record<number, number> = {
  2014: 21.2,
  2023: 66,
};

/**
 * Indirect water via electricity generation (Figure 5.10), billion liters/year.
 * Report text: "nearly 800 billion liters" for 2023, using regional grid mix by balancing authority;
 * excludes facility PPAs and behind-the-meter generation.
 */
export const LBNL_US_DC_INDIRECT_WATER_BIL_L_2023 = 800;

/** National average indirect water intensity for data center electricity (2023), L/kWh. */
export const LBNL_US_DC_INDIRECT_WATER_L_PER_KWH_2023 = 4.52;

/** U.S. average grid water intensity (comparison in report), L/kWh. */
export const LBNL_US_GRID_WATER_L_PER_KWH_2023 = 4.35;

/** Total U.S. data center electricity (Figure ES-1 / 5.5), TWh/year. */
export const LBNL_US_DC_ENERGY_TWH: Record<number, number> = {
  2014: 60,
  2016: 60,
  2018: 76,
  2023: 176,
};

/** Share of total U.S. electricity (2023). */
export const LBNL_US_DC_ENERGY_SHARE_PCT_2023 = 4.4;

/** Year GPU-accelerated AI servers became a significant share of server stock (report narrative). */
export const LBNL_US_DC_GPU_AI_INFLECTION_YEAR = 2017;
