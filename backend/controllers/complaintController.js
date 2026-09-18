import mongoose from 'mongoose';
import Complaint from '../models/Complaint.js';

const memComplaints = new Map();

const dbConnected = () => mongoose.connection.readyState === 1;

// Pre-populate initial sample citizen reports for demo
const INITIAL_DEMO_COMPLAINTS = [
  {
    complaint_id: 'CMP-2026-001',
    citizen_name: 'Aarav Mehta (Consumer)',
    citizen_email: 'aarav.m@gmail.com',
    product_name: 'Crispy Wave Masala Chips 90g',
    category: 'Food & Beverages',
    store_location: 'D-Mart, Andheri East, Mumbai',
    region: 'Maharashtra',
    violations: [
      { rule_id: 'Rule 7', description: 'Non-standard unit symbol "90 GMS" and font height 1.8mm < 4.0mm required.', severity: 'HIGH' },
      { rule_id: 'Rule 6(1)(e)', description: 'MRP Rs 45.00 missing mandatory "inclusive of all taxes" statement.', severity: 'HIGH' },
    ],
    status: 'NOTICE_ISSUED',
    evidence_image_url: '/images/crispy_chips.jpg',
    action_taken: 'Legal Notice Issued to Wave Snacks Ltd under Section 36 of Legal Metrology Act 2009. Penalty ₹25,000.',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    complaint_id: 'CMP-2026-002',
    citizen_name: 'Sunita Sharma (Consumer)',
    citizen_email: 'sunita.s@yahoo.com',
    product_name: 'Royale Herbal Face Cream 50g',
    category: 'Cosmetics & Personal Care',
    store_location: 'Medical Superstore, Connaught Place, New Delhi',
    region: 'Delhi',
    violations: [
      { rule_id: 'Rule 6(1)(f)', description: 'Manufacturing date blurred/smudged (0?/202?). Expiry unreadable.', severity: 'MEDIUM' },
    ],
    status: 'INVESTIGATING',
    evidence_image_url: '/images/bourbon_biscuit.jpg',
    action_taken: 'Assigned to Inspector R. K. Sharma for physical retail store audit.',
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
  },
  {
    complaint_id: 'CMP-2026-003',
    citizen_name: 'Rajesh Kumar (Citizen)',
    citizen_email: 'rajesh.k@outlook.com',
    product_name: 'Sonic Wireless Earbuds Pro',
    category: 'Electronics & Electricals',
    store_location: 'Electronic Hub, Commercial Street, Bengaluru',
    region: 'Karnataka',
    violations: [
      { rule_id: 'Rule 6 (Import)', description: 'Imported commodity missing Country of Origin declaration.', severity: 'HIGH' },
      { rule_id: 'Rule 6(11)', description: 'Missing Unit Sale Price declaration.', severity: 'HIGH' },
    ],
    status: 'PENDING',
    evidence_image_url: '/images/lays_chips.jpg',
    action_taken: 'Pending review by Legal Metrology Officer.',
    createdAt: new Date(Date.now() - 3600000 * 30).toISOString(),
  },
];

// Initialize in-memory cache
INITIAL_DEMO_COMPLAINTS.forEach(c => memComplaints.set(c.complaint_id, c));

export const createComplaint = async (req, res) => {
  const { citizen_name, citizen_email, product_name, category, store_location, region, violations, evidence_image_url, inspection_id } = req.body;

  const complaintId = 'CMP-2026-' + Math.floor(100 + Math.random() * 900);
  const newObj = {
    complaint_id: complaintId,
    citizen_name: citizen_name || 'Anonymous Consumer',
    citizen_email: citizen_email || 'citizen@yatarth.ai',
    product_name: product_name || 'Packaged Commodity',
    category: category || 'Food & Beverages',
    store_location: store_location || 'Local Retail Supermarket',
    region: region || 'Maharashtra',
    violations: violations || [{ rule_id: 'LMPC-2011', description: 'Label violation reported by citizen scanner.', severity: 'HIGH' }],
    status: 'PENDING',
    evidence_image_url: evidence_image_url || '/images/crispy_chips.jpg',
    inspection_id: inspection_id || '',
    action_taken: 'Filed by citizen scanner. Pending review by Legal Metrology Officer.',
    createdAt: new Date().toISOString(),
  };

  try {
    if (dbConnected()) {
      const doc = await Complaint.create(newObj);
      console.log(`🚨 New Citizen Complaint Saved in MongoDB: ${doc.complaint_id}`);
      return res.status(201).json(doc);
    }
  } catch (err) {
    console.warn(`MongoDB Complaint Fallback (${err.message})`);
  }

  memComplaints.set(complaintId, newObj);
  res.status(201).json(newObj);
};

export const listComplaints = async (req, res) => {
  try {
    if (dbConnected()) {
      const docs = await Complaint.find().sort({ createdAt: -1 });
      if (docs.length > 0) return res.json(docs);
    }
  } catch (err) {
    console.warn('MongoDB list complaints fallback');
  }

  const list = Array.from(memComplaints.values()).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  res.json(list);
};

export const updateComplaintStatus = async (req, res) => {
  const { id } = req.params;
  const { status, action_taken } = req.body;

  try {
    if (dbConnected()) {
      const doc = await Complaint.findOneAndUpdate(
        { $or: [{ _id: mongoose.isValidObjectId(id) ? id : null }, { complaint_id: id }] },
        { status, action_taken, updatedAt: new Date() },
        { new: true }
      );
      if (doc) return res.json(doc);
    }
  } catch (err) {
    console.warn('MongoDB update complaint status fallback');
  }

  const cached = memComplaints.get(id) || Array.from(memComplaints.values()).find(c => c.complaint_id === id);
  if (cached) {
    cached.status = status || cached.status;
    if (action_taken) cached.action_taken = action_taken;
    cached.updatedAt = new Date().toISOString();
    return res.json(cached);
  }

  res.status(404).json({ error: 'Complaint record not found' });
};
