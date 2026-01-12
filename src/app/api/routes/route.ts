import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.API_URL || 'https://ovu-transport-staging.fly.dev';

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization');
    const { searchParams } = new URL(request.url);
    
    if (!token) {
      return NextResponse.json({ detail: 'No token provided' }, { status: 401 });
    }

    console.log('[Partner Routes] Fetching routes');
    console.log('[Partner Routes] Token (first 30 chars):', token.substring(0, 30) + '...');

    const response = await fetch(`${API_URL}/api/v1/operators/routes?${searchParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
    });

    const data = await response.json();

    console.log('[Partner Routes] Response status:', response.status);
    console.log('[Partner Routes] Response data:', JSON.stringify(data).substring(0, 200));

    if (!response.ok) {
      // If it's a "User not found" error, provide more helpful message
      if (data.detail?.includes('User not found') || data.detail?.includes('not found')) {
        return NextResponse.json(
          { 
            detail: 'User not found. You may need to register as an operator first. Please contact support or use the operator registration endpoint.',
            original_error: data.detail 
          },
          { status: response.status }
        );
      }
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('[Partner Routes] Error:', error);
    return NextResponse.json(
      { detail: 'Failed to fetch routes' },
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

    console.log('[Partner Routes] Creating route');

    const response = await fetch(`${API_URL}/api/v1/operators/routes`, {
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

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('[Partner Routes] Create error:', error);
    return NextResponse.json(
      { detail: 'Failed to create route' },
      { status: 500 }
    );
  }
}

