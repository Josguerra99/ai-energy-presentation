/**
 * Electricidad anual de centros de datos en EE. UU. (TWh).
 * Lawrence Berkeley National Laboratory, 2024 United States Data Center Energy Usage Report (Figure ES-1).
 * Incluye servidores, almacenamiento, red e infraestructura del sitio.
 */
export type DcEnergyPoint = {
  year: number;
  twh: number;
  label?: boolean;
};

export const dcEnergyTrend: DcEnergyPoint[] = [
  {year: 2014, twh: 58, label: true},
  {year: 2016, twh: 60},
  {year: 2018, twh: 76, label: true},
  {year: 2023, twh: 176, label: true},
];

export const DC_ENERGY_YEAR_MIN = 2014;
export const DC_ENERGY_YEAR_MAX = 2023;
export const DC_ENERGY_TWH_MAX = 200;
