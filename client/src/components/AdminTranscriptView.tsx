import React, { useState } from 'react';
import { api } from '../api';
import { OFFICIAL_TRANSCRIPT, MODIFIED_TRANSCRIPT } from '../constants/transcripts';
import { Sparkles, FileText, CheckCircle2, AlertCircle, RotateCcw, ArrowRight, Play } from 'lucide-react';

interface AdminTranscriptViewProps {
  onSuccess: () => void;
}

export const AdminTranscriptView: React.FC<AdminTranscriptViewProps> = ({ onSuccess }) => {
  const [transcript, setTranscript] = useState(OFFICIAL_TRANSCRIPT);
  const [loading, setLoading] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [resultMessage, setResultMessage] = useState<{
    type: 'success' | 'error';
    text: string;
    details?: string[];
  } | null>(null);

  const handleProcess = async () => {
    if (!transcript.trim()) {
      setResultMessage({ type: 'error', text: 'Please paste a meeting transcript first.' });
      return;
    }

    setLoading(true);
    setResultMessage(null);

    try {
      const res = await api.processTranscript(transcript);
      setResultMessage({
        type: 'success',
        text: `Successfully created ${res.createdProjects} projects and ${res.createdTasks} tasks from the meeting transcript!`
      });
      onSuccess();
    } catch (err: any) {
      setResultMessage({
        type: 'error',
        text: err.message || 'Failed to process transcript with AI.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (!window.confirm('Reset all generated projects and tasks? Seeded users will NOT be deleted.')) {
      return;
    }

    setResetting(true);
    setResultMessage(null);
    try {
      await api.resetProjects();
      setResultMessage({
        type: 'success',
        text: 'All projects and tasks have been reset. Database is clean for new transcript runs.'
      });
      onSuccess();
    } catch (err: any) {
      setResultMessage({
        type: 'error',
        text: err.message || 'Failed to reset projects.'
      });
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-6 sm:p-7 border border-slate-800 shadow-xl mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-brand-500/10 text-brand-400 border border-brand-500/20">
              <Sparkles className="w-4 h-4" />
            </span>
            <h2 className="text-lg font-bold text-white tracking-tight">AI Transcript Automation</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Paste meeting dialogue to automatically identify projects, assign directory personnel, set deadlines, and compute hours.
          </p>
        </div>

        {/* Quick Transcript Selectors */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setTranscript(OFFICIAL_TRANSCRIPT)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5 text-brand-400" />
            <span>Official Handout</span>
          </button>

          <button
            type="button"
            onClick={() => setTranscript(MODIFIED_TRANSCRIPT)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5 text-indigo-400" />
            <span>Modified Test (12h, 23 Oct)</span>
          </button>

          <button
            type="button"
            onClick={() => setTranscript('')}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-xs font-medium transition-colors"
          >
            Clear
          </button>

          <button
            type="button"
            onClick={handleReset}
            disabled={resetting || loading}
            title="Wipe projects and tasks for re-testing"
            className="px-2.5 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-medium transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${resetting ? 'animate-spin' : ''}`} />
            <span>Reset Records</span>
          </button>
        </div>
      </div>

      {/* Result Banner */}
      {resultMessage && (
        <div
          className={`mb-4 p-3.5 rounded-xl text-xs flex items-start gap-2.5 ${
            resultMessage.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300'
              : 'bg-red-500/10 border border-red-500/20 text-red-300'
          }`}
        >
          {resultMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
          )}
          <div>
            <p className="font-medium">{resultMessage.text}</p>
          </div>
        </div>
      )}

      {/* Transcript Textarea */}
      <div className="relative mb-4">
        <textarea
          rows={7}
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder="Paste meeting transcript here..."
          className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl p-3.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 font-mono leading-relaxed resize-y"
        />
        <div className="absolute right-3 bottom-3 text-[10px] text-slate-500 font-mono">
          {transcript.length} characters &bull; {transcript.split('\n').filter(Boolean).length} lines
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Strict validation against directory personnel and project constraints active.</span>
        </div>

        <button
          type="button"
          onClick={handleProcess}
          disabled={loading || resetting}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-brand-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-50"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              <span>Analyzing & Extracting...</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Create from Transcript</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
