// LLMClientInterface.ts
// Typed interface for LLM API clients - replaces untyped `apiClient: any`

/**
 * Standard message format for LLM conversations
 */
export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

/**
 * Configuration for LLM generation requests
 */
export interface GenerationConfig {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  stopSequences?: string[];
}

/**
 * Standard response from any LLM client
 */
export interface LLMResponse {
  text: string;
  model: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  finishReason: 'stop' | 'length' | 'content_filter' | 'error';
  latencyMs: number;
}

/**
 * Embedding response from LLM
 */
export interface EmbeddingResponse {
  embedding: number[];
  model: string;
  tokensUsed: number;
}

/**
 * Core interface that ALL LLM clients must implement
 * This ensures type safety and swappability between providers
 */
export interface ILLMClient {
  /** Generate a text completion from a single prompt */
  generate(prompt: string, config?: GenerationConfig): Promise<LLMResponse>;

  /** Multi-turn chat completion */
  chat(messages: ChatMessage[], config?: GenerationConfig): Promise<LLMResponse>;

  /** Generate embeddings for a text */
  embed(text: string): Promise<EmbeddingResponse>;

  /** Check if the client is properly configured and reachable */
  healthCheck(): Promise<boolean>;

  /** Get the provider name (e.g. 'openai', 'anthropic', 'mock') */
  getProvider(): string;
}

/**
 * Mock LLM Client for testing - returns predictable responses
 * Use this in all BDD tests to avoid real API calls
 */
export class MockLLMClient implements ILLMClient {
  private responses: Map<string, string> = new Map();
  private defaultResponse: string = 'This is a mock AI response for testing purposes.';
  private callCount: number = 0;

  constructor(customResponses?: Record<string, string>) {
    if (customResponses) {
      for (const [key, value] of Object.entries(customResponses)) {
        this.responses.set(key.toLowerCase(), value);
      }
    }
  }

  async generate(prompt: string, config?: GenerationConfig): Promise<LLMResponse> {
    this.callCount++;
    const startTime = Date.now();

    // Look up custom response or use default
    const responseText = this.responses.get(prompt.toLowerCase()) || this.defaultResponse;
    const promptTokens = Math.ceil(prompt.length / 4);
    const completionTokens = Math.ceil(responseText.length / 4);

    // Simulate latency (50-200ms)
    await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 150));

    return {
      text: responseText,
      model: config?.model || 'mock-model-v1',
      usage: { promptTokens, completionTokens, totalTokens: promptTokens + completionTokens },
      finishReason: 'stop',
      latencyMs: Date.now() - startTime
    };
  }

  async chat(messages: ChatMessage[], config?: GenerationConfig): Promise<LLMResponse> {
    const lastMessage = messages[messages.length - 1];
    return this.generate(lastMessage.content, config);
  }

  async embed(text: string): Promise<EmbeddingResponse> {
    // Generate a deterministic mock embedding (384 dimensions)
    const embedding = Array.from({ length: 384 }, (_, i) =>
      Math.sin(i * 0.1 + text.length * 0.01)
    );
    return { embedding, model: 'mock-embedding-v1', tokensUsed: Math.ceil(text.length / 4) };
  }

  async healthCheck(): Promise<boolean> {
    return true;
  }

  getProvider(): string {
    return 'mock';
  }

  getCallCount(): number {
    return this.callCount;
  }

  resetCallCount(): void {
    this.callCount = 0;
  }
}

/**
 * Reference implementation shape for OpenAI - shows how real clients would implement ILLMClient
 * NOT functional - just demonstrates the contract
 */
export class OpenAIClientReference implements ILLMClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string, baseUrl: string = 'https://api.openai.com/v1') {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  async generate(prompt: string, config?: GenerationConfig): Promise<LLMResponse> {
    // In production: call fetch(`${this.baseUrl}/completions`, { ... })
    throw new Error('OpenAI client is a reference implementation. Use MockLLMClient for testing.');
  }

  async chat(messages: ChatMessage[], config?: GenerationConfig): Promise<LLMResponse> {
    throw new Error('OpenAI client is a reference implementation. Use MockLLMClient for testing.');
  }

  async embed(text: string): Promise<EmbeddingResponse> {
    throw new Error('OpenAI client is a reference implementation. Use MockLLMClient for testing.');
  }

  async healthCheck(): Promise<boolean> {
    return false; // Not functional
  }

  getProvider(): string {
    return 'openai';
  }
}
