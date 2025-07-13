import axios from 'axios';

// LLM7.io API client
class LLM7Client {
  constructor(options = {}) {
    this.baseURL = options.baseURL || process.env.LLM7_BASE_URL || 'https://llm7.io/v1';
    this.apiKey = options.apiKey || process.env.LLM7_API_KEY || 'unused';
    this.token = options.token || process.env.LLM7_TOKEN || null;
    this.timeout = options.timeout || 30000;
    
    // Create axios instance
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: this.timeout,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token || this.apiKey}`,
      },
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        console.log(`LLM7 Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('LLM7 Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        console.log(`LLM7 Response: ${response.status} ${response.statusText}`);
        return response;
      },
      (error) => {
        console.error('LLM7 Response Error:', error.response?.data || error.message);
        return Promise.reject(this.handleError(error));
      }
    );
  }

  // Handle API errors
  handleError(error) {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      return new Error(`LLM7 API Error (${status}): ${data.error?.message || data.message || 'Unknown error'}`);
    } else if (error.request) {
      // Request was made but no response received
      return new Error('LLM7 API Error: No response received');
    } else {
      // Something else happened
      return new Error(`LLM7 API Error: ${error.message}`);
    }
  }

  // Get available models
  async getModels() {
    try {
      const response = await this.client.get('/models');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Chat completion
  async chatCompletion(options = {}) {
    const {
      model = 'gpt-4',
      messages = [],
      temperature = 0.7,
      max_tokens = 1000,
      top_p = 1,
      frequency_penalty = 0,
      presence_penalty = 0,
      stream = false,
      ...otherOptions
    } = options;

    try {
      const response = await this.client.post('/chat/completions', {
        model,
        messages,
        temperature,
        max_tokens,
        top_p,
        frequency_penalty,
        presence_penalty,
        stream,
        ...otherOptions
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Simple text completion
  async complete(prompt, options = {}) {
    const messages = [
      { role: 'user', content: prompt }
    ];

    const response = await this.chatCompletion({
      messages,
      ...options
    });

    return response.choices[0]?.message?.content || '';
  }

  // Chat with conversation history
  async chat(messages, options = {}) {
    const response = await this.chatCompletion({
      messages,
      ...options
    });

    return {
      message: response.choices[0]?.message?.content || '',
      usage: response.usage,
      model: response.model,
      id: response.id
    };
  }

  // Stream chat completion
  async streamChatCompletion(options = {}, onChunk) {
    const {
      model = 'gpt-4',
      messages = [],
      temperature = 0.7,
      max_tokens = 1000,
      ...otherOptions
    } = options;

    try {
      const response = await this.client.post('/chat/completions', {
        model,
        messages,
        temperature,
        max_tokens,
        stream: true,
        ...otherOptions
      }, {
        responseType: 'stream'
      });

      return new Promise((resolve, reject) => {
        let fullContent = '';
        
        response.data.on('data', (chunk) => {
          const lines = chunk.toString().split('\n');
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              
              if (data === '[DONE]') {
                resolve(fullContent);
                return;
              }
              
              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices[0]?.delta?.content || '';
                
                if (content) {
                  fullContent += content;
                  if (onChunk) {
                    onChunk(content, fullContent);
                  }
                }
              } catch (e) {
                // Ignore parsing errors for incomplete chunks
              }
            }
          }
        });

        response.data.on('error', (error) => {
          reject(error);
        });

        response.data.on('end', () => {
          resolve(fullContent);
        });
      });
    } catch (error) {
      throw error;
    }
  }

  // Test connection
  async testConnection() {
    try {
      const models = await this.getModels();
      return {
        success: true,
        message: 'Connection successful',
        modelsCount: models.data?.length || 0
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Get usage statistics (if available)
  async getUsage() {
    try {
      // LLM7.io might not have a usage endpoint, so we'll return a placeholder
      return {
        requests: 0,
        tokens: 0,
        cost: 0,
        message: 'Usage tracking not available for LLM7.io'
      };
    } catch (error) {
      throw error;
    }
  }
}

// Available models on LLM7.io (based on the website)
export const LLM7_MODELS = [
  { id: 'bidara', name: 'Bidara', maxTokens: 4096 },
  { id: 'codestral-2405', name: 'Codestral 2405', maxTokens: 32768 },
  { id: 'codestral-2501', name: 'Codestral 2501', maxTokens: 32768 },
  { id: 'deepseek-r1-0528', name: 'DeepSeek R1', maxTokens: 8192 },
  { id: 'deepseek-v3-0324', name: 'DeepSeek V3', maxTokens: 8192 },
  { id: 'gpt-4.1-nano-2025-04-14', name: 'GPT-4.1 Nano', maxTokens: 8192 },
  { id: 'gpt-4o-mini-2024-07-18', name: 'GPT-4o Mini', maxTokens: 128000 },
  { id: 'grok-3-mini-high', name: 'Grok 3 Mini High', maxTokens: 8192 },
  { id: 'llama-4-scout-17b-16e-instruct', name: 'Llama 4 Scout 17B', maxTokens: 8192 },
  { id: 'llama-fast-roblox', name: 'Llama Fast Roblox', maxTokens: 4096 },
  { id: 'ministral-3b-2410', name: 'Ministral 3B', maxTokens: 32768 },
  { id: 'ministral-8b-2410', name: 'Ministral 8B', maxTokens: 32768 },
  { id: 'mirexa', name: 'Mirexa', maxTokens: 4096 },
  { id: 'mistral-large-2402', name: 'Mistral Large 2402', maxTokens: 32768 },
  { id: 'mistral-large-2407', name: 'Mistral Large 2407', maxTokens: 32768 },
  { id: 'mistral-large-2411', name: 'Mistral Large 2411', maxTokens: 32768 },
  { id: 'mistral-medium', name: 'Mistral Medium', maxTokens: 32768 },
  { id: 'mistral-saba-2502', name: 'Mistral Saba 2502', maxTokens: 32768 },
  { id: 'mistral-small-2402', name: 'Mistral Small 2402', maxTokens: 32768 },
  { id: 'mistral-small-2409', name: 'Mistral Small 2409', maxTokens: 32768 },
  { id: 'mistral-small-2501', name: 'Mistral Small 2501', maxTokens: 32768 },
  { id: 'mistral-small-2503', name: 'Mistral Small 2503', maxTokens: 32768 },
  { id: 'mistral-small-3.1-24b-instruct-2503', name: 'Mistral Small 3.1 24B', maxTokens: 32768 },
  { id: 'open-mistral-7b', name: 'Open Mistral 7B', maxTokens: 32768 },
  { id: 'open-mistral-nemo', name: 'Open Mistral Nemo', maxTokens: 32768 },
  { id: 'open-mixtral-8x22b', name: 'Open Mixtral 8x22B', maxTokens: 65536 },
  { id: 'open-mixtral-8x7b', name: 'Open Mixtral 8x7B', maxTokens: 32768 },
  { id: 'openai-reasoning', name: 'OpenAI Reasoning', maxTokens: 8192 },
  { id: 'phi-4-multilmodal-instruct', name: 'Phi-4 Multimodal', maxTokens: 8192 },
  { id: 'pixtral-12b-2409', name: 'Pixtral 12B', maxTokens: 32768 },
  { id: 'pixtral-large-2411', name: 'Pixtral Large', maxTokens: 32768 },
  { id: 'qwen2.5-coder-32b-instruct', name: 'Qwen2.5 Coder 32B', maxTokens: 32768 },
  { id: 'rtist', name: 'Rtist', maxTokens: 4096 }
];

// Default LLM7 client instance
export const llm7 = new LLM7Client();

// Helper functions
export const llm7Utils = {
  // Get model by ID
  getModel(modelId) {
    return LLM7_MODELS.find(model => model.id === modelId);
  },

  // Get available models
  getAvailableModels() {
    return LLM7_MODELS;
  },

  // Format messages for chat
  formatMessages(messages) {
    return messages.map(msg => ({
      role: msg.role || 'user',
      content: msg.content || msg.message || ''
    }));
  },

  // Create system message
  createSystemMessage(content) {
    return { role: 'system', content };
  },

  // Create user message
  createUserMessage(content) {
    return { role: 'user', content };
  },

  // Create assistant message
  createAssistantMessage(content) {
    return { role: 'assistant', content };
  },

  // Estimate tokens (rough estimation)
  estimateTokens(text) {
    // Rough estimation: 1 token ≈ 4 characters
    return Math.ceil(text.length / 4);
  },

  // Validate model
  isValidModel(modelId) {
    return LLM7_MODELS.some(model => model.id === modelId);
  }
};

export default LLM7Client;

