import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.API_URL || 'https://ovu-transport-staging.fly.dev';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log('[Partner Register] Request body:', JSON.stringify(body));

    // Partner Authentication registration endpoint: /api/v1/partners/auth/register
    // Combine first_name and last_name into name
    const name = `${body.first_name || ''} ${body.last_name || ''}`.trim();
    
    // Validate required fields
    if (!name || !body.email || !body.password || !body.phone || !body.company_name || !body.business_type) {
      return NextResponse.json(
        { detail: 'Missing required fields: name, email, password, phone, company_name, and business_type are required' },
        { status: 400 }
      );
    }

    // Validate password length
    if (body.password.length < 8) {
      return NextResponse.json(
        { detail: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    const registrationData: any = {
      name,
      email: body.email,
      password: body.password,
      phone: body.phone,
      company_name: body.company_name,
      business_type: body.business_type,
    };

    // Add optional fields only if they have values
    if (body.website) registrationData.website = body.website;
    if (body.tax_id) registrationData.tax_id = body.tax_id;
    if (body.business_description) registrationData.business_description = body.business_description;
    if (body.expected_monthly_volume !== undefined && body.expected_monthly_volume !== null) {
      const volume = typeof body.expected_monthly_volume === 'number' 
        ? body.expected_monthly_volume 
        : parseInt(String(body.expected_monthly_volume));
      if (!isNaN(volume) && volume >= 0) {
        registrationData.expected_monthly_volume = volume;
      }
    }

    console.log('[Partner Register] API_URL:', API_URL);
    console.log('[Partner Register] Registration data:', JSON.stringify(registrationData));

    const response = await fetch(`${API_URL}/api/v1/partners/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registrationData),
    });

    console.log('[Partner Register] Response status:', response.status);
    console.log('[Partner Register] Response headers:', Object.fromEntries(response.headers.entries()));

    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      console.error('[Partner Register] Non-JSON response:', text);
      return NextResponse.json(
        { detail: `Server returned non-JSON response: ${text}` },
        { status: response.status || 500 }
      );
    }

    console.log('[Partner Register] Response data:', JSON.stringify(data));

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('[Partner Register] Error:', error);
    console.error('[Partner Register] Error message:', error?.message);
    console.error('[Partner Register] Error stack:', error?.stack);
    return NextResponse.json(
      { detail: error?.message || 'Failed to connect to registration service', error: String(error) },
      { status: 500 }
    );
  }
}
