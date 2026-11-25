import { describe, it, expect } from 'vitest';
import { auditShelfWithGeminiVision } from '@/lib/gemini';

describe('Gemini Multimodal Shelf Vision & Retail AI', () => {
  it('should process supermarket shelf audit feed and return detected items', async () => {
    const result = await auditShelfWithGeminiVision('dummyBase64ImageString');
    expect(result.success).toBe(true);
    expect(result.detectedProducts).toBeDefined();
    expect(result.detectedProducts?.length).toBeGreaterThan(0);
  });
});
