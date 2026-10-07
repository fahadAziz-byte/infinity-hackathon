import React from 'react';
import { User } from '../types';
import { Sparkles, Users, LogOut, Shield, Briefcase, Code, RefreshCw } from 'lucide-react';

interface NavbarProps {
  user: User;
  onLogout: () => void;
  onOpenDirectory: () => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  onLogout,
  onOpenDirectory,
  onRefresh,
  isRefreshing
}) => {
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Shield className="w-3 h-3" /> Admin
          </span>
        );
      case 'MANAGER':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Briefcase className="w-3 h-3" /> Manager
          </span>
        );
      case 'AGENT':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Code className="w-3 h-3" /> Developer Agent
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full glass-panel border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-brand-500/20 border border-brand-400/30">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-white">NovaWorks</span>
              <span className="text-[10px] font-mono tracking-wider uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">CRM 2.0</span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">AI Meeting to Project Execution Engine</p>
          </div>
        </div>

        {/* Action Controls & User Info */}
        <div className="flex items-center gap-3">
          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            title="Refresh CRM Data"
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white transition-colors border border-slate-700/50"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-brand-400' : ''}`} />
          </button>

          {/* Directory Button */}
          <button
            onClick={onOpenDirectory}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-xs font-medium text-slate-200 border border-slate-700/60 transition-colors shadow-sm"
          >
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Team Directory</span>
          </button>

          {/* User Profile Pill */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600 flex items-center justify-center text-xs font-bold text-white shadow-inner">
              {user.name.charAt(0)}
            </div>
            <div className="hidden md:block text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium text-slate-200">{user.name}</span>
                {getRoleBadge(user.role)}
              </div>
              <p className="text-[10px] text-slate-400 truncate max-w-[140px]">{user.specialization || user.email}</p>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={onLogout}
            title="Log Out"
            className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
