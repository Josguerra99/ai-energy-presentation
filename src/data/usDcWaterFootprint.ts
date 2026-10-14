/**
 * Re-export LBNL 2024 water footprint anchors for slides (EE. UU., 2023).
 * Units: billion liters (= mil millones de litros en la charla).
 */
import {
  LBNL_US_DC_DIRECT_WATER_BIL_L,
  LBNL_US_DC_INDIRECT_WATER_BIL_L_2023,
} from './lbnlUsDc2024';

export {
  LBNL_US_DC_DIRECT_WATER_BIL_L,
  LBNL_US_DC_INDIRECT_WATER_BIL_L_2023,
} from './lbnlUsDc2024';

export const US_DC_WATER_FOOTPRINT_YEAR = 2023;

export const US_DC_WATER_DIRECT_BIL_L_2023 =
  LBNL_US_DC_DIRECT_WATER_BIL_L[2023];
export const US_DC_WATER_INDIRECT_BIL_L_2023 =
  LBNL_US_DC_INDIRECT_WATER_BIL_L_2023;
