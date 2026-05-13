export const DEFAULT_MODELS = {
  text: 'gemini-3-flash-preview',
  image: 'gemini-3.1-flash-image-preview',
  music: 'lyria-3-clip-preview',
  video: 'veo-3.1-lite-generate-preview'
} as const;

export const PROVIDERS = ['gemini', 'claude', 'openai', 'perplexity'] as const;
export type ProviderName = typeof PROVIDERS[number];

export const PROVIDER_LABELS: Record<ProviderName, string> = {
  gemini: 'Gemini',
  claude: 'Claude',
  openai: 'OpenAI',
  perplexity: 'Perplexity',
};

export const PROVIDER_MODELS: Record<ProviderName, string[]> = {
  gemini: [
    'gemini-3-flash-preview',
    'gemini-3.1-pro-preview',
    'gemini-3.1-flash-lite-preview',
  ],
  claude: [
    'claude-opus-4-6',
    'claude-sonnet-4-6',
    'claude-haiku-4-5-20251001',
  ],
  openai: [
    'gpt-4o',
    'gpt-4o-mini',
    'o4-mini',
  ],
  perplexity: [
    'sonar-pro',
    'sonar',
    'sonar-reasoning-pro',
  ],
};

export const AVAILABLE_MODELS = {
  text: [
    'gemini-3-flash-preview',
    'gemini-3.1-pro-preview',
    'gemini-3.1-flash-lite-preview'
  ],
  image: [
    'gemini-3.1-flash-image-preview',
    'gemini-3-pro-image-preview',
    'gemini-2.5-flash-image'
  ],
  music: [
    'lyria-3-clip-preview',
    'lyria-3-pro-preview'
  ],
  video: [
    'veo-3.1-lite-generate-preview',
    'veo-3.1-fast-generate-preview',
    'veo-3.1-generate-preview'
  ]
} as const;

export type ModelType = keyof typeof AVAILABLE_MODELS;
