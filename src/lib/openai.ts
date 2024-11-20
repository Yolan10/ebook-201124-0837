import { outlineAssistantPrompt } from '../prompts/outlineAssistant';
import { outlineCounterPrompt } from '../prompts/outlineCounter';
import { contentWriterPrompt } from '../prompts/contentWriter';
import { openAIConfig } from '../prompts/config';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  throw new Error('OpenAI API key is not set in environment variables');
}

export const openai = {
  apiKey: OPENAI_API_KEY,
  baseUrl: 'https://api.openai.com/v1',
  
  async callOpenAI(model: string, messages: any[], temperature: number, maxTokens: number) {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens: maxTokens,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('OpenAI API Error:', errorData);
      throw new Error(errorData.error?.message || 'Failed to call OpenAI API');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  },
  
  async generateOutline(description: string) {
    try {
      return await this.callOpenAI(
        openAIConfig.models.outline,
        [{
          role: 'system',
          content: outlineAssistantPrompt.system
        }, {
          role: 'user',
          content: outlineAssistantPrompt.generateOutline(description)
        }],
        openAIConfig.temperatures.outline,
        openAIConfig.maxTokens.outline
      );
    } catch (error) {
      console.error('Error generating outline:', error);
      throw error;
    }
  },

  async improveOutline(currentOutline: string, comment: string) {
    try {
      return await this.callOpenAI(
        openAIConfig.models.improvement,
        [{
          role: 'system',
          content: outlineAssistantPrompt.system
        }, {
          role: 'user',
          content: `Here is my current outline:\n\n${currentOutline}\n\nPlease improve it based on this feedback:\n${comment}`
        }],
        openAIConfig.temperatures.improvement,
        openAIConfig.maxTokens.improvement
      );
    } catch (error) {
      console.error('Error improving outline:', error);
      throw error;
    }
  },

  async generateChapters(outline: string) {
    try {
      // First, get the chapter count
      const chapterCount = parseInt(await this.callOpenAI(
        openAIConfig.models.counter,
        [{
          role: 'system',
          content: outlineCounterPrompt.system
        }, {
          role: 'user',
          content: outlineCounterPrompt.countChapters(outline)
        }],
        openAIConfig.temperatures.counter,
        openAIConfig.maxTokens.counter
      ), 10);

      // Generate introduction, chapters, and conclusion in parallel
      const outlinePoints = outline
        .split('\n')
        .filter(line => line.trim())
        .map(line => line.trim());

      const allPromises = [
        // Introduction
        this.callOpenAI(
          openAIConfig.models.chapters,
          [{
            role: 'system',
            content: contentWriterPrompt.system
          }, {
            role: 'user',
            content: contentWriterPrompt.generateIntroduction(outline)
          }],
          openAIConfig.temperatures.chapters,
          openAIConfig.maxTokens.chapters
        ),

        // Main chapters
        ...outlinePoints.slice(0, chapterCount).map((point, index) =>
          this.callOpenAI(
            openAIConfig.models.chapters,
            [{
              role: 'system',
              content: contentWriterPrompt.system
            }, {
              role: 'user',
              content: contentWriterPrompt.generateChapter(point, index + 1, chapterCount)
            }],
            openAIConfig.temperatures.chapters,
            openAIConfig.maxTokens.chapters
          )
        ),

        // Conclusion
        this.callOpenAI(
          openAIConfig.models.chapters,
          [{
            role: 'system',
            content: contentWriterPrompt.system
          }, {
            role: 'user',
            content: contentWriterPrompt.generateConclusion(outline)
          }],
          openAIConfig.temperatures.chapters,
          openAIConfig.maxTokens.chapters
        ),
      ];

      return await Promise.all(allPromises);
    } catch (error) {
      console.error('Error generating chapters:', error);
      throw error;
    }
  }
};