import React, { createContext, useContext, useState, useEffect } from 'react';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: 'inspector' | 'officer' | 'admin' | 'citizen';
  department: string;
}

interface AuthContextType {
  profile: UserProfile | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email?: string, password?: string, role?: string, name?: string) => Promise<UserProfile>;
  logout: () => void;
  setRoleProfile: (role: 'inspector' | 'officer' | 'admin' | 'citizen') => void;
}

export const DEFAULT_PROFILES: Record<string, UserProfile> = {
  officer: {
    uid: 'insp_officer_priya',
    name: 'Officer Priya Patel',
    email: 'officer@yatarth.ai',
    role: 'officer',
    department: 'Central Consumer Affairs Department',
  },
  inspector: {
    uid: 'insp_inspector_rk',
    name: 'Inspector R. K. Sharma',
    email: 'inspector@yatarth.ai',
    role: 'inspector',
    department: 'Legal Metrology Maharashtra Circle',
  },
  admin: {
    uid: 'insp_admin_system',
    name: 'Super Admin System',
    email: 'admin@yatarth.ai',
    role: 'admin',
    department: 'Central Legal Metrology Portal',
  },
  citizen: {
    uid: 'insp_citizen_aarav',
    name: 'Aarav Mehta (Consumer)',
    email: 'citizen@yatarth.ai',
    role: 'citizen',
    department: 'Public Consumer Protection Portal',
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile | null>(() => {
    const stored = localStorage.getItem('yatarth_auth_user');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        return DEFAULT_PROFILES.officer;
      }
    }
    return DEFAULT_PROFILES.officer;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return Boolean(localStorage.getItem('yatarth_auth_user') || true);
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile) {
      localStorage.setItem('yatarth_auth_user', JSON.stringify(profile));
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem('yatarth_auth_user');
      setIsAuthenticated(false);
    }
  }, [profile]);

  const login = async (email?: string, password?: string, role?: string, name?: string): Promise<UserProfile> => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/inspector-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });
      if (!res.ok) throw new Error('Login failed');
      const data = await res.json();

      const userRole = (role || data.role || 'officer') as 'inspector' | 'officer' | 'admin' | 'citizen';
      const user: UserProfile = {
        uid: data.uid || `insp_${userRole}`,
        name: data.name || (DEFAULT_PROFILES[userRole]?.name || 'Authorized User'),
        email: data.email || email || `${userRole}@yatarth.ai`,
        role: userRole,
        department: data.department || (DEFAULT_PROFILES[userRole]?.department || 'Legal Metrology Division'),
      };
      setProfile(user);
      setIsAuthenticated(true);
      return user;
    } catch (err) {
      const userKey = role || ((email || '').includes('citizen') ? 'citizen' : (email || '').includes('inspector') ? 'inspector' : (email || '').includes('admin') ? 'admin' : 'officer');
      const fallback = DEFAULT_PROFILES[userKey] || DEFAULT_PROFILES.officer;
      setProfile(fallback);
      setIsAuthenticated(true);
      return fallback;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setProfile(null);
    setIsAuthenticated(false);
    localStorage.removeItem('yatarth_auth_user');
  };

  const setRoleProfile = (role: 'inspector' | 'officer' | 'admin' | 'citizen') => {
    const prof = DEFAULT_PROFILES[role] || DEFAULT_PROFILES.officer;
    setProfile(prof);
    setIsAuthenticated(true);
  };

  return (
    <AuthContext.Provider value={{ profile, isAuthenticated, loading, login, logout, setRoleProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
