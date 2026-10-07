import React, { useEffect, useState } from 'react';
import { Project, Task, User } from '../types';
import { api } from '../api';
import { X, Calendar, Clock, UserCheck, CheckSquare, Code, AlertCircle } from 'lucide-react';

interface ProjectDetailModalProps {
  projectId: string;
  currentUser: User;
  onClose: () => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  projectId,
  currentUser,
  onClose,
}) => {
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchDetail() {
      setLoading(true);
      setError(null);
      try {
        const res = await api.getProjectById(projectId);
        if (isMounted) {
          setProject(res.project);
          setTasks(res.tasks);
        }
      } catch (err: any) {
        if (isMounted) setError(err.message || 'Failed to load project details.');
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchDetail();
    return () => {
      isMounted = false;
    };
  }, [projectId]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-slate-800 bg-slate-900/90">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-brand-500/10 text-brand-400 border border-brand-500/20">
                {project?.clientName || 'Client Project'}
              </span>
              <span className="text-xs text-slate-500 font-mono">ID: {projectId}</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              {project?.name || 'Project Details'}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {loading ? (
            <div className="py-16 text-center">
              <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs text-slate-400">Loading project specification...</p>
            </div>
          ) : error ? (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          ) : project ? (
            <>
              {/* Project Meta Banner */}
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Project Manager</p>
                  <p className="text-xs font-medium text-slate-200 mt-0.5 flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5 text-blue-400" />
                    <span>{project.managerName || project.managerId}</span>
                  </p>
                </div>

                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Delivery Deadline</p>
                  <p className="text-xs font-medium text-slate-200 mt-0.5 flex items-center gap-1 font-mono">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{project.deadline}</span>
                  </p>
                </div>

                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Tasks Visible</p>
                  <p className="text-xs font-medium text-slate-200 mt-0.5 flex items-center gap-1">
                    <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{tasks.length} tasks</span>
                  </p>
                </div>

                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Total Effort</p>
                  <p className="text-xs font-medium text-slate-200 mt-0.5 flex items-center gap-1 font-mono">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>{tasks.reduce((sum, t) => sum + (t.estimatedHours || 0), 0)} Hours</span>
                  </p>
                </div>
              </div>

              {/* Description */}
              {project.description && (
                <div className="text-xs text-slate-300 leading-relaxed bg-slate-800/20 p-3.5 rounded-xl border border-slate-800/80">
                  <span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px] block mb-1">
                    Project Scope:
                  </span>
                  {project.description}
                </div>
              )}

              {/* Tasks List */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>Assigned Tasks</span>
                    <span className="text-xs font-normal text-slate-400">
                      ({tasks.length} items)
                    </span>
                  </h3>
                  {currentUser.role === 'AGENT' && (
                    <span className="text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      Role Filter Active: Showing only tasks assigned to you
                    </span>
                  )}
                </div>

                <div className="space-y-3">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 hover:border-slate-600 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-semibold text-white">{task.title}</h4>
                          <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
                            {task.id}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed max-w-xl">
                          {task.description || 'No detailed scope provided.'}
                        </p>
                      </div>

                      <div className="flex items-center gap-4 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-700/50">
                        {/* Assignee */}
                        <div className="text-left sm:text-right">
                          <p className="text-[10px] text-slate-500 uppercase">Assigned To</p>
                          <p className="text-xs font-medium text-emerald-300 flex items-center gap-1 sm:justify-end">
                            <Code className="w-3 h-3" />
                            <span>{task.assigneeName || task.assigneeId}</span>
                          </p>
                        </div>

                        {/* Deadline */}
                        <div className="text-left sm:text-right">
                          <p className="text-[10px] text-slate-500 uppercase">Deadline</p>
                          <p className="text-xs font-medium text-slate-200 font-mono flex items-center gap-1 sm:justify-end">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            <span>{task.deadline}</span>
                          </p>
                        </div>

                        {/* Estimated Hours */}
                        <div className="text-left sm:text-right min-w-[60px]">
                          <p className="text-[10px] text-slate-500 uppercase">Effort</p>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs font-mono font-semibold">
                            <Clock className="w-3 h-3" />
                            {task.estimatedHours}h
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};
