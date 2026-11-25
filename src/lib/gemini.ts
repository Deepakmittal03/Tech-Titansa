import { GoogleGenAI } from '@google/genai';

/**
 * peNgo Autonomous Retail Gemini AI Integration
 * Uses Gemini 2.0 Flash / Pro for multimodal visual shelf auditing,
 * predictive demand intelligence, and automated fraud heuristics.
 */

const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || 'AIzaSyDemoKeyMock';

export const ai = new GoogleGenAI({ apiKey });

export async function auditShelfWithGeminiVision(imageBase64: string) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return {
        success: true,
        mock: true,
        detectedProducts: [
          { name: 'Amul Taaza Milk (1L)', count: 8, status: 'LOW_STOCK' },
          { name: 'Cadbury Silk Almond', count: 24, status: 'HEALTHY' }
        ],
        anomalies: ['Displaced SKU detected on Aisle 3'],
      };
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [
        {
          role: 'user',
          parts: [
            { text: 'Analyze this retail supermarket shelf image. Identify product count, low-stock gaps, and misaligned items.' },
            { inlineData: { mimeType: 'image/jpeg', data: imageBase64 } }
          ]
        }
      ]
    });

    return {
      success: true,
      text: response.text,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
}
