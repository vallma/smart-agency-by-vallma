import { LLMProvider } from '../types';
import { GeminiProvider } from './GeminiProvider';
import { ClaudeProvider } from './ClaudeProvider';
import { OpenAIProvider } from './OpenAIProvider';
import { ProviderName, OLLAMA_BASE_URL } from '../constants';

const PERPLEXITY_BASE_URL = 'https://api.perplexity.ai';

export function createProvider(providerName: ProviderName, apiKey: string): LLMProvider {
  switch (providerName) {
    case 'claude':
      return new ClaudeProvider(apiKey);
    case 'openai':
      return new OpenAIProvider(apiKey);
    case 'perplexity':
      return new OpenAIProvider(apiKey, PERPLEXITY_BASE_URL);
    case 'ollama':
      return new OpenAIProvider('ollama', OLLAMA_BASE_URL);
    case 'gemini':
    default:
      return new GeminiProvider(apiKey);
  }
}
