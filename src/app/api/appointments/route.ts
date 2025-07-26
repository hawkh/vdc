import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectToDatabase from '@/lib/mongodb';
import Appointment, { IAppointment, AppointmentStatus } from '@/models/appointment';
import User from '@/models/User';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const status = searchParams.get('status');
    const patientId = searchParams.get('patientId');
    const dentistId = searchParams.get('dentistId');

    await connectToDatabase();

    const query: any = {};
    
    if (startDate && endDate) {
      query.startTime = {
        $gte: new Date(startDate),
        $lt: new Date(endDate)
      };
    }

    if (status) {
      query.status = status;
    }

    if (patientId) {
      query.patient = patientId;
    }

    if (dentistId) {
      query.dentist = dentistId;
    }

    const appointments = await Appointment.find(query)
      .populate('patient', 'name email phone')
      .populate('dentist', 'name')
      .populate('treatment', 'name duration')
      .sort({ startTime: 1 });

    return NextResponse.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch appointments' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await request.json();
    await connectToDatabase();

    // Check for time slot availability
    const existingAppointment = await Appointment.findOne({
      dentist: data.dentist,
      startTime: { $lt: new Date(data.endTime) },
      endTime: { $gt: new Date(data.startTime) },
      status: { $nin: ['cancelled', 'no_show'] }
    });

    if (existingAppointment) {
      return NextResponse.json(
        { error: 'The selected time slot is already booked' },
        { status: 400 }
      );
    }

    // Create new appointment
    const appointmentData: Partial<IAppointment> = {
      ...data,
      status: 'scheduled' as AppointmentStatus,
      createdBy: session.user.id,
      updatedBy: session.user.id,
      payment: {
        status: 'pending',
        amount: data.amount || 0,
        paidAmount: 0
      }
    };

    const appointment = new Appointment(appointmentData);
    await appointment.save();

    // Populate the response with related data
    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('patient', 'name email phone')
      .populate('dentist', 'name')
      .populate('treatment', 'name duration');

    return NextResponse.json(populatedAppointment, { status: 201 });
  } catch (error) {
    console.error('Error creating appointment:', error);
    return NextResponse.json(
      { error: 'Failed to create appointment' },
      { status: 500 }
    );
  }
}

// Add PATCH and DELETE methods as needed
