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
  stanfordAiIndex2024: {
    id: 'stanfordAiIndex2024',
    short: 'Stanford HAI, AI Index 2024 (GPT-4 ~$78M compute est.)',
    url: 'https://hai.stanford.edu/ai-index/2024-ai-index-report',
  },
  h100CapexPerGpuEst: {
    id: 'h100CapexPerGpuEst',
    short: 'Est. ~50k USD/GPU CapEx (clusters H100/H800, 2024)',
    url: 'https://substack.tech-talk-cto.com/p/h100-freakonomics-the-economical',
  },
  metaH100ClusterTco: {
    id: 'metaH100ClusterTco',
    short: 'Análisis Meta 24k H100: TCO ~1,5 USD/GPU·h',
    url: 'https://pytorchtoatoms.substack.com/p/metas-24k-h100-cluster-capextco-and',
  },
  epochFrontierTrainingCosts: {
    id: 'epochFrontierTrainingCosts',
    short: 'Epoch AI et al., cost of training frontier models (2024)',
    url: 'https://arxiv.org/abs/2405.21015',
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
  deepSeekApiPricing: {
    id: 'deepSeekApiPricing',
    short: 'DeepSeek API — deepseek-chat USD/MTok (oficial)',
    url: 'https://api-docs.deepseek.com/quick_start/pricing',
  },
  nistDeepSeekEval2025: {
    id: 'nistDeepSeekEval2025',
    short: 'NIST CAISI — OpenRouter 97.5M req / 4 wks (DeepSeek V3.1)',
    url: 'https://www.nist.gov/system/files/documents/2025/09/30/CAISI_Evaluation_of_DeepSeek_AI_Models.pdf',
  },
  metaLlamaApiHosted: {
    id: 'metaLlamaApiHosted',
    short: 'Meta Llama API hosted pricing (USD/MTok; slide usa 3.3 70B ref.)',
    url: 'https://ai.developer.meta.com/docs/pricing-rate-limits',
  },
  luccioniPowerHungry2023: {
    id: 'luccioniPowerHungry2023',
    short: 'Luccioni et al., inference & deployment energy (2023)',
    url: 'https://arxiv.org/abs/2311.16863',
  },
  bloomModelCard: {
    id: 'bloomModelCard',
    short: 'BigScience, BLOOM 176B model card',
    url: 'https://huggingface.co/bigscience/bloom',
  },
  bloomCarbonJmlr: {
    id: 'bloomCarbonJmlr',
    short: 'Luccioni et al., BLOOM carbon & 1.08M GPU-h (JMLR 2023)',
    url: 'https://www.jmlr.org/papers/volume24/23-0069/23-0069.pdf',
  },
  gpt3Epoch: {
    id: 'gpt3Epoch',
    short: 'Epoch AI, GPT-3 175B training compute & cost est.',
    url: 'https://epoch.ai/models/gpt-3-175b-davinci',
  },
  gpt3Paper: {
    id: 'gpt3Paper',
    short: 'Brown et al., Language Models are Few-Shot Learners (2020)',
    url: 'https://arxiv.org/abs/2005.14165',
  },
  llama2ModelCard: {
    id: 'llama2ModelCard',
    short: 'Meta, Llama 2 model card (A100 GPU-hours)',
    url: 'https://github.com/meta-llama/llama-models/blob/main/models/llama2/MODEL_CARD.md',
  },
  openAiPricing: {
    id: 'openAiPricing',
    short: 'OpenAI API pricing',
    url: 'https://openai.com/api/pricing/',
  },
  anthropicPricing: {
    id: 'anthropicPricing',
    short: 'Anthropic API pricing (Claude models, $/MTok)',
    url: 'https://www.anthropic.com/pricing#api',
  },
  openAiPricingDocs: {
    id: 'openAiPricingDocs',
    short: 'OpenAI Platform docs, API pricing ($/MTok)',
    url: 'https://platform.openai.com/docs/pricing',
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
  nistHypervisor125a: {
    id: 'nistHypervisor125a',
    short: 'NIST SP 800-125A, server hypervisor & VMs (Type 1/2)',
    url: 'https://csrc.nist.gov/pubs/sp/800/125/a/r1/final',
  },
  nistVmGlossary: {
    id: 'nistVmGlossary',
    short: 'NIST CSRC glossary, virtual machine (VM)',
    url: 'https://csrc.nist.gov/glossary/term/virtual_machine',
  },
  nistContainers190: {
    id: 'nistContainers190',
    short: 'NIST SP 800-190, application containers & shared kernel',
    url: 'https://csrc.nist.gov/pubs/sp/800/190/final',
  },
  dockerOverview: {
    id: 'dockerOverview',
    short: 'Docker Docs, containers & Docker Engine overview',
    url: 'https://docs.docker.com/get-started/docker-overview/',
  },
};

export function formatSourceLine(ids: string[]): string {
  return ids
    .map(id => sources[id]?.short ?? id)
    .join(' · ');
}
