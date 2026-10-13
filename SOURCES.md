# Fuentes — Paso 0 (IA + servidores)

Referencias del proyecto. Los IDs coinciden con `src/sources.ts` (pie de diapositiva).

## Qué pasa detrás de la IA / entrenamiento

| ID | Uso en la charla | Enlace |
|----|------------------|--------|
| `llama31Card` | Llama 3.1: GPU-hours H100 (8B/70B/405B), TDP 700 W, tCO₂e | https://huggingface.co/meta-llama/Llama-3.1-405B |
| `metaLlamaBlog` | Anuncio Llama 3.1: escala, >15T tokens, cluster H100 | https://ai.meta.com/blog/meta-llama-3-1/ |
| `stanfordAiIndex2025` | Estimaciones de costo de entrenamiento (GPT-3, GPT-4, Gemini Ultra, etc.) | https://hai.stanford.edu/ai-index/2025-ai-index-report |
| `epochAi` | Metodología de costos amortizados vs alquiler cloud; hardware reutilizable | https://epoch.ai/ |

### Slides de entrenamiento (un modelo por diapositiva)

Marcadores: `ia-train-deepseek-v3`, `ia-train-llama31-405b`. Perfiles en `TRAINING_MODEL_PROFILES` (`LlmIndustrialCostSlides.tsx`).

| Modelo | Entrenamiento (USD) | CapEx cluster (~est.) | Fuentes pie |
|--------|-----------|------------------------|-------------|
| DeepSeek-V3 | **5,576 M** publicado (2 USD/GPU·h × GPU·h) | **~100 M** (2048 × ~50k USD/GPU) | `deepSeekV3Paper`, `h100CapexPerGpuEst`, `metaH100ClusterTco` |
| Llama 3.1 405B | **~61,7 M** ilustrativo (misma convención 2 USD/GPU·h) | **~800 M** pico (16k × ~50k USD/GPU) | `llama31Card`, `metaLlamaBlog`, `deepSeekV3Paper`, `h100CapexPerGpuEst`, `metaH100ClusterTco` |

CapEx y Llama USD **no** los publica Meta/DeepSeek; coste de entrenar DeepSeek sí (tabla 1 del informe). **2 USD/GPU·h** es supuesto de alquiler en el paper, no derivado del CapEx; TCO publicado H100 ~1,5 USD/GPU·h (Meta) sirve de sanidad, no de prueba.

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

## Precios API por prompt (slide `ia-costos-prompt`)

Ejemplo fijo: **1 000 tokens de entrada + 1 000 de salida**, tier **Standard**, solo texto (sin grounding, tools, ni prompt cache). Fórmula: `(1K/1M)×input $/MTok + (1K/1M)×output $/MTok`.

