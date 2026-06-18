import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Lock, 
  Unlock, 
  CheckCircle, 
  ChevronRight, 
  ChevronDown, 
  Calendar, 
  Flag, 
  Activity, 
  Sparkles,
  Award,
  BookOpen
} from 'lucide-react';
import { RoadmapPhase, Milestone } from '../types';

interface StartupRoadmapProps {
  phases: RoadmapPhase[];
  onToggleMilestone: (phaseId: number, milestoneId: string) => void;
}

export default function StartupRoadmap({ phases, onToggleMilestone }: StartupRoadmapProps) {
  const [expandedPhaseId, setExpandedPhaseId] = useState<number | null>(1); // default expands Phase 1
  const [filterMode, setFilterMode] = useState<'all' | 'locked' | 'unlocked'>('all');

  // Compute overall milestones stats
  const totalMilestones = phases.reduce((acc, p) => acc + p.milestones.length, 0);
  const completedMilestones = phases.reduce((acc, p) => 
    acc + p.milestones.filter(m => m.completed).length, 0);
  const totalProgress = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

  // Find the recommended next milestone
  const findNextMilestone = (): { phaseName: string; milestone: Milestone } | null => {
    for (const phase of phases) {
      for (const m of phase.milestones) {
        if (!m.completed && !m.locked) {
          return { phaseName: phase.phaseName, milestone: m };
        }
      }
    }
    // Fallback: search even if locked
    for (const phase of phases) {
      for (const m of phase.milestones) {
        if (!m.completed) {
          return { phaseName: phase.phaseName, milestone: m };
        }
      }
    }
    return null;
  };

  const recommended = findNextMilestone();

  const handleToggleExpand = (id: number) => {
    setExpandedPhaseId(expandedPhaseId === id ? null : id);
  };

  return (
    <div id="startup-roadmap" className="space-y-8 max-w-5xl mx-auto">
      {/* Roadmap Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 text-white rounded-3xl p-6 border border-slate-800">
        <div className="space-y-1">
          <span className="text-[10px] font-mono tracking-widest text-indigo-400 uppercase font-bold">Execution Engine</span>
          <h2 className="text-2xl font-display font-extrabold tracking-tight">Startup Validation Roadmap</h2>
          <p className="text-xs text-slate-400 max-w-lg">
            Track and complete 24 structured milestones to advance your startup stage from Problem Discovery to raising investor seed funds.
          </p>
        </div>
        
        {/* Progress Display */}
        <div className="flex items-center gap-4 bg-slate-800 px-5 py-3 rounded-2xl border border-slate-700">
          <div className="text-center">
            <span className="text-3xl font-display font-black tracking-tight text-white">{totalProgress}%</span>
            <span className="text-[9px] font-mono uppercase text-indigo-400 block mt-0.5">Overall Completion</span>
          </div>
          <div className="w-px h-10 bg-slate-700"></div>
          <div className="text-left text-xs space-y-0.5">
            <div className="text-slate-400">Milestones:</div>
            <div className="font-bold font-mono text-white">{completedMilestones} / {totalMilestones}</div>
          </div>
        </div>
      </div>

      {/* Recommended Next Milestone Banner */}
      {recommended && (
        <div className="bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 p-4 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 font-bold tracking-wider uppercase">Recommended Next Milestone</span>
              <h4 className="text-sm font-semibold text-slate-800 dark:text-white">{recommended.milestone.title}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl">{recommended.milestone.description}</p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold bg-indigo-100/50 dark:bg-indigo-950 px-3 py-1.5 rounded-xl text-indigo-700 dark:text-indigo-300">
            {recommended.phaseName.split(':')[0]}
          </span>
        </div>
      )}

      {/* Streak and Daily Snapshot */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Calendar Streak Details */}
        <div className="md:col-span-4 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-5 rounded-2xl space-y-4 shadow-sm flex flex-col justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-indigo-500 uppercase font-semibold">Streak Metrics</span>
            <h4 className="text-sm font-bold font-display">Founder Active Streak</h4>
            <p className="text-[11px] text-slate-400">Lock in calendar commits to maintain velocity.</p>
          </div>
          
          <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl space-y-3 border border-slate-100 dark:border-slate-800">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500">Current Commit:</span>
              <span className="text-emerald-500 font-semibold font-mono text-xs flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                Active Streak
              </span>
            </div>
            <div className="text-2xl font-display font-extrabold text-slate-850 dark:text-slate-100">
              5 Success Days
            </div>
          </div>
          
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-slate-500" />
            <span>Next token unlocks at Day 7 commitment!</span>
          </div>
        </div>

        {/* Daily Tasks and work block */}
        <div className="md:col-span-8 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-5 rounded-2xl shadow-sm flex flex-col justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-indigo-500 uppercase font-semibold">Operational Guide</span>
            <h4 className="text-sm font-bold font-display">Daily Phase Work Routine</h4>
            <p className="text-xs text-slate-400">Recommended breakdown of typical activities for execution teams.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3">
            <div className="bg-brand-50 dark:bg-slate-900/40 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/60 space-y-1.5">
              <span className="text-[9px] font-mono font-bold text-slate-400 uppercase">Mornings — research</span>
              <h5 className="text-xs font-semibold">Competitor Gaps</h5>
              <p className="text-[11px] text-slate-500 dark:text-slate-450 leading-relaxed font-sans">
                Review pricing grids, alternative checklists, and draft custom value arguments.
              </p>
            </div>
            
            <div className="bg-brand-50 dark:bg-slate-900/40 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/60 space-y-1.5">
              <span className="text-[9px] font-mono font-bold text-slate-400 uppercase">Afternoons — test</span>
              <h5 className="text-xs font-semibold">Unbiased Interviews</h5>
              <p className="text-[11px] text-slate-500 dark:text-slate-450 leading-relaxed font-sans">
                Call prospective cohorts. Document qualitative responses without pitching product.
              </p>
            </div>

            <div className="bg-brand-50 dark:bg-slate-900/40 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/60 space-y-1.5">
              <span className="text-[9px] font-mono font-bold text-slate-400 uppercase">Evenings — build</span>
              <h5 className="text-xs font-semibold">Core MVP Code</h5>
              <p className="text-[11px] text-slate-500 dark:text-slate-450 leading-relaxed font-sans">
                Refine clickable layouts, write minimal software files, and deploy route tracking.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Accordion list of phases */}
      <div className="space-y-4">
        <div className="flex justify-between items-center text-xs">
          <span className="font-mono text-slate-400 font-semibold uppercase">Operational Phase Trackers</span>
          <div className="flex gap-2">
            {['all', 'unlocked', 'locked'].map((mode) => (
              <button
                key={mode}
                onClick={() => setFilterMode(mode as any)}
                className={`px-3 py-1.5 rounded-xl capitalize border text-[11px] transition-all font-semibold ${
                  filterMode === mode 
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' 
                    : 'bg-white dark:bg-dark-card border-slate-200 dark:border-dark-border text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {phases.map((phase) => {
          // Compute metrics per phase
          const completedCount = phase.milestones.filter(m => m.completed).length;
          const totalCount = phase.milestones.length;
          const phaseProgress = Math.round((completedCount / totalCount) * 100);

          // Filtering
          const isPhaseLocked = phase.milestones.every(m => m.locked);
          if (filterMode === 'locked' && !isPhaseLocked) return null;
          if (filterMode === 'unlocked' && isPhaseLocked) return null;

          const isExpanded = expandedPhaseId === phase.id;

          return (
            <div 
              key={phase.id} 
              id={`phase-card-${phase.id}`}
              className={`bg-white dark:bg-dark-card border rounded-2xl overflow-hidden transition-all ${
                isExpanded 
                  ? 'border-indigo-600/30 shadow-md ring-1 ring-indigo-500/10' 
                  : 'border-slate-200 dark:border-dark-border shadow-sm'
              }`}
            >
              {/* Header section clickable to expand/collapse */}
              <div 
                onClick={() => handleToggleExpand(phase.id)}
                className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50/40 dark:hover:bg-slate-900/20 select-none"
              >
                <div className="flex items-center gap-4 shrink-0">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
                    phaseProgress === 100 ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-600' :
                    isExpanded ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' :
                    'bg-slate-55 dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-500'
                  }`}>
                    <span className="text-xs font-bold font-mono">{phase.id}</span>
                  </div>
                  <div>
                    <h3 className="font-display font-extrabold text-sm text-slate-800 dark:text-white">{phase.phaseName}</h3>
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">{phase.targetDuration}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* Progress bar inside row */}
                  <div className="hidden md:flex flex-col items-end gap-1 shrink-0">
                    <span className="text-[10px] font-mono font-bold text-slate-500">{phaseProgress}%</span>
                    <div className="w-24 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-indigo-600 h-full transition-all duration-500" style={{ width: `${phaseProgress}%` }}></div>
                    </div>
                  </div>

                  {isExpanded ? (
                    <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-slate-400 shrink-0" />
                  )}
                </div>
              </div>

              {/* Milestones expand block */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    className="overflow-hidden border-t border-slate-100 dark:border-slate-850 bg-slate-50/30 dark:bg-slate-950/20"
                  >
                    <div className="p-5 space-y-3">
                      {phase.milestones.map((milestone) => (
                        <div 
                          key={milestone.id}
                          id={`milestone-${milestone.id}`}
                          onClick={() => !milestone.locked && onToggleMilestone(phase.id, milestone.id)}
                          className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${
                            milestone.completed 
                              ? 'bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/20 text-slate-700 dark:text-slate-350 cursor-pointer' 
                              : milestone.locked 
                                ? 'bg-slate-100/50 dark:bg-slate-900/30 border-slate-200 dark:border-dark-border opacity-50 cursor-not-allowed select-none' 
                                : 'bg-white dark:bg-dark-card border-slate-100 dark:border-dark-border hover:border-indigo-600/30 hover:shadow-sm cursor-pointer hover:translate-x-0.5'
                          }`}
                        >
                          <div className="shrink-0 mt-0.5">
                            {milestone.completed ? (
                              <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                                <CheckCircle className="w-4 h-4" />
                              </div>
                            ) : milestone.locked ? (
                              <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-400 flex items-center justify-center">
                                <Lock className="w-3.5 h-3.5" />
                              </div>
                            ) : (
                              <div className="w-6 h-6 rounded-full border-2 border-slate-300 dark:border-slate-700 hover:border-indigo-500 flex items-center justify-center bg-white dark:bg-slate-900">
                                <Unlock className="w-3.5 h-3.5 text-indigo-500 opacity-60" />
                              </div>
                            )}
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className={`text-xs font-bold leading-none ${milestone.completed ? 'line-through text-slate-400' : 'text-slate-800 dark:text-white'}`}>
                                {milestone.title}
                              </h4>
                              {milestone.locked && (
                                <span className="text-[8px] font-mono font-bold uppercase uppercase bg-slate-200 dark:bg-slate-850 px-1.5 py-0.5 rounded text-slate-500">Locked</span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
                              {milestone.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
