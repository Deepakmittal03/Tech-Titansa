import { NextResponse } from 'next/server';
import { RetailAIEngine } from '@/lib/ai-engine';
import { DataStore } from '@/lib/data-store';

export async function GET() {
  try {
    const products = DataStore.getProducts().slice(0, 5);
    const forecasts = products.map((p) => {
      return RetailAIEngine.generatePredictiveDemandForecast(
        [
          { date: '2024-11-20', units: 14 },
          { date: '2024-11-21', units: 18 },
          { date: '2024-11-22', units: 25 },
          { date: '2024-11-23', units: 32 },
          { date: '2024-11-24', units: 29 },
        ],
        45,
        p.sku,
        p.name
      );
    });

    return NextResponse.json({
      status: 'success',
      model: 'peNgo-Retail-Demand-v2',
      engine: 'Bayesian Time-Series + Neural Uplift',
      timestamp: new Date().toISOString(),
      forecasts,
    });
  } catch (error: any) {
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}