| Modelo en slide | Input $/MTok | Output $/MTok | 1 chat | ×100 | Fuente |
|-----------------|-------------|---------------|--------|------|--------|
| Gemini 2.5 Flash | 0.30 | 2.50 | **$0.0028** | $0.28 | [Gemini pricing](https://ai.google.dev/gemini-api/docs/pricing) § gemini-2.5-flash |
| GPT-5.4 mini | 0.75 | 4.50 | **$0.0053** | $0.53 | [OpenAI pricing](https://platform.openai.com/docs/pricing) (gpt-5.4-mini) |
| GPT-5.4 | 2.50 | 15.00 | **$0.0175** | $1.75 | idem (gpt-5.4, contexto ≤272K) |
| Claude Sonnet 4.6 | 3.00 | 15.00 | **$0.0180** | $1.80 | [Anthropic pricing](https://www.anthropic.com/pricing#api) (legacy Sonnet 4.6) |
| DeepSeek chat (API oficial) | 0.28 | 0.42 | **$0.00070** | $0.070 | [Models & pricing](https://api-docs.deepseek.com/quick_start/pricing) · `deepseek-chat` (V3.x) |
| Llama 3.3 70B (API hosted) | 0.22 | 0.50 | **$0.00072** | $0.072 | [Meta Llama API](https://ai.developer.meta.com/docs/pricing-rate-limits) (tarifa hosted de referencia; revisar tier/modelo) |

Notas: OpenAI **gpt-5.4-mini** redondea a $0.0053 (exacto $0.00525). Gemini cobra tokens de razonamiento como salida. Los precios cambian; revisar antes de grabar.

IDs en pie: `googleGeminiPricing`, `openAiPricingDocs`, `anthropicPricing`, `deepSeekApiPricing`, `metaLlamaApiHosted`.

## Train vs inferencia DeepSeek (`ia-costos-train-vs-infer-deepseek`)

| ID | Uso |
|----|-----|
| `deepSeekV3Paper` | USD **5,576 M** entrenamiento (1×) |
| `deepSeekApiPricing` | Tarifa **deepseek-chat** (0,28 / 0,42 USD/MTok cache miss + out) |
| `nistDeepSeekEval2025` | **97,5 M** peticiones API en **4 semanas** tras V3.1 en **OpenRouter** (muestra parcial, no total DeepSeek) |

**Chats (tarifa lista 1k+1k):** 97,5 M req × **USD 0,00070/req** ≈ **USD 68 k / 4 sem** · **~USD 17 k / sem** · **~USD 887 k / año** (extrap. 52/4 del tramo publicado). **Train:** **USD 5,576 M** (1×). Pie del slide: áreas ∝ train 1× vs chats 1 año est. DeepSeek no publica req totales de `api.deepseek.com`.

## Virtualización (CPU / contenedores)

| ID | Uso en la charla | Enlace |
|----|------------------|--------|
| `nistHypervisor125a` | Hypervisor en servidores: virtualiza CPU/RAM/red; VMs con SO invitado; Tipo 1 (bare metal) vs Tipo 2 (hosted) | https://csrc.nist.gov/pubs/sp/800/125/a/r1/final |
| `nistVmGlossary` | Definición NIST de máquina virtual (stack virtualizado + guest OS) | https://csrc.nist.gov/glossary/term/virtual_machine |
| `nistContainers190` | Contenedores = empaquetado + ejecución; kernel compartido; aislamiento entre apps | https://csrc.nist.gov/pubs/sp/800/190/final |
| `dockerOverview` | Docker Engine, imágenes vs contenedores en ejecución | https://docs.docker.com/get-started/docker-overview/ |

En la comparación final se cruza con `doe` (consolidar cargas en menos servidores) y `berkeley2024` (escala energética de datacenters).

## Virtualización GPU (IA / datacenter)

| ID | Uso en la charla | Enlace |
|----|------------------|--------|
| `nvidiaMigGuide` | MIG: partición física de SM/memoria/ancho de banda; perfiles por GPU; contraste con streams/MPS | https://docs.nvidia.com/datacenter/tesla/mig-user-guide/latest/index.html |
| `nvidiaVgpuScheduling` | vGPU time-sliced: best effort, equal share, fixed share entre VMs | https://docs.nvidia.com/vgpu/latest/grid-vgpu-user-guide/changing-vgpu-scheduling-policy.html |
| `ubuntuKvmGpuVirt` | Passthrough VFIO vs mediated devices (vGPU) en KVM/QEMU | https://ubuntu.com/server/docs/how-to/graphics/gpu-virtualization-with-qemu-kvm |
| `nistHypervisor125a` | Contexto hypervisor/VM (CPU) antes del salto a GPU | https://csrc.nist.gov/pubs/sp/800/125/a/r1/final |
| `nvidiaMigBlog` | MIG en A100: inferencia concurrente; límites entrenamiento multi-GPU | https://developer.nvidia.com/blog/getting-the-most-out-of-the-a100-gpu-with-multi-instance-gpu/ |
| `awsEksMig` | Cuándo MIG vs time-slicing; NCCL/P2P; reutilizar GPU post-entrenamiento | https://docs.aws.amazon.com/eks/latest/userguide/device-management-nvidia-mig.html |
| `thunderComputeGpuTcp` | GPU-over-TCP: CUDA remoto, detach idle, ~10–20 ms reattach | https://www.thundercompute.com/blog/how-thunder-compute-works-gpu-over-tcp |

## Agua y energía (slides finales `ambiente-*`)

| ID | Uso en la charla | Enlace |
|----|------------------|--------|
| `berkeley2024` | Electricidad EE. UU.: ~58–60 TWh (2014–16), 76 TWh (2018), 176 TWh (2023) | https://eta-publications.lbl.gov/publications/united-states-data-center-energy-usage-report |
| `berkeley2026` | Actualización 2025 del informe LBNL (proyecciones; no en gráfica) | https://www.energy.gov/documents/united-states-data-center-energy-usage-report-2025-update |
| `lbnlDcWater2024` | Agua directa ~21,2 mil M L (2014) → ~66 mil M L (2023); indirecta ~800 mil M L (2023) | https://eta-publications.lbl.gov/publications/united-states-data-center-energy |
| `leiDcWaterReview2025` | Variabilidad por workload/sitio; no hay ml/prompt universal | https://doi.org/10.1016/j.resconrec.2024.107876 |
| `liMakingAiLessThirsty` | Origen del mito “botella por prompt” (modelo GPT-3, no medición en vivo) | https://arxiv.org/abs/2304.03271 |
| `microsoftDatacenterWue` | WUE global 0,30 → 0,27 L/kWh IT (FY24→FY25) | https://datacenters.microsoft.com/sustainability/efficiency/ |
| `microsoftWaterStewardship2026` | Intensidad histórica ~2,3 → 0,27 L/kWh; agua reciclada en sitios clave | https://blogs.microsoft.com/blog/2026/06/24/inside-microsofts-two-decade-push-to-cut-water-intensity-while-scaling-for-growth/ |
| `googleDatacenterWater` | Estrés hídrico local, agua reciclada, meta repone > consume (2030) | https://datacenters.google/water/ |
| `googleGeminiEnvMetrics2025` | Ejemplo medido prompt mediano Gemini Apps (Wh/agua) — no universal | https://cloud.google.com/blog/products/ai-machine-learning/understanding-the-environmental-impact-of-gemini |
| `garCarbonAwareRouting` | Slide `ambiente-carbon-aware` (después de Microsoft/Google) | https://arxiv.org/abs/2605.11603 |

Gráficas: `src/data/dcWaterTrend.ts`, `src/data/dcEnergyTrend.ts` — solo puntos publicados en LBNL 2024.

## Uso de IA (`uso-ia-*`, después de ambiente)

| ID | Uso en la charla | Enlace |
|----|------------------|--------|
| `chiSmallerModel2025` | Elegir modelos más pequeños; a veces no hace falta ML | https://dl.acm.org/doi/10.1145/3706598.3713240 |
| `llmEnergyAccuracy2025` | Modelos medianos vs gigantes en energía de inferencia | https://dl.acm.org/doi/10.1145/3744255.3811741 |
| `anthropicPricing` / `openAiPricing` | Referencia de APIs “grandes” (coste por token, no métrica ambiental) | ver `sources.ts` |

## Notas para el pie de diapositiva

- En proyector, el pie usa gris `#5A5A5A` sobre amarillo.
- Cada `beginSlide` en `paso0-servidores.tsx` elige qué IDs mostrar.
