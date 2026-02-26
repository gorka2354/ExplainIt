import { StorageManager } from './storage';

export type AIProvider = 'openai' | 'anthropic' | 'google';

export interface AIModelConfig {
  provider: AIProvider;
  model: string;
  apiKey: string;
  baseUrl?: string;
}

export class ApiClient {
  static async executePrompt(systemPrompt: string, userPrompt: string): Promise<string> {
    const settings = await StorageManager.getSettings();
    const config = settings.aiConfig as AIModelConfig;

    if (!config?.apiKey) {
      throw new Error('API Key not found. Please set it in Settings.');
    }

    switch (config.provider) {
      case 'openai':
        return this.callOpenAI(systemPrompt, userPrompt, config);
      case 'anthropic':
        return this.callAnthropic(systemPrompt, userPrompt, config);
      case 'google':
        return this.callGemini(systemPrompt, userPrompt, config);
      default:
        throw new Error('Unsupported AI provider');
    }
  }

  static async explain(text: string, langFallback: string = 'ru'): Promise<string> {
    const settings = await StorageManager.getSettings();
    const lang = settings.outputLanguage || langFallback;
    const customPrompt = settings.aiConfig?.customPrompt?.trim();
    
    const systemPrompt = customPrompt || `You are a helpful assistant. Explain terms or text clearly in ${lang}. Be concise.`;
    const userPrompt = `Explain this: "${text}"`;
    return this.executePrompt(systemPrompt, userPrompt);
  }

  static async quickAction(text: string, action: 'synonyms' | 'examples', langFallback: string = 'ru'): Promise<string> {
    const settings = await StorageManager.getSettings();
    const lang = settings.outputLanguage || langFallback;
    const systemPrompt = `You are a helpful assistant. Write your response in ${lang}. Be concise, clear, and use Markdown formatting if needed.`;
    let userPrompt = '';
    
    if (action === 'synonyms') {
      userPrompt = `Provide a concise list of synonyms (and antonyms if applicable) for the word or phrase: "${text}". Format as bullet points. Only return the list without introductory phrases.`;
    } else if (action === 'examples') {
      userPrompt = `Provide 3 clear, everyday examples of how to use the word or phrase: "${text}" in a sentence. Format as bullet points. Only return the list without introductory phrases.`;
    }
    
    return this.executePrompt(systemPrompt, userPrompt);
  }

  private static async callOpenAI(systemPrompt: string, userPrompt: string, config: AIModelConfig): Promise<string> {
    const baseUrl = config.baseUrl?.replace(/\/$/, '') || 'https://api.openai.com/v1';
    const endpoint = `${baseUrl}/chat/completions`;
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
      },
      body: JSON.stringify({
        model: config.model || 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => null);
      throw new Error(error?.error?.message || `OpenAI API Error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  private static async callAnthropic(systemPrompt: string, userPrompt: string, config: AIModelConfig): Promise<string> {
    const baseUrl = config.baseUrl?.replace(/\/$/, '') || 'https://api.anthropic.com/v1';
    const endpoint = `${baseUrl}/messages`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': config.apiKey,
        'anthropic-version': '2023-06-01',
        'dangerously-allow-browser': 'true'
      },
      body: JSON.stringify({
        model: config.model || 'claude-3-5-sonnet-20240620',
        max_tokens: 1024,
        system: systemPrompt,
        messages: [
          { role: 'user', content: userPrompt }
        ]
      })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => null);
      throw new Error(error?.error?.message || `Anthropic API Error: ${response.status}`);
    }

    const data = await response.json();
    return data.content[0].text;
  }

  private static async callGemini(systemPrompt: string, userPrompt: string, config: AIModelConfig): Promise<string> {
    const baseUrl = config.baseUrl?.replace(/\/$/, '') || 'https://generativelanguage.googleapis.com/v1beta';
    const endpoint = `${baseUrl}/models/${config.model || 'gemini-1.5-flash'}:generateContent`;
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-goog-api-key': config.apiKey
      },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: systemPrompt }]
        },
        contents: [{
          role: "user",
          parts: [{ text: userPrompt }]
        }],
        generationConfig: {
          temperature: 0.7
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.error?.message || `Gemini API Error: ${response.status}`);
    }

    const data = await response.json();
    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw new Error("Invalid response format from Gemini");
    }
    return data.candidates[0].content.parts[0].text;
  }
}