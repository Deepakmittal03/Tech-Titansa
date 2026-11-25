import { describe, it, expect } from 'vitest';
import { RetailAIEngine } from '@/lib/ai-engine';

describe('Retail AI & Computer Vision Innovation Engine', () => {
  it('should cross-check cart items using vision feed simulation with high confidence', () => {
    const items = [
      { name: 'Amul Taaza Milk', quantity: 2 },
      { name: 'Maggi Noodles Pack', quantity: 1 },
    ];

    const result = RetailAIEngine.analyzeTurnstileVisionFeed(items, {
      sensorId: 'GATE_01',
      frameConfidence: 0.965,
    });

    expect(result.matchScore).toBe(96.5);
    expect(result.autoClearTurnstile).toBe(true);
    expect(result.recommendation).toBe('CLEAR');
    expect(result.detectedItems.length).toBe(2);
  });

  it('should generate Bayesian demand forecasts with restock recommendations', () => {
    const history = [
      { date: '2024-11-20', units: 10 },
      { date: '2024-11-21', units: 12 },
      { date: '2024-11-22', units: 15 },
    ];

    const forecast = RetailAIEngine.generatePredictiveDemandForecast(
      history,
      8, // low stock
      'BEV-TAT-500',
      'Tata Tea Gold'
    );

    expect(forecast.predictedDemandNext7Days).toBeGreaterThan(0);
    expect(forecast.replenishmentPriority).toBe('CRITICAL');
    expect(forecast.optimalReorderQuantity).toBeGreaterThan(0);
    expect(forecast.expectedStockoutDate).toBeDefined();
  });

  it('should compute fraud risk vector and classify suspicious fast scan intervals', () => {
    // Normal transaction
    const normalTx = RetailAIEngine.computeTransactionRiskVector({
      cartEditCountLast2Min: 1,
      paymentAttempts: 1,
      barcodeScanIntervalMs: [2500, 3200, 1800],
      isFirstTimeShopper: false,
    });
    expect(normalTx.riskTier).toBe('LOW');
    expect(normalTx.action).toBe('AUTO_APPROVE');

    // Bot / Cloned Barcode Attack (< 400ms scan intervals + rapid cart edits)
    const attackTx = RetailAIEngine.computeTransactionRiskVector({
      cartEditCountLast2Min: 6,
      paymentAttempts: 3,
      barcodeScanIntervalMs: [120, 150, 90], // Inhuman speeds
      isFirstTimeShopper: true,
    });
    expect(attackTx.riskTier).toBe('HIGH');
    expect(attackTx.action).toBe('HOLD_FOR_OPERATOR_REVIEW');
  });
});
