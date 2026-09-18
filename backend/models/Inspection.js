import mongoose from 'mongoose';

/**
 * InspectionSchema — Yatarth AI Legal Metrology Compliance Scan
 */
const InspectionSchema = new mongoose.Schema(
  {
    inspector_id: {
      type: String,
      required: true,
      index: true,
    },
    inspector_name: {
      type: String,
      required: true,
      trim: true,
    },
    product_name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        'Food & Beverages',
        'Cosmetics & Personal Care',
        'Electronics & Electricals',
        'Pharmaceuticals',
        'Household Goods',
        'Textiles & Apparel',
        'Chemicals & Cleaners',
        'Other',
      ],
      default: 'Other',
    },
    batch_number: {
      type: String,
      trim: true,
      default: '',
    },
    views: {
      front:  { image_url: String, upload_status: { type: String, default: 'PENDING' }, ocr_status: { type: String, default: 'NOT_STARTED' } },
      back:   { image_url: String, upload_status: { type: String, default: 'PENDING' }, ocr_status: { type: String, default: 'NOT_STARTED' } },
      left:   { image_url: String, upload_status: { type: String, default: 'PENDING' }, ocr_status: { type: String, default: 'NOT_STARTED' } },
      right:  { image_url: String, upload_status: { type: String, default: 'PENDING' }, ocr_status: { type: String, default: 'NOT_STARTED' } },
      top:    { image_url: String, upload_status: { type: String, default: 'PENDING' }, ocr_status: { type: String, default: 'NOT_STARTED' } },
      bottom: { image_url: String, upload_status: { type: String, default: 'PENDING' }, ocr_status: { type: String, default: 'NOT_STARTED' } },
    },
    status: {
      type: String,
      enum: ['CREATED', 'UPLOADING', 'PROCESSING', 'NEEDS_REVIEW', 'COMPLETED', 'FAILED'],
      default: 'CREATED',
    },
    overall_result: {
      type: String,
      enum: ['PASS', 'FAIL', 'NEEDS_REVIEW', null],
      default: null,
    },
    compliance_fields: [
      {
        field_name: {
          type: String,
          required: true,
        },
        status: {
          type: String,
          enum: ['PASS', 'FAIL', 'WARNING', 'NOT_APPLICABLE', 'NEEDS_REVIEW'],
          required: true,
        },
        detected_value: { type: String, default: '' },
        required_value: { type: String, default: '' },
        ocr_confidence: { type: Number, default: 0 },
        evidence_image_url: { type: String, default: '' },
        bounding_box: [{ type: Number }], // [x1, y1, x2, y2]
        rule_id: { type: String, default: 'LMR-2011' },
        rule_version: { type: String, default: 'v2.4' },
      },
    ],
    report_url: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

InspectionSchema.index({ inspector_id: 1, createdAt: -1 });
InspectionSchema.index({ status: 1 });

const Inspection = mongoose.models.Inspection || mongoose.model('Inspection', InspectionSchema);
export default Inspection;
