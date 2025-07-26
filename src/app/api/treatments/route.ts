import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectToDatabase from '@/lib/mongodb';
import Treatment from '@/models/Treatment';
import { ITreatment } from '@/models/Treatment';

export async function GET() {
  try {
    await connectToDatabase();
    const treatments = await Treatment.find({ isActive: true }).sort({ name: 1 });
    return NextResponse.json(treatments);
  } catch (error) {
    console.error('Error fetching treatments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch treatments' },
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
    
    // Add createdBy and updatedBy from session
    const treatmentData = {
      ...data,
      createdBy: session.user.id,
      updatedBy: session.user.id
    };

    const treatment = new Treatment(treatmentData);
    await treatment.save();
    
    return NextResponse.json(treatment, { status: 201 });
  } catch (error) {
    console.error('Error creating treatment:', error);
    return NextResponse.json(
      { error: 'Failed to create treatment' },
      { status: 500 }
    );
  }
}

// Add PATCH and DELETE methods as needed
