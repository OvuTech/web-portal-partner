import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.API_URL || 'https://ovu-transport-staging.fly.dev';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { detail: 'Verification token is required' },
        { status: 400 }
      );
    }

    console.log('[Verify Email] Verifying token:', token);
    console.log('[Verify Email] API_URL:', API_URL);

    // The endpoint exists but requires GET method with token as query parameter
    // POST returns "Method Not Allowed", so we use GET
    const endpoint = `${API_URL}/api/v1/partners/auth/verify-email?token=${encodeURIComponent(token)}`;
    
    console.log('[Verify Email] Calling endpoint:', endpoint);
    
    let response;
    try {
      response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (fetchError: any) {
      console.error('[Verify Email] Fetch error:', fetchError);
      return NextResponse.json(
        { detail: `Failed to connect to verification service: ${fetchError.message}` },
        { status: 503 }
      );
    }

    console.log('[Verify Email] Response status:', response.status);
    console.log('[Verify Email] Response headers:', Object.fromEntries(response.headers.entries()));

    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      // Response is not JSON (likely HTML error page)
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

