import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.API_URL || 'https://ovu-transport-staging.fly.dev';

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization');
    const body = await request.json();
    
    if (!token) {
      return NextResponse.json({ detail: 'No token provided' }, { status: 401 });
    }

    console.log('[Register Operator] Registering partner as operator');

    const response = await fetch(`${API_URL}/api/v1/operators/register-operator`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    console.log('[Register Operator] Response status:', response.status);
    console.log('[Register Operator] Response data:', JSON.stringify(data).substring(0, 200));

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('[Register Operator] Error:', error);
    return NextResponse.json(
      { detail: 'Failed to register as operator' },
      { status: 500 }
    );
  }
}


