import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.API_URL || 'https://ovu-transport-staging.fly.dev';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.refresh_token) {
      return NextResponse.json(
        { detail: 'Refresh token is required' },
        { status: 400 }
      );
    }

    const response = await fetch(`${API_URL}/api/v1/partners/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refresh_token: body.refresh_token,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Refresh token error:', error);
    return NextResponse.json(
      { detail: error.message || 'Failed to refresh token' },
      { status: 500 }
    );
  }
}

