import { NextResponse } from 'next/server';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

export async function POST(request: Request) {
  try {
    const { credentials, calendarId } = await request.json();

    if (!credentials || !calendarId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing credentials or calendar ID' 
      }, { status: 400 });
    }

    // Parse credentials to validate
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

    // Create config directory if it doesn't exist
    const configDir = join(process.cwd(), 'config');
    if (!existsSync(configDir)) {
      mkdirSync(configDir, { recursive: true });
    }

    // Save credentials to file (in production, you'd want to encrypt this)
    const credentialsPath = join(configDir, 'google-service-account.json');
    writeFileSync(credentialsPath, JSON.stringify(credentialsData, null, 2));

    // Save calendar configuration
    const calendarConfig = {
      calendarId,
      credentialsPath,
      isEnabled: true,
      configuredAt: new Date().toISOString(),
      serviceAccountEmail: credentialsData.client_email
    };

    const configPath = join(configDir, 'calendar-config.json');
    writeFileSync(configPath, JSON.stringify(calendarConfig, null, 2));

    // Update environment variables (this would typically be done differently in production)
    // For now, we'll just save the config and the app will need to be restarted to pick up changes
    
    return NextResponse.json({
      success: true,
      message: 'Calendar configuration saved successfully',
      config: {
        calendarId,
        serviceAccountEmail: credentialsData.client_email,
        isEnabled: true
      }
    });

  } catch (error) {
    console.error('Calendar configuration error:', error);
    
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to save configuration'
    }, { status: 500 });
  }
}