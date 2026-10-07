import React from 'react';
import { Project } from '../types';
import { FolderKanban, Calendar, Clock, UserCheck, CheckSquare, ArrowUpRight } from 'lucide-react';

interface ProjectCardsProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
}

export const ProjectCards: React.FC<ProjectCardsProps> = ({ projects, onSelectProject }) => {
  if (projects.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-12 text-center border border-slate-800">
        <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700 mx-auto flex items-center justify-center text-slate-500 mb-3">
          <FolderKanban className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-slate-200 mb-1">No Projects Found</h3>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          No projects are currently assigned to your account or generated yet. The Administrator can paste the meeting transcript to create projects.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {projects.map((p) => (
        <div
          key={p.id}
          onClick={() => onSelectProject(p)}
          className="glass-card rounded-2xl p-5 cursor-pointer group flex flex-col justify-between"
        >
          <div>
            {/* Header: Client & Action */}
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-brand-500/10 text-brand-400 border border-brand-500/20">
                {p.clientName}
              </span>
              <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700/60 flex items-center justify-center text-slate-400 group-hover:text-white group-hover:bg-brand-600 group-hover:border-brand-500 transition-all">
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Project Title */}
            <h3 className="text-base font-bold text-white group-hover:text-brand-300 transition-colors mb-2">
              {p.name}
            </h3>

            {/* Description */}
            <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
              {p.description || 'No specific description provided.'}
            </p>
          </div>

          <div>
            {/* Metadata Pills */}
            <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
              <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <div className="truncate">
                  <p className="text-[10px] text-slate-500 uppercase">Deadline</p>
                  <p className="font-mono text-slate-200 text-[11px] font-medium">{p.deadline}</p>
                </div>
              </div>

              <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-2">
                <UserCheck className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <div className="truncate">
                  <p className="text-[10px] text-slate-500 uppercase">Manager</p>
                  <p className="text-slate-200 text-[11px] font-medium truncate">{p.managerName || p.managerId}</p>
                </div>
              </div>
            </div>

            {/* Footer Metrics */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
              <div className="flex items-center gap-1.5 text-slate-300">
                <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-semibold">{p.taskCount ?? 0}</span>
                <span className="text-slate-500">Tasks</span>
              </div>

              <div className="flex items-center gap-1.5 text-slate-300">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-semibold font-mono">{p.totalHours ?? 0}</span>
                <span className="text-slate-500">Hours</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
