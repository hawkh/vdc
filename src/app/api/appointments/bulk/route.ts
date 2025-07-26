import { NextResponse } from 'next/server';
import { updateCalendarEvent, deleteCalendarEvent } from '@/services/google-calendar';
import connectToDatabase from '@/lib/mongodb';
import Appointment from '@/models/appointment';

interface BulkOperation {
  id: string;
  action: 'update' | 'cancel';
  data?: any;
  reason?: string;
}

export async function POST(request: Request) {
  try {
    const { operations }: { operations: BulkOperation[] } = await request.json();

    if (!operations || !Array.isArray(operations)) {
      return NextResponse.json({ 
        message: 'Invalid operations array' 
      }, { status: 400 });
    }

    console.log('Processing bulk operations:', operations.length);

    await connectToDatabase();

    const results = [];
    const errors = [];

    for (const operation of operations) {
      try {
        const { id, action, data, reason } = operation;

        // Get existing appointment
        const existingAppointment = await Appointment.findById(id);
        if (!existingAppointment) {
          errors.push({ id, error: 'Appointment not found' });
          continue;
        }

        if (action === 'update') {
          // Update appointment
          const updatedAppointment = await Appointment.findByIdAndUpdate(
            id,
            data,
            { new: true }
          );

          // Update calendar event
          if (existingAppointment.calendarEventId) {
            try {
              const eventStartTime = data.date && data.time 
                ? new Date(`${data.date}T${data.time}`).toISOString()
                : undefined;

              const calendarUpdateData: any = {};
              
              if (data.name || data.treatment) {
                calendarUpdateData.summary = `${data.treatment || existingAppointment.treatment} - ${data.name || existingAppointment.name}`;
              }

              if (eventStartTime) {
                calendarUpdateData.startTime = eventStartTime;
              }

              if (data.treatment) {
                calendarUpdateData.treatmentType = data.treatment;
              }

              await updateCalendarEvent(existingAppointment.calendarEventId, calendarUpdateData);
            } catch (calendarError) {
              console.error(`Failed to update calendar event for appointment ${id}:`, calendarError);
            }
          }

          results.push({ id, action: 'updated', appointment: updatedAppointment });

        } else if (action === 'cancel') {
          // Cancel appointment
          const cancelledAppointment = await Appointment.findByIdAndUpdate(
            id,
            { 
              status: 'Cancelled',
              cancelledAt: new Date(),
              cancellationReason: reason || 'Bulk cancellation'
            },
            { new: true }
          );

          // Delete calendar event
          if (existingAppointment.calendarEventId) {
            try {
              await deleteCalendarEvent(existingAppointment.calendarEventId);
            } catch (calendarError) {
              console.error(`Failed to delete calendar event for appointment ${id}:`, calendarError);
            }
          }

          results.push({ id, action: 'cancelled', appointment: cancelledAppointment });
        }

      } catch (operationError) {
        console.error(`Error processing operation for appointment ${operation.id}:`, operationError);
        errors.push({ 
          id: operation.id, 
          error: operationError instanceof Error ? operationError.message : 'Unknown error' 
        });
      }
    }

    return NextResponse.json({
      message: `Processed ${results.length} operations successfully`,
      results,
      errors,
      success: true
    });

  } catch (error) {
    console.error('Error processing bulk operations:', error);
    return NextResponse.json({ 
      message: 'Failed to process bulk operations',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}