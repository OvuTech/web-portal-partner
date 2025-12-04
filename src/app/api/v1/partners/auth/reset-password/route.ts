import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.API_URL || 'https://ovu-transport-staging.fly.dev';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.token || !body.password) {
      return NextResponse.json(
        { detail: 'Token and password are required' },
        { status: 400 }
      );
    }

    // Validate password length
    if (body.password.length < 8) {
      return NextResponse.json(
        { detail: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    const response = await fetch(`${API_URL}/api/v1/partners/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: body.token,
        new_password: body.password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { detail: error.message || 'Failed to reset password' },
      { status: 500 }
    );
  }
}

