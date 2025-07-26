import { NextResponse } from 'next/server';
import { updateCalendarEvent, deleteCalendarEvent } from '@/services/google-calendar';
import connectToDatabase from '@/lib/mongodb';
import Appointment from '@/models/appointment';

// Update appointment
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const updateData = await request.json();

    console.log('Updating appointment:', id, updateData);

    // Connect to database
    await connectToDatabase();

    // Get existing appointment
    const existingAppointment = await Appointment.findById(id);
    if (!existingAppointment) {
      return NextResponse.json({ 
        message: 'Appointment not found' 
      }, { status: 404 });
    }

    // Update appointment in database
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    // Update calendar event if it exists
    if (existingAppointment.calendarEventId) {
      try {
        const eventStartTime = updateData.date && updateData.time 
          ? new Date(`${updateData.date}T${updateData.time}`).toISOString()
          : undefined;

        const calendarUpdateData: any = {};
        
        if (updateData.name || updateData.treatment) {
          calendarUpdateData.summary = `${updateData.treatment || existingAppointment.treatment} - ${updateData.name || existingAppointment.name}`;
        }

        if (updateData.name || updateData.phone || updateData.email || updateData.treatment || updateData.notes) {
          const description = [
            `Patient: ${updateData.name || existingAppointment.name}`,
            `Phone: ${updateData.phone || existingAppointment.phone}`,
            updateData.email || existingAppointment.email ? `Email: ${updateData.email || existingAppointment.email}` : '',
            `Treatment: ${updateData.treatment || existingAppointment.treatment}`,
            updateData.notes || existingAppointment.notes ? `Notes: ${updateData.notes || existingAppointment.notes}` : '',
            '',
            'Updated by Firebase Studio Booking System'
          ].filter(Boolean).join('\n');
          
          calendarUpdateData.description = description;
        }

        if (eventStartTime) {
          calendarUpdateData.startTime = eventStartTime;
        }

        if (updateData.treatment) {
          calendarUpdateData.treatmentType = updateData.treatment;
        }

        if (updateData.email !== undefined) {
          calendarUpdateData.attendees = updateData.email ? [{ email: updateData.email }] : [];
        }

        await updateCalendarEvent(existingAppointment.calendarEventId, calendarUpdateData);
        console.log('Calendar event updated successfully');
      } catch (calendarError) {
        console.error('Failed to update calendar event:', calendarError);
        // Don't fail the appointment update if calendar update fails
      }
    }

    return NextResponse.json({
      message: 'Appointment updated successfully',
      appointment: updatedAppointment,
      success: true
    });

  } catch (error) {
    console.error('Error updating appointment:', error);
    return NextResponse.json({ 
      message: 'Failed to update appointment',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Cancel/Delete appointment
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { reason } = await request.json().catch(() => ({}));

    console.log('Canceling appointment:', id, reason);

    // Connect to database
    await connectToDatabase();

    // Get existing appointment
    const existingAppointment = await Appointment.findById(id);
    if (!existingAppointment) {
      return NextResponse.json({ 
        message: 'Appointment not found' 
      }, { status: 404 });
    }

    // Update appointment status to cancelled instead of deleting
    const cancelledAppointment = await Appointment.findByIdAndUpdate(
      id,
      { 
        status: 'Cancelled',
        cancelledAt: new Date(),
        cancellationReason: reason || 'No reason provided'
      },
      { new: true }
    );

    // Delete calendar event if it exists
    if (existingAppointment.calendarEventId) {
      try {
        const deleted = await deleteCalendarEvent(existingAppointment.calendarEventId);
        if (deleted) {
          console.log('Calendar event deleted successfully');
        } else {
          console.warn('Failed to delete calendar event, but appointment cancelled');
        }
      } catch (calendarError) {
        console.error('Failed to delete calendar event:', calendarError);
        // Don't fail the appointment cancellation if calendar deletion fails
      }
    }

    return NextResponse.json({
      message: 'Appointment cancelled successfully',
      appointment: cancelledAppointment,
      success: true
    });

  } catch (error) {
    console.error('Error cancelling appointment:', error);
    return NextResponse.json({ 
      message: 'Failed to cancel appointment',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Get appointment details
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    await connectToDatabase();

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return NextResponse.json({ 
        message: 'Appointment not found' 
      }, { status: 404 });
    }

    return NextResponse.json({
      appointment,
      success: true
    });

  } catch (error) {
    console.error('Error fetching appointment:', error);
    return NextResponse.json({ 
      message: 'Failed to fetch appointment',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}