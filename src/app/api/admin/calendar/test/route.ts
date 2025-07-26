import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function POST(request: Request) {
  try {
    const { credentials, calendarId } = await request.json();

    if (!credentials || !calendarId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing credentials or calendar ID' 
      }, { status: 400 });
    }

    // Parse credentials
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

    // Create auth instance
    const auth = new google.auth.GoogleAuth({
      credentials: credentialsData,
      scopes: [
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/calendar.events'
      ],
    });

    const calendar = google.calendar({ version: 'v3', auth });

    // Create a test event
    const testEvent = {
      summary: 'Test Event - Firebase Studio',
      description: 'This is a test event created by Firebase Studio to verify calendar integration. This event will be automatically deleted.',
      start: {
        dateTime: new Date().toISOString(),
        timeZone: 'Asia/Kolkata',
      },
      end: {
        dateTime: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes later
        timeZone: 'Asia/Kolkata',
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 },
          { method: 'popup', minutes: 10 },
        ],
      },
    };

    // Create the test event
    const createResponse = await calendar.events.insert({
      calendarId: calendarId,
      requestBody: testEvent,
    });

    const eventId = createResponse.data.id;

    if (!eventId) {
      throw new Error('Failed to create test event');
    }

    // Immediately delete the test event
    await calendar.events.delete({
      calendarId: calendarId,
      eventId: eventId,
    });

    return NextResponse.json({
      success: true,
      message: 'Test event created and deleted successfully',
      eventId: eventId
    });

  } catch (error) {
    console.error('Calendar test error:', error);
    
    let errorMessage = 'Failed to test calendar connection';
    if (error instanceof Error) {
      if (error.message.includes('notFound')) {
        errorMessage = 'Calendar not found or not accessible';
      } else if (error.message.includes('forbidden')) {
        errorMessage = 'Insufficient permissions to create events in this calendar';
      } else if (error.message.includes('invalid_grant')) {
        errorMessage = 'Invalid service account credentials';
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