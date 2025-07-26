import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function POST(request: Request) {
  try {
    const { credentials } = await request.json();

    if (!credentials) {
      return NextResponse.json({ 
        success: false, 
        error: 'No credentials provided' 
      }, { status: 400 });
    }

    // Parse and validate credentials
    let credentialsData;
    try {
      credentialsData = typeof credentials === 'string' 
        ? JSON.parse(credentials) 
        : credentials;
    } catch (error) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid JSON credentials' 
      }, { status: 400 });
    }

    // Validate required fields
    if (!credentialsData.client_email || !credentialsData.private_key) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required fields in credentials (client_email, private_key)' 
      }, { status: 400 });
    }

    // Create auth instance
    const auth = new google.auth.GoogleAuth({
      credentials: credentialsData,
      scopes: [
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/calendar.events'
      ],
    });

    const calendar = google.calendar({ version: 'v3', auth });

    // Test authentication by listing calendars
    const response = await calendar.calendarList.list();
    
    const calendars = response.data.items?.map(cal => ({
      id: cal.id,
      summary: cal.summary,
      description: cal.description,
      accessRole: cal.accessRole,
      primary: cal.primary
    })) || [];

    // Filter to only show calendars where we can create events
    const writableCalendars = calendars.filter(cal => 
      cal.accessRole === 'owner' || cal.accessRole === 'writer'
    );

    return NextResponse.json({
      success: true,
      calendars: writableCalendars,
      serviceAccountEmail: credentialsData.client_email
    });

  } catch (error) {
    console.error('Calendar validation error:', error);
    
    let errorMessage = 'Failed to validate credentials';
    if (error instanceof Error) {
      if (error.message.includes('invalid_grant')) {
        errorMessage = 'Invalid service account credentials or expired key';
      } else if (error.message.includes('access_denied')) {
        errorMessage = 'Calendar API access denied. Please enable the Calendar API in Google Cloud Console';
      } else if (error.message.includes('insufficient_scope')) {
        errorMessage = 'Insufficient permissions. Please ensure Calendar API is enabled';
      } else {
        errorMessage = error.message;
      }
    }

    return NextResponse.json({ 
      success: false, 
      error: errorMessage 
    }, { status: 500 });
  }
}