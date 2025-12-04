import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.API_URL || 'https://ovu-transport-staging.fly.dev';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { detail: 'Verification token is required' },
        { status: 400 }
      );
    }

    console.log('[Verify Email] Verifying token:', token);
    console.log('[Verify Email] API_URL:', API_URL);

    const endpoint = `${API_URL}/api/v1/partners/auth/verify-email?token=${encodeURIComponent(token)}`;
    
    console.log('[Verify Email] Calling endpoint:', endpoint);
    
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('[Verify Email] Response status:', response.status);

    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      console.error('[Verify Email] Non-JSON response:', text.substring(0, 200));
      return NextResponse.json(
        { detail: 'Backend endpoint returned an error. Please check if the verify-email endpoint exists.' },
        { status: response.status || 500 }
      );
    }

    console.log('[Verify Email] Response data:', JSON.stringify(data));

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('[Verify Email] Error:', error);
    return NextResponse.json(
      { detail: error?.message || 'Failed to verify email', error: String(error) },
      { status: 500 }
    );
  }
}
