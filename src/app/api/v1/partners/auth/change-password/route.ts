import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.API_URL || 'https://ovu-transport-staging.fly.dev';

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    // Next.js lowercases header names, so use lowercase 'authorization'
    const authHeader = request.headers.get('authorization') || request.headers.get('Authorization');
    
    if (!authHeader) {
      console.error('[Change Password] No authorization header found');
      console.log('[Change Password] Available headers:', Array.from(request.headers.entries()));
      return NextResponse.json(
        { detail: 'Authorization token is required' },
        { status: 401 }
      );
    }

    // Ensure token has Bearer prefix
    const token = authHeader.startsWith('Bearer ') ? authHeader : `Bearer ${authHeader}`;
    
    console.log('[Change Password] Token received:', token.substring(0, 50) + '...');
    console.log('[Change Password] Token length:', token.length);
    console.log('[Change Password] Request body keys:', Object.keys(body));
    console.log('[Change Password] Full request headers:', {
      'Content-Type': 'application/json',
      'Authorization': token.substring(0, 30) + '...',
    });

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
    console.log('[Change Password] Backend response headers:', Object.fromEntries(response.headers.entries()));
    console.log('[Change Password] Backend response:', JSON.stringify(data));
    
    // If we get "Invalid token type", log more details
    if (response.status === 401 && data.detail && data.detail.includes('token type')) {
      console.error('[Change Password] TOKEN TYPE ERROR - Full details:', {
        status: response.status,
        detail: data.detail,
        tokenPrefix: token.substring(0, 50),
        requestUrl: `${API_URL}/api/v1/partners/auth/change-password`,
      });
    }

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

