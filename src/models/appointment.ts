import mongoose, { Schema, Document, Types } from 'mongoose';

export type AppointmentStatus = 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
export type PaymentStatus = 'pending' | 'partial' | 'paid' | 'refunded' | 'failed';

export interface IAppointment extends Document {
  patient: Types.ObjectId;
  dentist: Types.ObjectId;
  treatment: Types.ObjectId;
  startTime: Date;
  endTime: Date;
  duration: number; // in minutes
  status: AppointmentStatus;
  notes?: string;
  symptoms?: string[];
  diagnosis?: string;
  treatmentPlan?: string;
  prescribedMedications?: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    notes?: string;
  }>;
  images?: Array<{
    url: string;
    description?: string;
    type: 'xray' | 'photo' | 'scan' | 'other';
    dateTaken: Date;
  }>;
  payment: {
    status: PaymentStatus;
    amount: number;
    paidAmount: number;
    paymentMethod?: 'cash' | 'card' | 'insurance' | 'other';
    insuranceInfo?: {
      provider: string;
      claimNumber?: string;
      coverageAmount?: number;
    };
    invoiceId?: string;
    receiptUrl?: string;
    notes?: string;
  };
  reminders: Array<{
    type: 'email' | 'sms' | 'push';
    sentAt: Date;
    status: 'pending' | 'sent' | 'failed';
    response?: any;
  }>;
  isRecurring: boolean;
  recurringPattern?: {
    frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly';
    endDate?: Date;
    occurrences?: number;
    parentAppointment?: Types.ObjectId;
  };
  cancellation?: {
    reason: string;
    cancelledBy: Types.ObjectId;
    cancelledAt: Date;
    refundAmount?: number;
    notes?: string;
  };
  createdBy: Types.ObjectId;
  updatedBy: Types.ObjectId;
}

const appointmentSchema = new Schema<IAppointment>(
  {
    patient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    dentist: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    treatment: { type: Schema.Types.ObjectId, ref: 'Treatment', required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    duration: { type: Number, required: true, min: 5 }, // Minimum 5 minutes
    status: {
      type: String,
      enum: ['scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show'],
      default: 'scheduled',
    },
    notes: String,
    symptoms: [String],
    diagnosis: String,
    treatmentPlan: String,
    prescribedMedications: [
      {
        name: String,
        dosage: String,
        frequency: String,
        duration: String,
        notes: String,
      },
    ],
    images: [
      {
        url: { type: String, required: true },
        description: String,
        type: { type: String, enum: ['xray', 'photo', 'scan', 'other'], required: true },
        dateTaken: { type: Date, default: Date.now },
      },
    ],
    payment: {
      status: {
        type: String,
        enum: ['pending', 'partial', 'paid', 'refunded', 'failed'],
        default: 'pending',
      },
      amount: { type: Number, required: true, min: 0 },
      paidAmount: { type: Number, default: 0, min: 0 },
      paymentMethod: { type: String, enum: ['cash', 'card', 'insurance', 'other'] },
      insuranceInfo: {
        provider: String,
        claimNumber: String,
        coverageAmount: Number,
      },
      invoiceId: String,
      receiptUrl: String,
      notes: String,
    },
    reminders: [
      {
        type: { type: String, enum: ['email', 'sms', 'push'], required: true },
        sentAt: { type: Date, default: Date.now },
        status: { type: String, enum: ['pending', 'sent', 'failed'], default: 'pending' },
        response: Schema.Types.Mixed,
      },
    ],
    isRecurring: { type: Boolean, default: false },
    recurringPattern: {
      frequency: { type: String, enum: ['daily', 'weekly', 'biweekly', 'monthly'] },
      endDate: Date,
      occurrences: Number,
      parentAppointment: { type: Schema.Types.ObjectId, ref: 'Appointment' },
    },
    cancellation: {
      reason: String,
      cancelledBy: { type: Schema.Types.ObjectId, ref: 'User' },
      cancelledAt: Date,
      refundAmount: Number,
      notes: String,
    },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

// Indexes for faster querying
appointmentSchema.index({ patient: 1, startTime: -1 });
appointmentSchema.index({ dentist: 1, startTime: -1 });
appointmentSchema.index({ status: 1, startTime: 1 });
appointmentSchema.index({ 'payment.status': 1 });

// Virtual for appointment duration in hours
appointmentSchema.virtual('durationHours').get(function() {
  return this.duration / 60; // Convert minutes to hours
});

// Pre-save hook to set endTime based on startTime and duration
appointmentSchema.pre('save', function(next) {
  if (this.isModified('startTime') || this.isModified('duration')) {
    this.endTime = new Date(this.startTime.getTime() + this.duration * 60000);
  }
  next();
});

export default mongoose.models.Appointment || 
  mongoose.model<IAppointment>('Appointment', appointmentSchema);