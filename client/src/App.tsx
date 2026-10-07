import React, { useEffect, useState, useCallback } from 'react';
import { api, getStoredToken } from './api';
import { User, Project, Task } from './types';
import { Navbar } from './components/Navbar';
import { LoginView } from './components/LoginView';
import { TeamDirectoryModal } from './components/TeamDirectoryModal';
import { AdminTranscriptView } from './components/AdminTranscriptView';
import { ProjectCards } from './components/ProjectCards';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { AgentTasksView } from './components/AgentTasksView';
import { FolderKanban, CheckSquare, Sparkles, Shield, Briefcase, Code } from 'lucide-react';

export const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // UI state
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isDirectoryOpen, setIsDirectoryOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks'>('overview');

  // Load user data on startup
  const loadData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const [projRes, taskRes, userRes] = await Promise.all([
        api.getProjects().catch(() => ({ projects: [] })),
        api.getTasks().catch(() => ({ tasks: [] })),
        api.getUsers().catch(() => ({ users: [] })),
      ]);
      setProjects(projRes.projects);
      setTasks(taskRes.tasks);
      setUsers(userRes.users);
    } catch (err) {
      console.error('Failed to load CRM data:', err);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  // Check stored session
  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      setInitializing(false);
      return;
    }

    api.getCurrentUser()
      .then((res) => {
        setCurrentUser(res.user);
        if (res.user.role === 'AGENT') {
          setActiveTab('tasks');
        }
      })
      .catch(() => {
        api.logout();
        setCurrentUser(null);
      })
      .finally(() => {
        setInitializing(false);
      });
  }, []);

  // Load data once authenticated
  useEffect(() => {
    if (currentUser) {
      loadData();
    }
  }, [currentUser, loadData]);

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    if (user.role === 'AGENT') {
      setActiveTab('tasks');
    } else {
      setActiveTab('overview');
    }
  };

  const handleLogout = () => {
    api.logout();
    setCurrentUser(null);
    setProjects([]);
    setTasks([]);
    setSelectedProject(null);
  };

  if (initializing) {
    return (
      <div className="min-h-screen bg-[#070b14] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!currentUser) {
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col">
      {/* Navbar */}
      <Navbar
        user={currentUser}
        onLogout={handleLogout}
        onOpenDirectory={() => setIsDirectoryOpen(true)}
        onRefresh={loadData}
        isRefreshing={isRefreshing}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Role Banner / Context */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
              <span>Welcome back, {currentUser.name}</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              {currentUser.role === 'ADMIN' && 'System Administrator Portal — Full visibility across all 3 client projects & AI transcript conversion.'}
              {currentUser.role === 'MANAGER' && `Project Manager Dashboard — Restricted to projects managed by ${currentUser.name}.`}
              {currentUser.role === 'AGENT' && `Developer Workstation — Scoped to tasks assigned to ${currentUser.name} (${currentUser.specialization}).`}
            </p>
          </div>

          {/* Tab Navigation for Agents */}
          {currentUser.role === 'AGENT' && (
            <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl">
              <button
                type="button"
                onClick={() => setActiveTab('tasks')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  activeTab === 'tasks'
                    ? 'bg-brand-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <CheckSquare className="w-3.5 h-3.5" />
                <span>My Tasks ({tasks.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('overview')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  activeTab === 'overview'
                    ? 'bg-brand-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <FolderKanban className="w-3.5 h-3.5" />
                <span>Related Projects ({projects.length})</span>
              </button>
            </div>
          )}
        </div>

        {/* ADMIN: Transcript Automation Panel */}
        {currentUser.role === 'ADMIN' && (
          <AdminTranscriptView onSuccess={loadData} />
        )}

        {/* Content Views */}
        {currentUser.role === 'AGENT' && activeTab === 'tasks' ? (
          <AgentTasksView tasks={tasks} agentName={currentUser.name} />
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <FolderKanban className="w-4 h-4 text-brand-400" />
                <span>
                  {currentUser.role === 'ADMIN' && 'Active Client Projects (Global View)'}
                  {currentUser.role === 'MANAGER' && 'My Managed Projects'}
                  {currentUser.role === 'AGENT' && 'Projects Containing My Tasks'}
                </span>
                <span className="text-xs font-mono font-normal px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                  {projects.length}
                </span>
              </h2>

              <span className="text-[11px] text-slate-500 font-mono">
                Auto-saved in local database
              </span>
            </div>

            <ProjectCards
              projects={projects}
              onSelectProject={(p) => setSelectedProject(p)}
            />
          </div>
        )}
      </main>

      {/* Project Detail Modal */}
      {selectedProject && (
        <ProjectDetailModal
          projectId={selectedProject.id}
          currentUser={currentUser}
          onClose={() => setSelectedProject(null)}
        />
      )}

      {/* Team Directory Modal */}
      <TeamDirectoryModal
        isOpen={isDirectoryOpen}
        onClose={() => setIsDirectoryOpen(false)}
        users={users}
      />
    </div>
  );
};

export default App;
