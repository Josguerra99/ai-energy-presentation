# Fuentes — Paso 0 (IA + servidores)

Referencias del proyecto. Los IDs coinciden con `src/sources.ts` (pie de diapositiva).

## Qué pasa detrás de la IA / entrenamiento

| ID | Uso en la charla | Enlace |
|----|------------------|--------|
| `llama31Card` | Llama 3.1: GPU-hours H100 (8B/70B/405B), TDP 700 W, tCO₂e | https://huggingface.co/meta-llama/Llama-3.1-405B |
| `metaLlamaBlog` | Anuncio Llama 3.1: escala, >15T tokens, cluster H100 | https://ai.meta.com/blog/meta-llama-3-1/ |
| `stanfordAiIndex2025` | Estimaciones de costo de entrenamiento (GPT-3, GPT-4, Gemini Ultra, etc.) | https://hai.stanford.edu/ai-index/2025-ai-index-report |
| `epochAi` | Metodología de costos amortizados vs alquiler cloud; hardware reutilizable | https://epoch.ai/ |

### Cifras clave (entrenamiento)

- **Llama 3.1 405B:** 30.84 M GPU-hours H100; familia completa 39.3 M; location-based ~8,930 tCO₂e (405B) / 11,390 tCO₂e (familia). Fuente: model card Meta.
- **Orden de magnitud energía GPU:** 30.84e6 h × 700 W ≈ **21.6 GWh** (capacidad TDP, no medición de consumo real del sitio).
- **Costos $:** estimaciones tipo cloud/Index — no facturas internas de OpenAI/Google.

## Servidores / PUE / TCO

| ID | Uso en la charla | Enlace |
|----|------------------|--------|
| `berkeley2024` | Consumo de DC en EE. UU. (~176 TWh 2023) | https://eta.lbl.gov/publications/united-states-data-center-energy-usage-report |
| `berkeley2026` | Proyecciones 2030 (escenarios, incertidumbre IA) | https://eta.lbl.gov/ |
| `doe` | PUE: **1.6** estándar, **1.4** bueno, **1.1** mejor; consolidar workloads en menos servidores | https://www.energy.gov/sites/default/files/2024-07/best-practice-guide-data-center-design.pdf |
| `uptime2018` | Serie temprana PUE (2.5 → 1.98 → 1.65 → 1.58) | https://intelligence.uptimeinstitute.com/sites/default/files/mammoth/2023/09/12/Keynote%20report%2013_UI%20Global%20Data%20Center%20Survey%202018.pdf |
| `uptime2024` | Encuesta global 2024: PUE medio **1.56** | https://datacenter.uptimeinstitute.com/rs/711-RIA-145/images/2024.GlobalDataCenterSurvey.Report.pdf |
| `uptime2025` | Encuesta global 2025: PUE medio **1.54** | https://datacenter.uptimeinstitute.com/rs/711-RIA-145/images/2025.Annual.Survey.Report.pdf |
| `uptime2026` | Encuesta global 2026: PUE medio **1.52** (Figure 2, serie completa) | https://datacenter.uptimeinstitute.com/rs/711-RIA-145/images/UptimeInstitute.GlobalDataCenterSurvey.2026.pdf |
| `uptimePueBlog` | Contexto de la meseta post-2014 | https://journal.uptimeinstitute.com/global-pues-are-they-going-anywhere/ |
| `ieeeTco` | Modelo formal TCO (5 componentes) | https://ieeexplore.ieee.org/ |
| `microsoftTco` | Ejemplo histórico CAPEX/OPEX (no mercado actual) | https://www.microsoft.com/en-us/download/details.aspx |

## PUE promedio por año (Uptime Institute)

Serie oficial de *average annual PUE* (por instalación, no ponderada por capacidad). Extraída de Figure 2 de las encuestas globales y cotejada con Statista / Survey 2018.

| Año | PUE medio | Fuente primaria |
|-----|-----------|-----------------|
| 2007 | **2.50** | [Survey 2024](https://datacenter.uptimeinstitute.com/rs/711-RIA-145/images/2024.GlobalDataCenterSurvey.Report.pdf) / [2026](https://datacenter.uptimeinstitute.com/rs/711-RIA-145/images/UptimeInstitute.GlobalDataCenterSurvey.2026.pdf) Figure 2 |
| 2011 | **1.98** | idem; también [Survey 2018](https://intelligence.uptimeinstitute.com/sites/default/files/mammoth/2023/09/12/Keynote%20report%2013_UI%20Global%20Data%20Center%20Survey%202018.pdf) |
| 2014 | **1.65** | Figure 2 (2024/2025/2026); [blog Uptime](https://journal.uptimeinstitute.com/global-pues-are-they-going-anywhere/) |
| 2018 | **1.58** | [Survey 2018](https://intelligence.uptimeinstitute.com/sites/default/files/mammoth/2023/09/12/Keynote%20report%2013_UI%20Global%20Data%20Center%20Survey%202018.pdf) + Figure 2 |
| 2019 | **1.67** | Figure 2 (2025/2026) |
| 2020 | **1.59** | Figure 2 (2025/2026) |
| 2021 | **1.57** | Figure 2 (2025/2026) |
| 2022 | **1.55** | Figure 2 (2025/2026) |
| 2023 | **1.58** | Figure 2 (2025/2026) |
| 2024 | **1.56** | [Survey 2024](https://datacenter.uptimeinstitute.com/rs/711-RIA-145/images/2024.GlobalDataCenterSurvey.Report.pdf) (n=526) |
| 2025 | **1.54** | [Survey 2025](https://datacenter.uptimeinstitute.com/rs/711-RIA-145/images/2025.Annual.Survey.Report.pdf) |
| 2026 | **1.52** | [Survey 2026](https://datacenter.uptimeinstitute.com/rs/711-RIA-145/images/UptimeInstitute.GlobalDataCenterSurvey.2026.pdf) (n=644) |

### Lectura rápida

- **2007–2014:** caída fuerte (2.50 → 1.65) por medidas “fáciles” (contención, VFD, setpoints).
- **2018–2026:** meseta ~1.5–1.6; mejoras lentas. El promedio por sitio diluye instalaciones nuevas/grandes más eficientes.
- **Mínimo teórico:** PUE = **1.0** (toda la energía del sitio va al IT). Nunca se alcanza en la práctica.
- Uptime **no** publica un punto para cada año intermedio (2008–2010, 2012–2013, 2015–2017); esos huecos son reales en la serie.

### Cruce secundario

- Statista (tabla basada en Uptime, 2007–2025): https://www.statista.com/statistics/1229367/data-center-average-annual-pue-worldwide/

## Notas para el pie de diapositiva

- En proyector, el pie usa gris `#5A5A5A` sobre amarillo.
- Cada `beginSlide` en `paso0-servidores.tsx` elige qué IDs mostrar.
