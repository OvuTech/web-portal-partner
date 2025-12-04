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

    // Call the backend API to verify the email token
    const response = await fetch(`${API_URL}/api/v1/partners/auth/verify-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    const data = await response.json();

    console.log('[Verify Email] Response status:', response.status);
    console.log('[Verify Email] Response:', JSON.stringify(data));

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

