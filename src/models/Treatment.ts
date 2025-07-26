import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ITreatment extends Document {
  name: string;
  code: string;
  description: string;
  category: 'preventive' | 'restorative' | 'cosmetic' | 'surgical' | 'orthodontic' | 'periodontal' | 'endodontic' | 'prosthodontic' | 'other';
  duration: number; // in minutes
  basePrice: number;
  isActive: boolean;
  requiresDoctorsNote: boolean;
  prerequisites?: string[];
  aftercareInstructions?: string;
  imageUrl?: string;
  colorCode?: string;
  createdBy: Types.ObjectId;
  updatedBy: Types.ObjectId;
  metadata?: Record<string, any>;
}

const treatmentSchema = new Schema<ITreatment>(
  {
    name: { type: String, required: true, trim: true },
    code: { 
      type: String, 
      required: true, 
      unique: true, 
      uppercase: true,
      trim: true 
    },
    description: { type: String, required: true },
    category: { 
      type: String, 
      enum: [
        'preventive', 'restorative', 'cosmetic', 
        'surgical', 'orthodontic', 'periodontal', 
        'endodontic', 'prosthodontic', 'other'
      ],
      required: true 
    },
    duration: { 
      type: Number, 
      required: true, 
      min: 5, // Minimum 5 minutes
      max: 480 // Maximum 8 hours
    },
    basePrice: { 
      type: Number, 
      required: true, 
      min: 0 
    },
    isActive: { 
      type: Boolean, 
      default: true 
    },
    requiresDoctorsNote: { 
      type: Boolean, 
      default: false 
    },
    prerequisites: [String],
    aftercareInstructions: String,
    imageUrl: String,
    colorCode: {
      type: String,
      validate: {
        validator: (v: string) => /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(v),
        message: props => `${props.value} is not a valid hex color code!`
      }
    },
    createdBy: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    updatedBy: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    metadata: Schema.Types.Mixed
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for faster querying
treatmentSchema.index({ name: 'text', description: 'text', code: 'text' });
treatmentSchema.index({ category: 1, isActive: 1 });

// Virtual for formatted price
treatmentSchema.virtual('formattedPrice').get(function() {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(this.basePrice);
});

// Pre-save hook to ensure code is uppercase
treatmentSchema.pre<ITreatment>('save', function(next) {
  if (this.isModified('code')) {
    this.code = this.code.toUpperCase();
  }
  next();
});

// Static method to find active treatments
treatmentSchema.statics.findActive = function() {
  return this.find({ isActive: true }).sort({ name: 1 });
};

// Method to check if treatment requires special handling
treatmentSchema.methods.requiresSpecialHandling = function() {
  return this.requiresDoctorsNote || this.prerequisites?.length > 0;
};

export default mongoose.models.Treatment || 
  mongoose.model<ITreatment>('Treatment', treatmentSchema);
