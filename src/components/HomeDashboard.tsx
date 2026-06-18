import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Award, 
  FileText, 
  Users, 
  Zap, 
  Clock, 
  ChevronRight, 
  Layers, 
  Activity,
  Calendar,
  Sparkles,
  Target,
  DollarSign,
  Info,
  BadgeAlert,
  ShieldCheck,
  Check
} from 'lucide-react';
import { AssessmentResult, Task, DocumentInfo, RoadmapPhase, AchievementBadge } from '../types';

interface HomeDashboardProps {
  assessmentResult: AssessmentResult;
  tasks: Task[];
  documents: DocumentInfo[];
  roadmapPhases: RoadmapPhase[];
  badges: AchievementBadge[];
  onNavigate: (tab: string) => void;
  onUnlockDiagnosticBadge: () => void;
}

export default function HomeDashboard({
  assessmentResult,
  tasks,
  documents,
  roadmapPhases,
  badges,
  onNavigate,
  onUnlockDiagnosticBadge,
}: HomeDashboardProps) {
  // Analytical domains computed dynamically from the diagnostic results
  const score = assessmentResult.overallScore;
  const completedTasks = tasks.filter(t => t.status === 'Completed').length;
  const totalTasks = tasks.length;
  const taskProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  const completedMilestones = roadmapPhases.reduce((acc, p) => 
    acc + p.milestones.filter(m => m.completed).length, 0);
  const totalMilestones = roadmapPhases.reduce((acc, p) => acc + p.milestones.length, 0);
  const roadmapProgress = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

  const uploadedDocs = documents.filter(d => d.status !== 'Empty').length;
  const totalDocs = documents.length;

  const unlockedBadges = badges.filter(b => b.unlocked);
  const currentBadgePoints = unlockedBadges.reduce((acc, b) => acc + b.points, 0);

  // Gamification: claim daily xp verification block
  const [claimedStreakReward, setClaimedStreakReward] = useState<boolean>(false);
  const [showRewardToast, setShowRewardToast] = useState<boolean>(false);
  
  // Interactive Score Hub focus selection
  const [activeFocusTrack, setActiveFocusTrack] = useState<'customer' | 'product' | 'commercial'>('customer');

  // Compute three key thematic tracks (0 - 100)
  const customerTrackScore = Math.round(
    (((assessmentResult.problemValidation || 0) + 
      (assessmentResult.customerValidation || 0) + 
      (assessmentResult.executionGrowth || 0)) / 3) * 10
  );
  
  const productTrackScore = Math.round(
    (((assessmentResult.productReadiness || 0) + 
      (assessmentResult.teamStrength || 0)) / 2) * 10
  );
  
  const commercialTrackScore = Math.round(
    (((assessmentResult.businessModel || 0) + 
      (assessmentResult.marketOpportunity || 0) + 
      (assessmentResult.financialHealth || 0)) / 3) * 10
  );

  const getScoreTheme = (val: number) => {
    if (val >= 80) return { text: 'text-emerald-500', bg: 'bg-emerald-500/10', stroke: '#10b981', border: 'border-emerald-500/20' };
    if (val >= 50) return { text: 'text-amber-500', bg: 'bg-amber-500/10', stroke: '#f59e0b', border: 'border-amber-500/20' };
    return { text: 'text-rose-500', bg: 'bg-rose-500/10', stroke: '#f43f5e', border: 'border-rose-500/20' };
  };

  const dashboardTheme = getScoreTheme(score);

  // Focus Track custom advisory dataset
  const focusTrackData = {
    customer: {
      title: "Customer Discovery & Demand",
      metric: `${customerTrackScore}% Strength`,
      desc: "Measures alignment with target customer workflows, discovery interviews velocity, and beachhead validation.",
      tactics: [
        { label: "Conduct 15 unbiased feedback dialogues", hours: "12 hrs", action: "Focus on user workflow friction before showing mock screens." },
        { label: "Refine ICP definition matrix", hours: "4 hrs", action: "Identify the top 10% highest-value advocates in your pilot list." },
        { label: "Benchmark non-biased workflow wasting", hours: "6 hrs", action: "Quantify time loss or software lag using static competitor tables." }
      ]
    },
    product: {
      title: "Product Execution & Tech Scale",
      metric: `${productTrackScore}% Strength`,
      desc: "Measures prototype architecture soundness, sprint cadence compliance, and founder technical readiness.",
      tactics: [
        { label: "Verify telemetry analytics structures", hours: "5 hrs", action: "Ensure entry-level CTA buttons trigger telemetry logs correctly." },
        { label: "Draft modular technical schema", hours: "8 hrs", action: "Separate system types earlier to prevent code cutoff issues." },
        { label: "Sprint benchmark evaluation pass", hours: "6 hrs", action: "Measure completed tasks against current seed deadlines." }
      ]
    },
    commercial: {
      title: "Commercialization & Economics",
      metric: `${commercialTrackScore}% Strength`,
      desc: "Measures B2B subscription tier layouts, unit-economic multipliers, and investor readiness levels.",
      tactics: [
        { label: "Per-seat pricing survey alignment", hours: "10 hrs", action: "Align tiered models ($49-$149) with corporate customer targets." },
        { label: "Due diligence package validation", hours: "8 hrs", action: "Collect and audit baseline spreadsheets inside the Data Room." },
        { label: "Formulate top-tier pitch narrative", hours: "12 hrs", action: "Structure story boards showing early indicators of B2B interest." }
      ]
    }
  };

  const handleClaimStreakXp = () => {
    setClaimedStreakReward(true);
    setShowRewardToast(true);
    setTimeout(() => {
      setShowRewardToast(false);
    }, 4000);
  };

  const scoresArray = [
    { name: 'Problem Validation', val: assessmentResult.problemValidation || 0 },
    { name: 'Customer Validation', val: assessmentResult.customerValidation || 0 },
    { name: 'Product Readiness', val: assessmentResult.productReadiness || 0 },
    { name: 'Market Opportunity', val: assessmentResult.marketOpportunity || 0 },
    { name: 'Business Model', val: assessmentResult.businessModel || 0 },
    { name: 'Team Strength', val: assessmentResult.teamStrength || 0 },
    { name: 'Financial Health', val: assessmentResult.financialHealth || 0 },
    { name: 'Execution & Growth', val: assessmentResult.executionGrowth || 0 },
  ];

  const sortedScores = [...scoresArray].sort((a, b) => b.val - a.val);
  const strengths = sortedScores.slice(0, 3);
  const risks = sortedScores.slice(-3).reverse();

  return (
    <div id="home-dashboard" className="space-y-8 max-w-7xl mx-auto px-1">
      
      {/* Toast Notification for XP collection */}
      <AnimatePresence>
        {showRewardToast && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 bg-slate-900 border border-indigo-500/30 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 z-50 overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-indigo-500 to-emerald-400"></div>
            <Award className="w-5 h-5 text-indigo-400 animate-bounce" />
            <div>
              <p className="text-xs font-bold font-display text-white">Daily Streak Reward Safe!</p>
              <span className="text-[10px] text-indigo-300 font-mono">+125 Streak XP added to global Vault Score.</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Welcome Banner */}
      <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-950 text-white p-7 md:p-8 rounded-3xl overflow-hidden border border-slate-800 shadow-xl glow-primary">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl z-0"></div>
        <div className="absolute -bottom-8 left-10 w-48 h-48 bg-emerald-500/5 rounded-full blur-2xl z-0"></div>

        <div className="space-y-2 z-10">
          <div className="flex items-center gap-1.5 text-indigo-400">
            <Sparkles className="w-4 h-4 animate-pulse-slow" />
            <span className="text-xs font-mono font-bold tracking-widest uppercase">Founder Workspace Active</span>
          </div>
          <h1 className="text-3xl font-display font-extrabold tracking-tight md:text-3xl text-white">
            Founder Command Center
          </h1>
          <p className="text-xs text-slate-400 max-w-xl font-medium">
            Welcome back, trailblazer. Build, validate critical commercial assumptions, audit decks, and collaborate with your AI Copilot.
          </p>
        </div>
        
        <div className="mt-5 md:mt-0 flex gap-3 text-xs font-mono z-10">
          <div className="bg-slate-900/80 border border-slate-800 px-4 py-3 rounded-2xl flex flex-col items-center shadow-lg">
            <span className="text-slate-500 text-[9px] tracking-wider uppercase font-bold text-center">Health Level</span>
            <span className="text-sm font-black text-white">{score > 0 ? `${score}%` : 'Pending'}</span>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 px-4 py-3 rounded-2xl flex flex-col items-center shadow-lg">
            <span className="text-slate-500 text-[9px] tracking-wider uppercase font-bold text-center">XP Level</span>
            <span className="text-sm font-black text-indigo-400">lvl {score > 0 ? Math.floor(score / 20) + 1 : 1}</span>
          </div>
          <button 
            id="assess-shortcut-btn"
            onClick={() => onNavigate('Assessment')}
            className="bg-indigo-600 hover:bg-indigo-500 transition-all font-sans text-xs font-bold text-white px-5 rounded-2xl flex items-center gap-1 hover:scale-102"
          >
            {score > 0 ? 'Retake Audit' : 'Start Audit'}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {score === 0 ? (
        /* Empty / Onboarding State Card */
        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-8 rounded-3xl text-center space-y-6 shadow-sm"
        >
          <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-950/40 rounded-2xl flex items-center justify-center mx-auto text-indigo-600 dark:text-indigo-400">
            <Activity className="w-8 h-8 animate-pulse-slow" />
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <h2 className="text-2xl font-display font-bold">Diagnose Your Startup Health</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Complete the quick 15-question assessment evaluating your team, product validation, economics, and investor appeal. Unlock your custom operational dashboard.
            </p>
          </div>
          <div className="flex justify-center">
            <button 
              id="assess-start-card"
              onClick={() => onNavigate('Assessment')}
              className="bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 border dark:border-white text-white font-semibold py-3 px-8 rounded-2xl text-sm transition-all inline-flex items-center gap-2 shadow-lg"
            >
              Analyze My Startup Now
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      ) : (
        /* Dynamic Bento Dashboard Layout */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Column 1: Multi-ring concentric health chart (span 5) */}
          <div className="lg:col-span-5 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-6 rounded-3xl shadow-sm flex flex-col justify-between space-y-6 animate-pulse-slow">
            <div className="flex justify-between items-start">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono tracking-widest text-indigo-500 font-extrabold uppercase block">Audit Radar Index</span>
                <h3 className="font-display font-extrabold text-slate-800 dark:text-slate-200 text-lg">Tracks Vitals Radar</h3>
              </div>
              <span className={`text-[10px] px-2.5 py-1 rounded-full font-mono border ${dashboardTheme.bg} ${dashboardTheme.text} ${dashboardTheme.border}`}>
                Overall: {score}%
              </span>
            </div>

            {/* Glowing Concentric Rings Hub and Selector */}
            <div className="relative flex justify-center py-6">
              
              <svg className="w-56 h-56 transform -rotate-90">
                {/* Track 1 background & ring (commercial) */}
                <circle cx="112" cy="112" r="90" strokeWidth="10" stroke="currentColor" className="text-slate-100 dark:text-slate-850" fill="transparent" />
                <circle 
                  cx="112" cy="112" r="90" strokeWidth="10" 
                  stroke={activeFocusTrack === 'commercial' ? '#0f172a' : '#c7d2fe'}
                  strokeDasharray={2 * Math.PI * 90}
                  strokeDashoffset={(2 * Math.PI * 90) - (2 * Math.PI * 90 * commercialTrackScore) / 100}
                  className="transition-all duration-1000 ease-out cursor-pointer hover:stroke-[12px]"
                  onClick={() => setActiveFocusTrack('commercial')}
                  fill="transparent"
                  strokeLinecap="round"
                />
                
                {/* Track 2 background & ring (product) */}
                <circle cx="112" cy="112" r="70" strokeWidth="10" stroke="currentColor" className="text-slate-100 dark:text-slate-850" fill="transparent" />
                <circle 
                  cx="112" cy="112" r="70" strokeWidth="10" 
                  stroke={activeFocusTrack === 'product' ? '#4f46e5' : '#818cf8'} 
                  strokeDasharray={2 * Math.PI * 70}
                  strokeDashoffset={(2 * Math.PI * 70) - (2 * Math.PI * 70 * productTrackScore) / 100}
                  className="transition-all duration-1000 ease-out cursor-pointer hover:stroke-[12px]"
                  onClick={() => setActiveFocusTrack('product')}
                  fill="transparent"
                  strokeLinecap="round"
                />

                {/* Track 3 background & ring (customer) */}
                <circle cx="112" cy="112" r="50" strokeWidth="10" stroke="currentColor" className="text-slate-100 dark:text-slate-850" fill="transparent" />
                <circle 
                  cx="112" cy="112" r="50" strokeWidth="10" 
                  stroke={activeFocusTrack === 'customer' ? '#10b981' : '#34d399'} 
                  strokeDasharray={2 * Math.PI * 50}
                  strokeDashoffset={(2 * Math.PI * 50) - (2 * Math.PI * 50 * customerTrackScore) / 100}
                  className="transition-all duration-1000 ease-out cursor-pointer hover:stroke-[12px]"
                  onClick={() => setActiveFocusTrack('customer')}
                  fill="transparent"
                  strokeLinecap="round"
                />
              </svg>

              {/* Absolute Center Readout */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-display font-black tracking-tight">{score}%</span>
                <span className="text-[10px] font-mono uppercase text-slate-400 mt-0.5">Health Score</span>
              </div>
            </div>

            {/* Selector Buttons under rings with live parameters */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs pt-2">
              <button 
                onClick={() => setActiveFocusTrack('customer')}
                className={`p-2 rounded-xl transition-all border ${
                  activeFocusTrack === 'customer' 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/20 dark:border-emerald-800 dark:text-emerald-300' 
                    : 'border-slate-100 dark:border-slate-850 hover:bg-slate-50'
                }`}
              >
                <div className="font-mono text-[9px] text-slate-400 uppercase font-black">Customer</div>
                <span className="font-bold font-mono block mt-0.5">{customerTrackScore}%</span>
              </button>

              <button 
                onClick={() => setActiveFocusTrack('product')}
                className={`p-2 rounded-xl transition-all border ${
                  activeFocusTrack === 'product' 
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-800 dark:bg-indigo-950/20 dark:border-indigo-800 dark:text-indigo-300' 
                    : 'border-slate-100 dark:border-slate-850 hover:bg-slate-50'
                }`}
              >
                <div className="font-mono text-[9px] text-slate-400 uppercase font-black">Product</div>
                <span className="font-bold font-mono block mt-0.5">{productTrackScore}%</span>
              </button>

              <button 
                onClick={() => setActiveFocusTrack('commercial')}
                className={`p-2 rounded-xl transition-all border ${
                  activeFocusTrack === 'commercial' 
                    ? 'bg-slate-900 border-slate-950 text-white dark:bg-white dark:border-white dark:text-slate-900' 
                    : 'border-slate-100 dark:border-slate-850 hover:bg-slate-50'
                }`}
              >
                <div className="font-mono text-[9px] text-slate-400 uppercase font-black">Commercial</div>
                <span className="font-bold font-mono block mt-0.5">{commercialTrackScore}%</span>
              </button>
            </div>
          </div>

          {/* Column 2: Selected Focus Track Tactics & Advisory (span 7) */}
          <div className="lg:col-span-7 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-6 rounded-3xl shadow-sm flex flex-col justify-between h-full space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-indigo-650 dark:text-indigo-400">
                <Target className="w-5 h-5" />
                <h3 className="font-display font-extrabold text-slate-800 dark:text-slate-100">Tactical Focus Assistant</h3>
              </div>

              {/* Dynamic advisories change based on concentric selector */}
              <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-850 p-4 rounded-2xl flex flex-col justify-between gap-2.5">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-display font-black text-xs text-slate-800 dark:text-slate-100">
                      {focusTrackData[activeFocusTrack].title}
                    </span>
                    <span className="text-[10px] font-mono text-indigo-500 font-bold bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 rounded-lg border border-indigo-500/10">
                      {focusTrackData[activeFocusTrack].metric}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
                    {focusTrackData[activeFocusTrack].desc}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-[10px] font-mono tracking-wider text-slate-400 uppercase font-bold block">Assigned Focus Actions</span>
                {focusTrackData[activeFocusTrack].tactics.map((tactic, idx) => (
                  <div 
                    key={idx} 
                    className="flex gap-3 bg-brand-50 hover:-translate-y-0.5 transition-transform dark:bg-slate-900/30 p-3 rounded-2xl border border-slate-100 dark:border-slate-850 font-sans"
                  >
                    <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-850 font-bold text-[10px] text-slate-650 dark:text-slate-350 flex items-center justify-center shrink-0">
                      {idx + 1}
                    </div>
                    <div className="text-left space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-none">{tactic.label}</span>
                        <span className="text-[8.5px] font-mono uppercase bg-indigo-600/5 text-indigo-600 px-1.5 py-0.2 rounded-md font-bold">{tactic.hours} req</span>
                      </div>
                      <p className="text-[10px] text-slate-450 leading-relaxed">{tactic.action}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-855 flex justify-between items-center text-xs">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-400" />
                <span className="text-slate-400 font-medium">Sprint Focus Stage:</span>
                <span className="font-extrabold text-indigo-600 dark:text-indigo-400">Beachhead Validation</span>
              </div>
              <button 
                id="nav-to-roadmap"
                onClick={() => onNavigate('Roadmap')}
                className="text-indigo-600 hover:text-indigo-500 font-extrabold flex items-center gap-0.5"
              >
                View Complete Roadmap
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Strengths & Weaknesses (Grid columns 2) */}
          <div className="lg:col-span-6 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-6 rounded-3xl shadow-sm">
            <div className="flex items-center gap-2 mb-4 text-emerald-600">
              <TrendingUp className="w-5 h-5 bg-emerald-500/15 p-1 rounded-full text-emerald-600 block shrink-0" />
              <h4 className="font-display font-extrabold text-slate-805 dark:text-slate-100">Validated Strengths</h4>
            </div>
            
            <div className="space-y-3">
              {strengths.map((str, idx) => (
                <div key={idx} className="flex items-center justify-between border-b last:border-0 border-slate-100 dark:border-slate-850 pb-3 last:pb-0 font-sans font-medium">
                  <div className="flex items-center gap-2.5 truncate">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-350 truncate">{str.name}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="w-16 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full" style={{ width: `${str.val * 10}%` }}></div>
                    </div>
                    <span className="text-[10px] font-mono font-black text-slate-450">{str.val * 10}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-6 rounded-3xl shadow-sm">
            <div className="flex items-center gap-2 mb-4 text-amber-500">
              <AlertTriangle className="w-5 h-5 bg-amber-500/15 p-1 rounded-full text-amber-500 block shrink-0" />
              <h4 className="font-display font-extrabold text-slate-855 dark:text-slate-100">At-Risk Categories</h4>
            </div>

            <div className="space-y-3">
              {risks.map((risk, idx) => (
                <div key={idx} className="flex items-center justify-between border-b last:border-0 border-slate-100 dark:border-slate-850 pb-3 last:pb-0 font-sans font-medium">
                  <div className="flex items-center gap-2.5 truncate">
                    <BadgeAlert className="w-4 h-4 text-amber-500 shrink-0" />
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-350 truncate">{risk.name}</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="w-16 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-rose-500 h-full" style={{ width: `${risk.val * 10}%` }}></div>
                    </div>
                    <span className="text-[10px] font-mono font-black text-slate-450">{risk.val * 10}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Operational Progress Snapshot Bento Row (span 4 elements) */}
          <div className="lg:col-span-4 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-5 rounded-3xl shadow-sm relative overflow-hidden h-full flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono text-indigo-500 uppercase font-black tracking-widest block font-extrabold">Traction Snapshot</span>
                <Layers className="w-4 h-4 text-slate-400" />
              </div>
              <h4 className="text-xs font-extrabold font-display text-slate-800 dark:text-slate-200">Roadmap Progress</h4>
              <div className="flex items-baseline gap-1.5 pt-3">
                <span className="text-4xl font-display font-black tracking-tight text-slate-900 dark:text-white">
                  {roadmapProgress}%
                </span>
                <span className="text-[10px] font-mono text-slate-400">completed</span>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-slate-50 dark:border-slate-850">
              <div className="flex justify-between text-[11px] text-slate-500 mb-2">
                <span>Completed Checkpoints:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{completedMilestones}/{totalMilestones}</span>
              </div>
              <button 
                id="nav-to-roadmap-snapshot"
                onClick={() => onNavigate('Roadmap')}
                className="text-xs font-extrabold text-indigo-600 hover:text-indigo-550 inline-flex items-center gap-0.5"
              >
                Track next milestone
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-4 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-5 rounded-3xl shadow-sm relative overflow-hidden h-full flex flex-col justify-between font-sans">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono text-indigo-500 uppercase font-black tracking-widest block font-extrabold">Sprints & Execution</span>
                <Activity className="w-4 h-4 text-slate-400" />
              </div>
              <h4 className="text-xs font-extrabold font-display text-slate-805 dark:text-slate-200">Sprint Delivery</h4>
              <div className="flex items-baseline gap-1.5 pt-3">
                <span className="text-4xl font-display font-black tracking-tight text-slate-900 dark:text-white">
                  {taskProgress}%
                </span>
                <span className="text-[10px] font-mono text-slate-400">completed</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-50 dark:border-slate-855 font-sans">
              <div className="flex justify-between text-[11px] text-slate-500 mb-2 font-sans font-medium">
                <span>Resolved Sprint Tasks:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{completedTasks}/{totalTasks}</span>
              </div>
              <button 
                id="nav-to-tasks"
                onClick={() => onNavigate('Tasks')}
                className="text-xs font-extrabold text-indigo-600 hover:text-indigo-550 inline-flex items-center gap-0.5"
              >
                Review Tasks Kanban
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-4 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-5 rounded-3xl shadow-sm relative overflow-hidden h-full flex flex-col justify-between font-sans">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono text-indigo-500 uppercase font-black tracking-widest block font-extrabold">Gamification Vault</span>
                <Award className="w-4 h-4 text-slate-400" />
              </div>
              <h4 className="text-xs font-extrabold font-display text-slate-805 dark:text-slate-200">Global Vault Score</h4>
              <div className="flex items-baseline gap-1.5 pt-3">
                <span className="text-4xl font-display font-black tracking-tight text-indigo-600 dark:text-indigo-400 font-extrabold">
                  {currentBadgePoints + (claimedStreakReward ? 125 : 0)}
                </span>
                <span className="text-[10px] font-mono text-slate-400">XP Points</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-50 dark:border-slate-855">
              <div className="flex justify-between text-[11px] text-slate-505 mb-2 font-sans font-medium">
                <span>Unlocked Badges:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{unlockedBadges.length}/{badges.length}</span>
              </div>
              <button 
                id="nav-to-achievements"
                onClick={() => onNavigate('Achievement Vault')}
                className="text-xs font-extrabold text-indigo-600 hover:text-indigo-550 inline-flex items-center gap-0.5"
              >
                Review Vault achievements
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Combined Streak Vital tracker (gamified claiming booster coin) */}
          <div className="lg:col-span-12 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-6 rounded-3xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-tr from-indigo-500/10 to-orange-500/0 rounded-full blur-xl"></div>
            
            <div className="space-y-3 max-w-lg">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-500" />
                <h4 className="font-display font-extrabold text-slate-800 dark:text-slate-100">Weekly Founder Audit Streak</h4>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-sans font-medium">
                Execute core actions on consecutive days to keep your audit streak healthy. Claim daily booster coins to elevate your VC review status!
              </p>
              
              {/* Claim Button */}
              {!claimedStreakReward ? (
                <button
                  onClick={handleClaimStreakXp}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-sans text-[10.5px] font-extrabold px-4 py-2.5 rounded-2xl flex items-center gap-1.5 shadow border border-indigo-500/20 active:scale-95 transition-all"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-300 animate-bounce" />
                  Claim Daily +125 XP Booster Coin
                </button>
              ) : (
                <div className="inline-flex items-center gap-1.5 bg-emerald-100/45 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-350 px-3 py-1.5 rounded-2xl border border-emerald-500/10 text-[10px] font-extrabold">
                  <Check className="w-3.5 h-3.5" />
                  Booster Coin Claimed for Today!
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2 shrink-0">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => {
                const todayIdx = new Date().getDay() - 1; // Mon is 0
                const isPast = idx < todayIdx;
                const isToday = idx === todayIdx;
                return (
                  <div key={idx} className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-semibold border transition-all ${
                      isToday ? 'bg-indigo-600 text-white border-indigo-600 scale-110 active-shadow shadow-md font-extrabold' :
                      isPast || (isToday && claimedStreakReward) ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
                      'bg-slate-50 dark:bg-slate-900/60 text-slate-400 border-slate-101 dark:border-slate-800'
                    }`}>
                      {day[0]}
                    </div>
                    <span className="text-[9px] font-semibold text-slate-400 mt-1">{day}</span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
