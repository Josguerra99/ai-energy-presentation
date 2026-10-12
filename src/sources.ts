/** Bibliografía Paso 0 — enlaces para notas al pie / pie de diapositiva. */
export type SourceRef = {
  id: string;
  short: string;
  url: string;
};

export const sources: Record<string, SourceRef> = {
  llama31Card: {
    id: 'llama31Card',
    short: 'Meta, Llama 3.1 model card (GPU-hours H100)',
    url: 'https://huggingface.co/meta-llama/Llama-3.1-405B',
  },
  metaLlamaBlog: {
    id: 'metaLlamaBlog',
    short: 'Meta AI, Llama 3.1 announcement',
    url: 'https://ai.meta.com/blog/meta-llama-3-1/',
  },
  stanfordAiIndex2025: {
    id: 'stanfordAiIndex2025',
    short: 'Stanford HAI, AI Index 2025 (training cost est.)',
    url: 'https://hai.stanford.edu/ai-index/2025-ai-index-report',
  },
  epochAi: {
    id: 'epochAi',
    short: 'Epoch AI, frontier training cost estimates',
    url: 'https://epoch.ai/',
  },
  deepSeekV3Paper: {
    id: 'deepSeekV3Paper',
    short: 'DeepSeek-V3 technical report (GPU-h, compute cost)',
    url: 'https://arxiv.org/abs/2412.19437',
  },
  bloomModelCard: {
    id: 'bloomModelCard',
    short: 'BigScience, BLOOM 176B model card',
    url: 'https://huggingface.co/bigscience/bloom',
  },
  openAiPricing: {
    id: 'openAiPricing',
    short: 'OpenAI API pricing',
    url: 'https://openai.com/api/pricing/',
  },
  anthropicPricing: {
    id: 'anthropicPricing',
    short: 'Anthropic API pricing',
    url: 'https://www.anthropic.com/pricing',
  },
  googleGeminiPricing: {
    id: 'googleGeminiPricing',
    short: 'Google Gemini API pricing',
    url: 'https://ai.google.dev/gemini-api/docs/pricing',
  },
  berkeley2024: {
    id: 'berkeley2024',
    short: 'Berkeley Lab, US DC energy (2024)',
    url: 'https://eta.lbl.gov/publications/united-states-data-center-energy-usage-report',
  },
  berkeley2026: {
    id: 'berkeley2026',
    short: 'Berkeley Lab, DC energy update (2026)',
    url: 'https://eta.lbl.gov/',
  },
  doe: {
    id: 'doe',
    short: 'DOE FEMP, PUE 1.6 / 1.4 / 1.1',
    url: 'https://www.energy.gov/sites/default/files/2024-07/best-practice-guide-data-center-design.pdf',
  },
  uptime2018: {
    id: 'uptime2018',
    short: 'Uptime Institute, Global DC Survey 2018',
    url: 'https://intelligence.uptimeinstitute.com/sites/default/files/mammoth/2023/09/12/Keynote%20report%2013_UI%20Global%20Data%20Center%20Survey%202018.pdf',
  },
  uptime2024: {
    id: 'uptime2024',
    short: 'Uptime Institute, Global DC Survey 2024 (PUE 1.56)',
    url: 'https://datacenter.uptimeinstitute.com/rs/711-RIA-145/images/2024.GlobalDataCenterSurvey.Report.pdf',
  },
  uptime2025: {
    id: 'uptime2025',
    short: 'Uptime Institute, Global DC Survey 2025 (PUE 1.54)',
    url: 'https://datacenter.uptimeinstitute.com/rs/711-RIA-145/images/2025.Annual.Survey.Report.pdf',
  },
  uptime2026: {
    id: 'uptime2026',
    short: 'Uptime Institute, Global DC Survey 2026 (PUE 1.52)',
    url: 'https://datacenter.uptimeinstitute.com/rs/711-RIA-145/images/UptimeInstitute.GlobalDataCenterSurvey.2026.pdf',
  },
  uptimePueBlog: {
    id: 'uptimePueBlog',
    short: 'Uptime Journal, Global PUEs trend',
    url: 'https://journal.uptimeinstitute.com/global-pues-are-they-going-anywhere/',
  },
  ieeeTco: {
    id: 'ieeeTco',
    short: 'IEEE, data center TCO model',
    url: 'https://ieeexplore.ieee.org/',
  },
  microsoftTco: {
    id: 'microsoftTco',
    short: 'Microsoft, historical DC TCO breakdown',
    url: 'https://www.microsoft.com/en-us/download/details.aspx',
  },
};

export function formatSourceLine(ids: string[]): string {
  return ids
    .map(id => sources[id]?.short ?? id)
    .join(' · ');
}
