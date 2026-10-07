import React from 'react';
import { User } from '../types';
import { X, Shield, Briefcase, Code, Mail } from 'lucide-react';

interface TeamDirectoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
}

export const TeamDirectoryModal: React.FC<TeamDirectoryModalProps> = ({ isOpen, onClose, users }) => {
  if (!isOpen) return null;

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return <Shield className="w-4 h-4 text-purple-400" />;
      case 'MANAGER':
        return <Briefcase className="w-4 h-4 text-blue-400" />;
      case 'AGENT':
        return <Code className="w-4 h-4 text-emerald-400" />;
      default:
        return null;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'MANAGER':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'AGENT':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[85vh] flex flex-col bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/80">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>NovaWorks Team Directory</span>
              <span className="text-xs font-mono font-normal px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                {users.length} Seeded Accounts
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Official company personnel supplied to AI for project & task assignments.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Directory Grid */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {users.map((u) => (
              <div
                key={u.id}
                className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 hover:border-slate-600 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-200 text-sm">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-white">{u.name}</h3>
                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                          <Mail className="w-3 h-3 text-slate-500" />
                          <span className="font-mono text-[11px]">{u.email}</span>
                        </div>
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getRoleBadge(
                        u.role
                      )}`}
                    >
                      {getRoleIcon(u.role)}
                      <span>{u.role}</span>
                    </span>
                  </div>

                  <div className="text-xs text-slate-300 mb-2.5">
                    <span className="text-slate-500 font-medium">Specialization:</span>{' '}
                    <span className="text-slate-200">{u.specialization || 'General'}</span>
                  </div>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-700/40">
                  {u.skills && u.skills.length > 0 ? (
                    u.skills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/50"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-[11px] text-slate-500 italic">No skills listed</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
