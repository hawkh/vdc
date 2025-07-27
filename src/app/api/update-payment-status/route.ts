import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Appointment from '@/models/appointment';

export async function POST(req: NextRequest) {
  try {
    const { appointmentId, paymentIntentId } = await req.json();

    if (!appointmentId || !paymentIntentId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if Stripe is configured
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Payment processing is not configured' },
        { status: 500 }
      );
    }

    // Dynamic import and initialize Stripe only when needed
    const { getStripe } = await import('@/lib/stripe');
    const stripe = await getStripe();
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return NextResponse.json(
        { error: 'Payment not successful' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await connectToDatabase();

    // Update appointment in MongoDB
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      {
        paymentStatus: 'Completed',
        status: 'Confirmed',
      },
      { new: true }
    );

    if (!updatedAppointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      appointment: updatedAppointment,
    });
  } catch (error) {
    console.error('Error updating payment status:', error);
    return NextResponse.json(
      { error: 'Failed to update payment status' },
      { status: 500 }
    );
  }
}