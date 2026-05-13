import OpenAI from 'openai';
import { LLMMessage, LLMProvider, LLMResponse, LLMToolCall, LLMToolDefinition } from '../types';

export class OpenAIProvider implements LLMProvider {
  private client: OpenAI;

  constructor(private apiKey: string, baseURL?: string) {
    this.client = new OpenAI({ apiKey, baseURL, dangerouslyAllowBrowser: true });
  }

  async generateCompletion(
    messages: LLMMessage[],
    tools?: LLMToolDefinition[],
    systemInstruction?: string,
    modelName: string = 'gpt-4o'
  ): Promise<LLMResponse> {
    const openaiMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [];

    if (systemInstruction) {
      openaiMessages.push({ role: 'system', content: systemInstruction });
    }

    for (const m of messages) {
      if (m.role === 'user' || m.role === 'assistant') {
        openaiMessages.push({ role: m.role, content: m.content });
      }
    }

    const params: OpenAI.Chat.ChatCompletionCreateParamsNonStreaming = {
      model: modelName,
      messages: openaiMessages,
    };

    if (tools && tools.length > 0) {
      params.tools = tools.map(t => ({
        type: 'function' as const,
        function: {
          name: t.function.name,
          description: t.function.description,
          parameters: t.function.parameters,
        },
      }));
    }

    const result = await this.client.chat.completions.create(params);
    const choice = result.choices[0];
    const msg = choice.message;

    const toolCalls: LLMToolCall[] = (msg.tool_calls || []).map(tc => ({
      id: tc.id,
      type: 'function' as const,
      function: {
        name: (tc as any).function.name,
        arguments: (tc as any).function.arguments,
      },
    }));

    return {
      content: msg.content ?? null,
      tool_calls: toolCalls.length > 0 ? toolCalls : undefined,
      usage: result.usage ? {
        promptTokens: result.usage.prompt_tokens,
        completionTokens: result.usage.completion_tokens,
        totalTokens: result.usage.total_tokens,
      } : undefined,
      finishReason: choice.finish_reason || undefined,
    };
  }
}
