import { calendarErrorHandler } from './calendar-error-handler';

interface AppointmentEvent {
  id: string;
  patientName: string;
  treatment: string;
  date: string;
  time: string;
  duration: number;
  phone: string;
  email?: string;
}

class CalendarSyncService {
  private isConnected = false;
  private calendarId = 'primary';

  /**
   * Initialize calendar connection
   */
  async initialize(): Promise<boolean> {
    try {
      // Simulate calendar initialization
      this.isConnected = true;
      return true;
    } catch (error) {
      calendarErrorHandler.logError({
        operation: 'create',
        error,
        timestamp: new Date()
      });
      return false;
    }
  }

  /**
   * Create calendar event for appointment
   */
  async createAppointmentEvent(appointment: AppointmentEvent): Promise<string | null> {
    if (!this.isConnected) {
      await this.initialize();
    }

    try {
      const eventId = `event_${appointment.id}_${Date.now()}`;
      
      // Simulate Google Calendar API call
      const event = {
        id: eventId,
        summary: `${appointment.treatment} - ${appointment.patientName}`,
        description: `Patient: ${appointment.patientName}\nTreatment: ${appointment.treatment}\nPhone: ${appointment.phone}`,
        start: {
          dateTime: this.combineDateTime(appointment.date, appointment.time),
          timeZone: 'Asia/Kolkata'
        },
        end: {
          dateTime: this.addMinutes(this.combineDateTime(appointment.date, appointment.time), appointment.duration),
          timeZone: 'Asia/Kolkata'
        },
        attendees: appointment.email ? [{ email: appointment.email }] : [],
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 }, // 1 day before
            { method: 'popup', minutes: 30 }       // 30 minutes before
          ]
        }
      };

      console.log('Calendar event created:', event);
      return eventId;
    } catch (error) {
      calendarErrorHandler.logError({
        appointmentId: appointment.id,
        operation: 'create',
        error,
        timestamp: new Date()
      });

      if (calendarErrorHandler.isRetryableError(error)) {
        calendarErrorHandler.addToRetryQueue(`create_${appointment.id}`, {
          appointmentId: appointment.id,
          operation: 'create',
          error,
          timestamp: new Date()
        });
      }

      return null;
    }
  }

  /**
   * Update existing calendar event
   */
  async updateAppointmentEvent(appointment: AppointmentEvent, eventId: string): Promise<boolean> {
    try {
      const updatedEvent = {
        id: eventId,
        summary: `${appointment.treatment} - ${appointment.patientName}`,
        description: `Patient: ${appointment.patientName}\nTreatment: ${appointment.treatment}\nPhone: ${appointment.phone}`,
        start: {
          dateTime: this.combineDateTime(appointment.date, appointment.time),
          timeZone: 'Asia/Kolkata'
        },
        end: {
          dateTime: this.addMinutes(this.combineDateTime(appointment.date, appointment.time), appointment.duration),
          timeZone: 'Asia/Kolkata'
        }
      };

      console.log('Calendar event updated:', updatedEvent);
      return true;
    } catch (error) {
      calendarErrorHandler.logError({
        appointmentId: appointment.id,
        operation: 'update',
        error,
        timestamp: new Date()
      });

      if (calendarErrorHandler.isRetryableError(error)) {
        calendarErrorHandler.addToRetryQueue(`update_${appointment.id}`, {
          appointmentId: appointment.id,
          operation: 'update',
          error,
          timestamp: new Date()
        });
      }

      return false;
    }
  }

  /**
   * Delete calendar event
   */
  async deleteAppointmentEvent(appointmentId: string, eventId: string): Promise<boolean> {
    try {
      console.log(`Calendar event deleted: ${eventId}`);
      return true;
    } catch (error) {
      calendarErrorHandler.logError({
        appointmentId,
        operation: 'delete',
        error,
        timestamp: new Date()
      });

      if (calendarErrorHandler.isRetryableError(error)) {
        calendarErrorHandler.addToRetryQueue(`delete_${appointmentId}`, {
          appointmentId,
          operation: 'delete',
          error,
          timestamp: new Date()
        });
      }

      return false;
    }
  }

  /**
   * Sync appointment with calendar
   */
  async syncAppointment(appointment: AppointmentEvent, existingEventId?: string): Promise<string | null> {
    if (existingEventId) {
      const updated = await this.updateAppointmentEvent(appointment, existingEventId);
      return updated ? existingEventId : null;
    } else {
      return await this.createAppointmentEvent(appointment);
    }
  }

  /**
   * Get sync status and statistics
   */
  getSyncStatus() {
    const stats = calendarErrorHandler.getErrorStats();
    return {
      isConnected: this.isConnected,
      calendarId: this.calendarId,
      lastSync: new Date().toISOString(),
      ...stats
    };
  }

  /**
   * Process retry queue
   */
  async processRetries(): Promise<void> {
    await calendarErrorHandler.processRetryQueue(async (error) => {
      try {
        if (error.operation === 'create' && error.appointmentId) {
          // Simulate retry logic - in real implementation, you'd recreate the appointment
          const eventId = await this.createAppointmentEvent({
            id: error.appointmentId,
            patientName: 'Retry Patient',
            treatment: 'Retry Treatment',
            date: new Date().toISOString().split('T')[0],
            time: '10:00 AM',
            duration: 30,
            phone: '9876543210'
          });
          return !!eventId;
        }
        return true;
      } catch (retryError) {
        return false;
      }
    });
  }

  /**
   * Helper: Combine date and time strings
   */
  private combineDateTime(date: string, time: string): string {
    const [timePart, period] = time.split(' ');
    const [hours, minutes] = timePart.split(':').map(Number);
    
    let hour24 = hours;
    if (period === 'PM' && hours !== 12) hour24 += 12;
    if (period === 'AM' && hours === 12) hour24 = 0;
    
    return `${date}T${hour24.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
  }

  /**
   * Helper: Add minutes to datetime string
   */
  private addMinutes(datetime: string, minutes: number): string {
    const date = new Date(datetime);
    date.setMinutes(date.getMinutes() + minutes);
    return date.toISOString().slice(0, 19);
  }
}

export const calendarSync = new CalendarSyncService();