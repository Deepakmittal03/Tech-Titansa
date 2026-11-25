import { NextResponse } from 'next/server';
import { DataStore } from '@/lib/data-store';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { qr_token, staff_name } = body;

    if (!qr_token) {
      return NextResponse.json(
        { success: false, message: 'QR token parameter is required' },
        { status: 400 }
      );
    }

    const result = DataStore.verifyExitPass(qr_token, staff_name || 'Gate Officer');

    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Internal server verification error' },
      { status: 500 }
    );
  }
}
