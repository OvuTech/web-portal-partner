import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.API_URL || 'https://ovu-transport-staging.fly.dev';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Partner login endpoint - use partner-specific endpoint
    console.log('[Partner Login] Request body:', JSON.stringify(body));

    // Use partner-specific login endpoint
    const response = await fetch(`${API_URL}/api/v1/partners/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    console.log('[Partner Login] Response status:', response.status);
    console.log('[Partner Login] Response:', JSON.stringify(data));

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('[Partner Login] Error:', error);
    return NextResponse.json(
      { detail: 'Failed to connect to authentication service' },
      { status: 500 }
    );
  }
}
