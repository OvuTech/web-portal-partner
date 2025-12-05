import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.API_URL || 'https://ovu-transport-staging.fly.dev';

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization');
    const { searchParams } = new URL(request.url);
    
    if (!token) {
      return NextResponse.json({ detail: 'No token provided' }, { status: 401 });
    }

    const response = await fetch(`${API_URL}/api/v1/partners/transactions?${searchParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Get transactions error:', error);
    return NextResponse.json(
      { detail: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization');
    const body = await request.json();
    
    if (!token) {
      return NextResponse.json({ detail: 'No token provided' }, { status: 401 });
    }

    const response = await fetch(`${API_URL}/api/v1/partners/payouts/request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Request payout error:', error);
    return NextResponse.json(
      { detail: 'Failed to request payout' },
      { status: 500 }
    );
  }
}


