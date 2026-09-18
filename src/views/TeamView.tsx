import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  UserPlus, 
  Mail, 
  Check, 
  X,
  ShieldCheck
} from 'lucide-react';
import { TeamMember } from '../types';

export const TeamView: React.FC = () => {
  const { teamMembers, currentUser, setCurrentUser } = useApp();
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Legal Metrology Officer');

  const rolePermissions = [
    { permission: 'Execute Autonomous Label Scans & Inspection', cco: true, qa: true, auditor: true, specialist: true, observer: false },
    { permission: 'Approve & Issue Rule Violation Notices', cco: true, qa: true, auditor: true, specialist: false, observer: false },
    { permission: 'Modify Packaging Rules & Tolerances', cco: true, qa: false, auditor: false, specialist: false, observer: false },
    { permission: 'Generate & Sign Official Inspection Reports', cco: true, qa: true, auditor: true, specialist: false, observer: false },
    { permission: 'Manage Departmental API Endpoints & Webhooks', cco: true, qa: false, auditor: false, specialist: false, observer: false },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Officers & Permissions Roster</h1>
            <span className="px-2.5 py-0.5 text-xs font-mono font-bold rounded-full bg-teal-100 text-teal-900 border border-teal-300">
              OFFICER ROSTER
            </span>
          </div>
          <p className="text-xs text-black font-medium mt-1">
            Manage authorized inspection officers, field verifiers, and team permissions across zones.
          </p>
        </div>

        <button
          onClick={() => setIsInviteModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-sm hover:shadow transition-all active:scale-95"
        >
          <UserPlus size={14} />
          <span>Authorize New Officer</span>
        </button>
      </div>

      {/* Team Roster Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {teamMembers.map((member: TeamMember) => {
          const isCurrent = currentUser.id === member.id;
          return (
            <div
              key={member.id}
              className={`p-5 rounded-xl border transition-all space-y-3.5 relative ${
                isCurrent
                  ? 'bg-teal-50/80 border-teal-500 shadow-sm ring-1 ring-teal-500'
                  : 'bg-white border-slate-200 shadow-xs'
              }`}
            >
              {isCurrent && (
                <span className="absolute top-3.5 right-3.5 text-[9px] font-mono font-black px-2 py-0.5 rounded-full bg-teal-200 text-teal-950 border border-teal-400">
                  ACTIVE PERSONA
                </span>
              )}

              <div className="flex items-center gap-3">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-100 shadow-xs"
                />
                <div>
                  <h4 className="text-xs font-black text-slate-900">{member.name}</h4>
                  <p className="text-[11px] text-teal-900 font-bold">{member.role}</p>
                </div>
              </div>

              <div className="space-y-1 text-xs text-black font-medium">
                <p className="truncate flex items-center gap-1.5">
                  <Mail size={13} className="text-slate-600 flex-shrink-0" />
                  <span className="truncate">{member.email}</span>
                </p>
              </div>

              <div className="pt-2.5 border-t border-slate-200 flex items-center justify-between text-xs font-mono text-black font-bold">
                <span>{member.assignedProducts} Monitored Products</span>
                <span className="text-emerald-800 font-black flex items-center gap-1">
                  <ShieldCheck size={12} /> {member.status}
                </span>
              </div>

              {!isCurrent && (
                <button
                  onClick={() => setCurrentUser(member)}
                  className="w-full py-1.5 text-xs font-mono font-bold rounded-lg bg-slate-100 hover:bg-slate-200 text-black border border-slate-300 transition-colors"
                >
                  Switch to this Officer
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Role Permissions Matrix */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <h3 className="text-sm font-black text-slate-900 tracking-tight">
              Officer Role & Permission Matrix
            </h3>
            <p className="text-xs text-black font-medium">Role permissions across departmental officer tiers</p>
          </div>
          <span className="text-xs font-mono font-bold text-blue-900 bg-blue-100 px-2.5 py-1 rounded-lg border border-blue-300">
            5 Officer Roles
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-black text-black uppercase tracking-wider">
                <th className="py-3.5 px-4">Action / Permission</th>
                <th className="py-3.5 px-3 text-center">Controller of Legal Metrology</th>
                <th className="py-3.5 px-3 text-center">Senior Inspection Officer</th>
                <th className="py-3.5 px-3 text-center">Legal Metrology Officer</th>
                <th className="py-3.5 px-3 text-center">Field Enforcement Inspector</th>
                <th className="py-3.5 px-4 text-center">Desk Observer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium">
              {rolePermissions.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">{row.permission}</td>
                  <td className="py-3.5 px-3 text-center">
                    {row.cco ? (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-50 text-blue-600 border border-blue-200">
                        <Check size={14} />
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-50 text-slate-300">
                        <X size={14} />
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    {row.qa ? (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-50 text-blue-600 border border-blue-200">
                        <Check size={14} />
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-50 text-slate-300">
                        <X size={14} />
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    {row.auditor ? (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-50 text-blue-600 border border-blue-200">
                        <Check size={14} />
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-50 text-slate-300">
                        <X size={14} />
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    {row.specialist ? (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-50 text-blue-600 border border-blue-200">
                        <Check size={14} />
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-50 text-slate-300">
                        <X size={14} />
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {row.observer ? (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-50 text-blue-600 border border-blue-200">
                        <Check size={14} />
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-50 text-slate-300">
                        <X size={14} />
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl p-6 relative">
            <button
              onClick={() => setIsInviteModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X size={17} />
            </button>

            <h3 className="text-base font-bold text-slate-900 mb-1">Authorize Enforcement Officer</h3>
            <p className="text-xs text-slate-500 mb-4">Grant statutory verification access to the Yatarth AI platform.</p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsInviteModalOpen(false);
              }}
              className="space-y-3.5"
            >
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Official Government Email</label>
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="officer@legalmetrology.gov.in"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Assigned Designation</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white"
                >
                  <option value="Controller of Legal Metrology">Controller of Legal Metrology</option>
                  <option value="Senior Inspection Officer">Senior Inspection Officer</option>
                  <option value="Legal Metrology Officer">Legal Metrology Officer</option>
                  <option value="Field Enforcement Inspector">Field Enforcement Inspector</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm active:scale-98 transition-all"
              >
                Issue Officer Authorization
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
