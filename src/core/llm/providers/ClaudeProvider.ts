import Anthropic from '@anthropic-ai/sdk';
import { LLMMessage, LLMProvider, LLMResponse, LLMToolCall, LLMToolDefinition } from '../types';

export class ClaudeProvider implements LLMProvider {
  private client: Anthropic;

  constructor(private apiKey: string) {
    this.client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });
  }

  async generateCompletion(
    messages: LLMMessage[],
    tools?: LLMToolDefinition[],
    systemInstruction?: string,
    modelName: string = 'claude-sonnet-4-6'
  ): Promise<LLMResponse> {
    const anthropicMessages = messages
      .filter(m => m.role === 'user' || m.role === 'assistant')
      .map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }));

    const anthropicTools = tools?.map(t => ({
      name: t.function.name,
      description: t.function.description,
      input_schema: t.function.parameters,
    }));

    const params: any = {
      model: modelName,
      max_tokens: 1024,
      messages: anthropicMessages,
    };
    if (systemInstruction) params.system = systemInstruction;
    if (anthropicTools && anthropicTools.length > 0) params.tools = anthropicTools;

    const result = await this.client.messages.create(params);

    let content: string | null = null;
    const toolCalls: LLMToolCall[] = [];

    for (const block of result.content) {
      if (block.type === 'text') {
        content = block.text;
      } else if (block.type === 'tool_use') {
        toolCalls.push({
          id: block.id,
          type: 'function',
          function: {
            name: block.name,
            arguments: JSON.stringify(block.input),
          },
        });
      }
    }

    return {
      content,
      tool_calls: toolCalls.length > 0 ? toolCalls : undefined,
      usage: {
        promptTokens: result.usage.input_tokens,
        completionTokens: result.usage.output_tokens,
        totalTokens: result.usage.input_tokens + result.usage.output_tokens,
      },
      finishReason: result.stop_reason || undefined,
    };
  }
}
