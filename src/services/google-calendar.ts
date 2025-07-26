
import { google } from 'googleapis';
import { getGoogleAuth, getCalendarId } from './google-auth';

const calendar = google.calendar('v3');

interface CalendarEvent {
    summary: string;
    description: string;
    startTime: string; // ISO 8601 format: 'YYYY-MM-DDTHH:MM:SSZ'
    attendees?: { email: string }[];
    duration?: number; // Duration in minutes, defaults to 30
    treatmentType?: string; // For color coding
}

interface CalendarEventResponse {
    id?: string;
    htmlLink?: string;
    status?: string;
}

// Treatment type to color mapping
const TREATMENT_COLORS: { [key: string]: string } = {
    'Dental Cleaning': '1', // Lavender
    'Root Canal': '11', // Red
    'Tooth Extraction': '4', // Flamingo
    'Dental Filling': '2', // Sage
    'Orthodontic Consultation': '3', // Grape
    'Teeth Whitening': '5', // Banana
    'Dental Implant': '6', // Tangerine
    'General Consultation': '7', // Peacock
    'Emergency': '11', // Red
    'Follow-up': '9', // Blueberry
};

export async function createCalendarEvent(eventDetails: CalendarEvent): Promise<CalendarEventResponse | null> {
    const auth = getGoogleAuth();
    const calendarId = getCalendarId();
    
    if (!auth || !calendarId) {
        console.warn('Google Calendar not configured. Skipping event creation.');
        return null;
    }

    // Calculate end time based on duration (default 30 minutes)
    const duration = eventDetails.duration || 30;
    const eventEndTime = new Date(new Date(eventDetails.startTime).getTime() + duration * 60 * 1000).toISOString();

    // Get color for treatment type
    const colorId = eventDetails.treatmentType ? TREATMENT_COLORS[eventDetails.treatmentType] || '7' : '7';

    const event = {
        summary: eventDetails.summary,
        description: eventDetails.description,
        start: {
            dateTime: eventDetails.startTime,
            timeZone: 'Asia/Kolkata',
        },
        end: {
            dateTime: eventEndTime,
            timeZone: 'Asia/Kolkata',
        },
        attendees: eventDetails.attendees || [],
        reminders: {
            useDefault: false,
            overrides: [
                { method: 'email', minutes: 24 * 60 }, // 24 hours before
                { method: 'popup', minutes: 10 }, // 10 minutes before
            ],
        },
        colorId: colorId,
        location: 'Vasavi Dental Care', // You can make this configurable
        status: 'confirmed',
    };

    try {
        const res = await calendar.events.insert({
            auth: auth,
            calendarId: calendarId,
            requestBody: event,
        });
        
        console.log('Calendar event created:', {
            id: res.data.id,
            summary: eventDetails.summary,
            startTime: eventDetails.startTime,
            link: res.data.htmlLink
        });
        
        return {
            id: res.data.id,
            htmlLink: res.data.htmlLink,
            status: res.data.status
        };
    } catch (error) {
        console.error('Error creating calendar event:', error);
        
        // Log detailed error information
        if (error instanceof Error) {
            const apiError = (error as any).response?.data?.error;
            if (apiError) {
                console.error('Google API Error Details:', {
                    code: apiError.code,
                    message: apiError.message,
                    errors: apiError.errors
                });
            }
        }
        
        // Don't throw error - let booking continue even if calendar fails
        return null;
    }
}

export async function updateCalendarEvent(eventId: string, eventDetails: Partial<CalendarEvent>): Promise<CalendarEventResponse | null> {
    const auth = getGoogleAuth();
    const calendarId = getCalendarId();
    
    if (!auth || !calendarId || !eventId) {
        console.warn('Google Calendar not configured or missing event ID. Skipping event update.');
        return null;
    }

    try {
        // First get the existing event
        const existingEvent = await calendar.events.get({
            auth: auth,
            calendarId: calendarId,
            eventId: eventId,
        });

        // Prepare update data
        const updateData: any = {};
        
        if (eventDetails.summary) {
            updateData.summary = eventDetails.summary;
        }
        
        if (eventDetails.description) {
            updateData.description = eventDetails.description;
        }
        
        if (eventDetails.startTime) {
            const duration = eventDetails.duration || 30;
            const eventEndTime = new Date(new Date(eventDetails.startTime).getTime() + duration * 60 * 1000).toISOString();
            
            updateData.start = {
                dateTime: eventDetails.startTime,
                timeZone: 'Asia/Kolkata',
            };
            updateData.end = {
                dateTime: eventEndTime,
                timeZone: 'Asia/Kolkata',
            };
        }
        
        if (eventDetails.attendees) {
            updateData.attendees = eventDetails.attendees;
        }
        
        if (eventDetails.treatmentType) {
            updateData.colorId = TREATMENT_COLORS[eventDetails.treatmentType] || '7';
        }

        const res = await calendar.events.update({
            auth: auth,
            calendarId: calendarId,
            eventId: eventId,
            requestBody: updateData,
        });
        
        console.log('Calendar event updated:', {
            id: res.data.id,
            summary: res.data.summary,
            link: res.data.htmlLink
        });
        
        return {
            id: res.data.id,
            htmlLink: res.data.htmlLink,
            status: res.data.status
        };
    } catch (error) {
        console.error('Error updating calendar event:', error);
        return null;
    }
}

export async function deleteCalendarEvent(eventId: string): Promise<boolean> {
    const auth = getGoogleAuth();
    const calendarId = getCalendarId();
    
    if (!auth || !calendarId || !eventId) {
        console.warn('Google Calendar not configured or missing event ID. Skipping event deletion.');
        return false;
    }

    try {
        await calendar.events.delete({
            auth: auth,
            calendarId: calendarId,
            eventId: eventId,
        });
        
        console.log('Calendar event deleted:', eventId);
        return true;
    } catch (error) {
        console.error('Error deleting calendar event:', error);
        return false;
    }
}
