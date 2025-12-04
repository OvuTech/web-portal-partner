import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.API_URL || 'https://ovu-transport-staging.fly.dev';

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization');
    const { searchParams } = new URL(request.url);
    
    if (!token) {
      return NextResponse.json({ detail: 'No token provided' }, { status: 401 });
    }

    console.log('[Partner Schedules] Fetching schedules');

    // Based on Swagger docs - schedules endpoint
    const response = await fetch(`${API_URL}/api/v1/schedules?${searchParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
    });

    const data = await response.json();

    console.log('[Partner Schedules] Response status:', response.status);

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('[Partner Schedules] Error:', error);
    return NextResponse.json(
      { detail: 'Failed to fetch schedules' },
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

    const response = await fetch(`${API_URL}/api/v1/schedules`, {
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
    console.error('[Partner Schedules] Create error:', error);
    return NextResponse.json(
      { detail: 'Failed to create schedule' },
      { status: 500 }
    );
  }
}
