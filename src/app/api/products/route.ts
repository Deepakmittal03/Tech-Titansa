import { NextResponse } from 'next/server';
import { DataStore } from '@/lib/data-store';

export async function GET() {
  const products = DataStore.getProducts();
  return NextResponse.json({ success: true, data: products });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const product = DataStore.addProduct(body);
    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to create product' }, { status: 400 });
  }
}
