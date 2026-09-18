import mongoose from 'mongoose';
import User from '../models/User.js';

const memUsers = new Map();

const dbConnected = () => mongoose.connection.readyState === 1;

// Demo accounts for Yatarth AI (Legal Metrology Inspectors & Officers)
const INSPECTOR_ACCOUNTS = {
  'inspector@yatarth.ai': { password: 'inspector123', role: 'inspector', name: 'Inspector R. K. Sharma', department: 'Legal Metrology Maharashtra' },
  'officer@yatarth.ai':   { password: 'officer123',   role: 'officer',   name: 'Officer Priya Patel',     department: 'Consumer Affairs Department' },
  'admin@yatarth.ai':     { password: 'admin123',     role: 'admin',     name: 'Super Admin System',      department: 'Central Legal Metrology Portal' },
};

// ─── POST /api/auth/inspector-login ─────────────────────────────────────────
export const loginInspector = async (req, res) => {
  const { email, password, name } = req.body;

  let cleanEmail = (email || '').toLowerCase().trim();
  let account = INSPECTOR_ACCOUNTS[cleanEmail];

  // If simple name-based login or custom email
  if (!cleanEmail && name) {
    cleanEmail = `${name.toLowerCase().replace(/[^a-z0-9]/g, '.')}@yatarth.ai`;
    account = {
      password: password || 'pass123',
      role: 'inspector',
      name: name.trim(),
      department: 'Field Metrology Division',
    };
    // Default dynamic role-based account initialization
    account = {
      password: password || 'pass123',
      role: 'inspector',
      name: cleanEmail.split('@')[0].toUpperCase(),
      department: 'Legal Metrology Division',
    };
  }

  if (!account) {
    return res.status(401).json({ error: 'Invalid inspector credentials' });
  }

  const uid = 'insp_' + cleanEmail.replace(/[^a-z0-9]/g, '_');

  try {
    if (!dbConnected()) throw new Error('DB not connected');

    let user = await User.findOne({ uid });
    if (!user) {
      user = await User.create({
        uid,
        name: account.name,
        email: cleanEmail,
        role: account.role,
        wardId: account.department,
      });
      console.log(`🔬 New Inspector Registered in MongoDB: ${user.name} (${cleanEmail})`);
    }

    res.json({
      uid: user.uid,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.wardId || account.department,
      createdAt: user.createdAt.toISOString(),
      source: 'MongoDB',
    });
  } catch (err) {
    console.warn(`⚠️  MongoDB Auth Fallback (${err.message}): Storing user in-memory.`);
    const fallbackUser = {
      uid,
      name: account.name,
      email: cleanEmail,
      role: account.role,
      department: account.department,
      createdAt: new Date().toISOString(),
      source: 'InMemory',
    };
    memUsers.set(uid, fallbackUser);
    res.json(fallbackUser);
  }
};

export const loginCitizen = loginInspector;
export const loginAdmin = loginInspector;

// ─── GET /api/auth/profile/:uid ──────────────────────────────────────────────
export const getProfile = async (req, res) => {
  const { uid } = req.params;

  try {
    if (!dbConnected()) throw new Error('DB not connected');
    const user = await User.findOne({ uid });
    if (!user) return res.status(404).json({ error: 'User profile not found' });

    res.json({
      uid: user.uid,
      name: user.name,
      email: user.email || '',
      role: user.role,
      department: user.wardId || 'Legal Metrology Division',
      createdAt: user.createdAt.toISOString(),
    });
  } catch (err) {
    const cached = memUsers.get(uid);
    if (!cached) return res.status(404).json({ error: 'User profile not found' });
    res.json(cached);
  }
};
