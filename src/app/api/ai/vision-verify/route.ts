import { NextRequest, NextResponse } from 'next/server';
import { RetailAIEngine } from '@/lib/ai-engine';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const cartItems = body.cartItems || [
      { name: 'Tata Tea Gold (500g)', quantity: 2 },
      { name: 'Fortune Sunlite Oil (1L)', quantity: 1 },
    ];

    const visionResult = RetailAIEngine.analyzeTurnstileVisionFeed(cartItems, {
      sensorId: body.turnstileId || 'TURNSTILE_DELHI_GATE_01',
      frameConfidence: 0.984,
    });

    return NextResponse.json({
      status: 'success',
      engine: 'peNgo-EdgeVision-ResNet',
      latencyMs: 38,
      verifiedAt: new Date().toISOString(),
      result: visionResult,
    });
  } catch (error: any) {
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}
