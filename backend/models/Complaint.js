import mongoose from 'mongoose';

const ComplaintSchema = new mongoose.Schema(
  {
    complaint_id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    citizen_name: {
      type: String,
      default: 'Anonymous Consumer',
    },
    citizen_email: {
      type: String,
      default: 'citizen@yatarth.ai',
    },
    product_name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      default: 'Food & Beverages',
    },
    store_location: {
      type: String,
      default: 'Reliance Fresh, Mumbai Central',
    },
    region: {
      type: String,
      default: 'Maharashtra',
    },
    violations: [
      {
        rule_id: String,
        description: String,
        severity: { type: String, enum: ['HIGH', 'MEDIUM', 'LOW'], default: 'HIGH' },
      },
    ],
    status: {
      type: String,
      enum: ['PENDING', 'INVESTIGATING', 'NOTICE_ISSUED', 'RESOLVED', 'REJECTED'],
      default: 'PENDING',
    },
    evidence_image_url: {
      type: String,
      default: '',
    },
    inspection_id: {
      type: String,
      default: '',
    },
    action_taken: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

const Complaint = mongoose.models.Complaint || mongoose.model('Complaint', ComplaintSchema);
export default Complaint;
