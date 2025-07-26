
import { google } from 'googleapis';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

let auth: any;

interface CalendarConfig {
  calendarId: string;
  credentialsPath: string;
  isEnabled: boolean;
  configuredAt: string;
  serviceAccountEmail: string;
}

export function getGoogleAuth() {
  if (auth) {
    return auth;
  }

  // First try to load from config files (new system)
  const configPath = join(process.cwd(), 'config', 'calendar-config.json');
  if (existsSync(configPath)) {
    try {
      const config: CalendarConfig = JSON.parse(readFileSync(configPath, 'utf8'));
      if (config.isEnabled && existsSync(config.credentialsPath)) {
        const credentials = JSON.parse(readFileSync(config.credentialsPath, 'utf8'));
        
        auth = new google.auth.GoogleAuth({
          credentials,
          scopes: [
            'https://www.googleapis.com/auth/spreadsheets',
            'https://www.googleapis.com/auth/calendar',
            'https://www.googleapis.com/auth/calendar.events',
          ],
        });
        
        return auth;
      }
    } catch (error) {
      console.error('Error loading calendar config:', error);
    }
  }

  // Fallback to environment variables (legacy system)
  if (!process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS || !process.env.GOOGLE_SHEET_ID || !process.env.GOOGLE_CALENDAR_ID) {
    console.warn(
      'Google service account credentials, Sheet ID, or Calendar ID are not configured. Please use the admin calendar setup wizard.'
    );
    return null;
  }
  
  try {
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS);
    
    auth = new google.auth.GoogleAuth({
      credentials,
      scopes: [
          'https://www.googleapis.com/auth/spreadsheets',
          'https://www.googleapis.com/auth/calendar',
          'https://www.googleapis.com/auth/calendar.events',
      ],
    });
    
    return auth;
  } catch (e) {
      console.error("Error parsing GOOGLE_SERVICE_ACCOUNT_CREDENTIALS. Make sure it's a valid JSON string.", e);
      return null;
  }
}

export function getCalendarConfig(): CalendarConfig | null {
  const configPath = join(process.cwd(), 'config', 'calendar-config.json');
  if (existsSync(configPath)) {
    try {
      return JSON.parse(readFileSync(configPath, 'utf8'));
    } catch (error) {
      console.error('Error loading calendar config:', error);
    }
  }
  return null;
}

export function getCalendarId(): string | null {
  // First try to get from config file
  const config = getCalendarConfig();
  if (config && config.isEnabled) {
    return config.calendarId;
  }
  
  // Fallback to environment variable
  return process.env.GOOGLE_CALENDAR_ID || null;
}
