import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.API_URL || 'https://ovu-transport-staging.fly.dev';

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const token = request.headers.get('authorization');
    
    if (!token) {
      return NextResponse.json(
        { detail: 'Authorization token is required' },
        { status: 401 }
      );
    }

    console.log('[Change Password] Token received:', token.substring(0, 20) + '...');
    console.log('[Change Password] Request body:', { current_password: '***', new_password: '***' });

    // Validate required fields
    if (!body.current_password || !body.new_password) {
      return NextResponse.json(
        { detail: 'Current password and new password are required' },
        { status: 400 }
      );
    }

    // Validate password length
    if (body.new_password.length < 8) {
      return NextResponse.json(
        { detail: 'New password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Check for special character
    const specialCharRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    if (!specialCharRegex.test(body.new_password)) {
      return NextResponse.json(
        { detail: 'New password must contain at least one special character' },
        { status: 400 }
      );
    }

    console.log('[Change Password] Calling backend:', `${API_URL}/api/v1/partners/auth/change-password`);
    
    const response = await fetch(`${API_URL}/api/v1/partners/auth/change-password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
      body: JSON.stringify({
        current_password: body.current_password,
        new_password: body.new_password,
      }),
    });

    const data = await response.json();
    
    console.log('[Change Password] Backend response status:', response.status);
    console.log('[Change Password] Backend response:', JSON.stringify(data).substring(0, 200));

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Change password error:', error);
    return NextResponse.json(
      { detail: error.message || 'Failed to change password' },
      { status: 500 }
    );
  }
}

