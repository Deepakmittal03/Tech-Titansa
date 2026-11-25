import { NextResponse } from 'next/server';
import { DataStore } from '@/lib/data-store';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const storeId = searchParams.get('store_id') || undefined;

  const metrics = DataStore.getDashboardMetrics(storeId);
  return NextResponse.json({ success: true, data: metrics });
}
