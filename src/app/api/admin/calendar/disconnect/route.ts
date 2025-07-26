import { NextResponse } from 'next/server';
import { unlinkSync, existsSync } from 'fs';
import { join } from 'path';

export async function POST(request: Request) {
  try {
    const configDir = join(process.cwd(), 'config');
    const credentialsPath = join(configDir, 'google-service-account.json');
    const configPath = join(configDir, 'calendar-config.json');

    // Remove credentials file
    if (existsSync(credentialsPath)) {
      unlinkSync(credentialsPath);
    }

    // Remove config file
    if (existsSync(configPath)) {
      unlinkSync(configPath);
    }

    return NextResponse.json({
      success: true,
      message: 'Calendar integration disconnected successfully'
    });

  } catch (error) {
    console.error('Calendar disconnect error:', error);
    
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to disconnect calendar'
    }, { status: 500 });
  }
}