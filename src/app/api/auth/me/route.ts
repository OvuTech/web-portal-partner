import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.API_URL || 'https://ovu-transport-staging.fly.dev';

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization');
    
    if (!token) {
      return NextResponse.json({ detail: 'No token provided' }, { status: 401 });
    }

    console.log('[Partner Me] Fetching partner profile');

    // Use partner-specific endpoint to get current partner info
    const response = await fetch(`${API_URL}/api/v1/partners/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
    });

    const data = await response.json();

    console.log('[Partner Me] Response status:', response.status);

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('[Partner Me] Error:', error);
    return NextResponse.json(
      { detail: 'Failed to get partner data' },
      { status: 500 }
    );
  }
}
