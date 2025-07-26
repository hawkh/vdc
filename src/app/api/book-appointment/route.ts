
import { NextResponse } from 'next/server';
import { appendToSheet } from '@/services/google-sheets';
import { createCalendarEvent } from '@/services/google-calendar';
import connectToDatabase from '@/lib/mongodb';
import Appointment from '@/models/appointment';

// Treatment duration mapping (in minutes)
const TREATMENT_DURATIONS: { [key: string]: number } = {
  'Dental Cleaning': 60,
  'Root Canal': 90,
  'Tooth Extraction': 45,
  'Dental Filling': 30,
  'Orthodontic Consultation': 45,
  'Teeth Whitening': 60,
  'Dental Implant': 120,
  'General Consultation': 30,
  'Emergency': 30,
  'Follow-up': 20,
};

function getTreatmentDuration(treatment: string): number {
  return TREATMENT_DURATIONS[treatment] || 30; // Default 30 minutes
}


export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const fullName = formData.get('fullName') as string;
    const phone = formData.get('phone') as string;
    const email = (formData.get('email') as string) || '';
    const treatment = formData.get('treatment') as string;
    const date = formData.get('date') as string; // Expects "YYYY-MM-DD"
    const time = formData.get('time') as string; // Expects "HH:MM:SS"
    const notes = (formData.get('notes') as string) || '';

    console.log("Received booking request:", { fullName, phone, email, treatment, date, time, notes });
    
    // Basic validation
    if (!fullName || !phone || !treatment || !date || !time) {
        console.error("Validation Error: Missing required fields", { fullName, phone, treatment, date, time });
        return NextResponse.json({ message: 'Missing required fields.' }, { status: 400 });
    }

    // Process image uploads if any
    const imageUrls: string[] = [];
    const images = formData.getAll('images') as File[];
    
    if (images && images.length > 0) {
      for (const image of images) {
        if (image.size > 0) {
          console.log(`Processing image: ${image.name}, size: ${image.size}`);
          // In a real implementation: imageUrls.push(await uploadImage(image));
          imageUrls.push(`https://example.com/uploads/${image.name}`);
        }
      }
    }

    // Connect to MongoDB and save appointment
    let appointmentId;
    try {
      await connectToDatabase();
      
      const appointment = new Appointment({
        name: fullName,
        phone,
        email,
        treatment,
        date,
        time,
        notes,
        status: 'Pending',
        paymentStatus: 'Pending',
        imageUrls,
      });

      const savedAppointment = await appointment.save();
      appointmentId = savedAppointment._id.toString();
      console.log('Appointment saved to MongoDB:', appointmentId);
    } catch (dbError) {
      console.error('Error saving to MongoDB:', dbError);
      // Continue with Google Sheets as fallback
    }

    // 1. Append to Google Sheets (for backward compatibility)
    const rowData = [
      new Date().toISOString(), // Timestamp
      fullName,
      phone,
      email,
      treatment,
      date,
      time,
      notes,
      'Pending', // Initial Status
      '', // Payment Proof URL (placeholder)
      ...imageUrls,
    ];
    
    try {
        await appendToSheet(rowData);
    } catch (sheetError) {
        // This will now only be a critical failure if MongoDB also failed
        console.error('Could not save to sheet. Please check server configuration.', sheetError);
        if (!appointmentId) {
          return NextResponse.json({ message: `Database update failed.` }, { status: 500 });
        }
    }


    // 2. Create Google Calendar event with enhanced details
    let calendarEventId = null;
    try {
        const eventStartTime = new Date(`${date}T${time}`).toISOString();
        
        // Create detailed description with patient information
        const description = [
            `Patient: ${fullName}`,
            `Phone: ${phone}`,
            email ? `Email: ${email}` : '',
            `Treatment: ${treatment}`,
            notes ? `Notes: ${notes}` : '',
            imageUrls.length > 0 ? `Images: ${imageUrls.length} uploaded` : '',
            '',
            'Created by Firebase Studio Booking System'
        ].filter(Boolean).join('\n');

        const calendarEvent = await createCalendarEvent({
            summary: `${treatment} - ${fullName}`,
            description: description,
            startTime: eventStartTime,
            attendees: email ? [{ email }] : [],
            treatmentType: treatment,
            duration: getTreatmentDuration(treatment), // Helper function for duration
        });

        if (calendarEvent?.id) {
            calendarEventId = calendarEvent.id;
            console.log('Calendar event created successfully:', calendarEventId);
            
            // Update appointment with calendar event ID if we have MongoDB
            if (appointmentId) {
                try {
                    await Appointment.findByIdAndUpdate(appointmentId, {
                        calendarEventId: calendarEventId
                    });
                } catch (updateError) {
                    console.error('Failed to update appointment with calendar event ID:', updateError);
                }
            }
        }
    } catch (calendarError) {
        // Log the error, but don't fail the whole booking if calendar fails
        console.error('Could not create calendar event, but proceeding as booking is saved:', calendarError);
    }

    return NextResponse.json({ 
      message: 'Appointment booked successfully!', 
      appointmentId: appointmentId || null,
      calendarEventId: calendarEventId,
      success: true 
    }, { status: 200 });

  } catch (error) {
    console.error('Booking process failed:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message: `Failed to book appointment. Error: ${errorMessage}` }, { status: 500 });
  }
}
