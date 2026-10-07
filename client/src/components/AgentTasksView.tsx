import React from 'react';
import { Task } from '../types';
import { CheckSquare, Clock, Calendar, Briefcase, Sparkles, FolderKanban } from 'lucide-react';

interface AgentTasksViewProps {
  tasks: Task[];
  agentName: string;
}

export const AgentTasksView: React.FC<AgentTasksViewProps> = ({ tasks, agentName }) => {
  const totalHours = tasks.reduce((sum, t) => sum + (t.estimatedHours || 0), 0);
  const distinctProjects = new Set(tasks.map((t) => t.projectId)).size;

  return (
    <div className="space-y-6">
      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-slate-800 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <CheckSquare className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 uppercase font-semibold">My Assigned Tasks</p>
            <p className="text-xl font-bold text-white tracking-tight">{tasks.length} Tasks</p>
          </div>
        </div>

        <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-slate-800 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 uppercase font-semibold">Total Estimated Hours</p>
            <p className="text-xl font-bold text-white tracking-tight font-mono">{totalHours} Hours</p>
          </div>
        </div>

        <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-slate-800 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400">
            <FolderKanban className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 uppercase font-semibold">Active Client Engagements</p>
            <p className="text-xl font-bold text-white tracking-tight">{distinctProjects} Projects</p>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Personal Workstream & Execution Queue</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Securely filtered to your account. Non-assigned tasks and other agents' items are strictly protected.
            </p>
          </div>
        </div>

        {tasks.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            No tasks currently assigned to {agentName}. Check back after the next planning session.
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="p-4 sm:p-5 rounded-xl bg-slate-800/40 border border-slate-700/60 hover:border-slate-600 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-brand-500/10 text-brand-400 border border-brand-500/20">
                      {task.clientName || 'Client Project'}
                    </span>
                    <span className="text-xs font-medium text-slate-300">
                      &bull; {task.projectName}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      ({task.id})
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white">{task.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
                    {task.description || 'No detailed scope notes.'}
                  </p>
                </div>

                <div className="flex items-center gap-4 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-700/50 justify-between md:justify-end">
                  {/* Task Due Date */}
                  <div className="text-left md:text-right">
                    <p className="text-[10px] text-slate-500 uppercase font-semibold">Task Due</p>
                    <p className="text-xs font-mono font-medium text-slate-200 flex items-center gap-1 md:justify-end">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{task.deadline}</span>
                    </p>
                  </div>

                  {/* Estimated Hours */}
                  <div className="text-right min-w-[70px]">
                    <p className="text-[10px] text-slate-500 uppercase font-semibold">Allocated</p>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs font-mono font-bold">
                      <Clock className="w-3.5 h-3.5" />
                      {task.estimatedHours}h
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
