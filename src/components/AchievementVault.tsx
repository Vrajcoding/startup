import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Award, 
  Sparkles, 
  Trash2, 
  Flame, 
  CheckCircle, 
  Lock, 
  FileCheck, 
  Users, 
  Compass, 
  Clock, 
  ChevronRight,
  HelpCircle,
  TrendingUp,
  Briefcase,
  Ticket
} from 'lucide-react';
import { AchievementBadge } from '../types';

interface AchievementVaultProps {
  badges: AchievementBadge[];
  overallScore: number;
  onNavigate: (tab: string) => void;
}

export default function AchievementVault({
  badges,
  overallScore,
  onNavigate,
}: AchievementVaultProps) {
  const [selectedBadge, setSelectedBadge] = useState<AchievementBadge | null>(null);

  // Math totals
  const unlockedBadges = badges.filter(b => b.unlocked);
  const totalPoints = unlockedBadges.reduce((acc, b) => acc + b.points, 0);
  
  // Calculate level based on overall assessment scores
  const currentLevel = overallScore > 0 ? Math.floor(overallScore / 20) + 1 : 1;
  const nextLevelThreshold = currentLevel * 20;
  const levelProgressPercent = overallScore > 0 ? ((overallScore % 20) / 20) * 100 : 0;

  // Let's assume founders get 1 Mentor Ticket for every 2 badges unlocked!
  const mentorTicketsCount = Math.floor(unlockedBadges.length / 2);

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Assessment': return 'bg-blue-500/10 text-blue-500 border border-blue-500/20';
      case 'Docs': return 'bg-amber-500/10 text-amber-500 border border-amber-500/20';
      case 'Roadmap': return 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20';
      case 'Tasks': return 'bg-rose-500/10 text-rose-500 border border-rose-500/20';
      default: return 'bg-violet-500/10 text-violet-500 border border-violet-500/20';
    }
  };

  const badgeIcons: Record<string, string> = {
    ClipboardCheck: "📋",
    Users: "👥",
    Award: "🏆",
    Briefcase: "💼",
    Sparkles: "✨",
    FileText: "📄"
  };

  return (
    <div id="achievement-vault" className="space-y-8 max-w-6xl mx-auto">
      
      {/* Dynamic Levels & Tickets Overview Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-900 border border-slate-805 text-white p-6 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 translate-x-12 -translate-y-12 w-48 h-48 bg-indigo-500/15 rounded-full blur-3xl pointers-none"></div>

        {/* Level Stats */}
        <div className="space-y-3 md:border-r border-slate-800 pr-0 md:pr-6">
          <div className="flex items-center gap-1.5 text-indigo-400">
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span className="text-[10px] font-mono tracking-widest font-extrabold uppercase">Startup standing</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-display font-black leading-none">Level {currentLevel}</span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>Next validation level:</span>
              <span>{overallScore}% / {nextLevelThreshold}%</span>
            </div>
            <div className="w-full bg-slate-805 h-1.5 rounded-full overflow-hidden">
              <div className="bg-indigo-500 h-full transition-all duration-500" style={{ width: `${levelProgressPercent}%` }}></div>
            </div>
          </div>
        </div>

        {/* Total Vault Points */}
        <div className="space-y-3 md:border-r border-slate-800 pr-0 md:pr-6 pl-0 md:pl-2">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <Flame className="w-4 h-4" />
            <span className="text-[10px] font-mono tracking-widest font-extrabold uppercase">Vault Points accumulated</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-display font-black leading-none text-emerald-400">{totalPoints}</span>
            <span className="text-xs text-slate-400">pts</span>
          </div>
          <p className="text-[11px] text-slate-450 leading-normal font-sans">
            Unlocked in active validation events. Earn points to claim rewards.
          </p>
        </div>

        {/* Redeemable Tickets */}
        <div className="space-y-3 pl-0 md:pl-2">
          <div className="flex items-center gap-1.5 text-amber-500">
            <Ticket className="w-4.5 h-4.5" />
            <span className="text-[10px] font-mono tracking-widest font-extrabold uppercase">Redeemable Mentorship Tickets</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-display font-black leading-none text-amber-500">{mentorTicketsCount}</span>
            <span className="text-xs text-slate-400">active passes</span>
          </div>
          <p className="text-[11px] text-slate-450 leading-normal font-sans">
            Assigned free relative to completed badges. Unlock 1-on-1 advisor sessions.
          </p>
        </div>
      </div>

      {/* Gamified Badges collection Grid */}
      <div className="space-y-4">
        <h3 className="font-display font-extrabold text-sm tracking-wide uppercase text-slate-800 dark:text-slate-200">
          Founder Badge Vault Collection
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {badges.map((badge) => (
            <div
              key={badge.id}
              id={`badge-card-${badge.id}`}
              onClick={() => setSelectedBadge(badge)}
              className={`bg-white dark:bg-dark-card border rounded-2xl p-5 hover:scale-[1.01] hover:shadow-md transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between space-y-4 ${
                badge.unlocked 
                  ? 'border-indigo-600/30' 
                  : 'border-slate-150 dark:border-slate-850 opacity-60'
              }`}
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl border ${
                    badge.unlocked 
                      ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500/20 shadow-inner' 
                      : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 grayscale'
                  }`}>
                    {badgeIcons[badge.icon] || "🏆"}
                  </div>
                  <span className={`text-[9px] font-mono font-bold uppercase tracking-wide px-2 py-0.5 rounded ${getCategoryColor(badge.category)}`}>
                    {badge.category}
                  </span>
                </div>

                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-850 dark:text-white flex items-center gap-1.5">
                    {badge.title}
                    {badge.unlocked && (
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500 inline shrink-0" />
                    )}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-sans leading-relaxed">
                    {badge.description}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-50 dark:border-slate-900 flex justify-between items-center text-[10px] font-semibold text-slate-400">
                <span className="font-mono text-indigo-500">+{badge.points} PTS</span>
                {badge.unlocked ? (
                  <span className="text-emerald-500">Unlocked {badge.unlockedAt}</span>
                ) : (
                  <span className="flex items-center gap-0.5 text-slate-400">
                    <Lock className="w-3 h-3" /> Locked
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rewards Vault & Partner Certificates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
        
        {/* Certificate Card */}
        <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-6 rounded-3xl relative overflow-hidden flex flex-col justify-between shadow-sm">
          <div className="space-y-3">
            <span className="text-[9px] font-mono text-indigo-500 uppercase tracking-widest font-bold">Incubation rewards</span>
            <h4 className="text-sm font-bold font-display text-slate-850 dark:text-slate-100">Signed Founder Incubator Certificate</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans font-normal">
              Unlock a signed, cryptographically verified startup execution program completion certificate. Submit all Phase 1 & 2 milestones to authorize processing.
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              id="print-certificate-btn"
              disabled={unlockedBadges.length < 4}
              className={`w-full py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm ${
                unlockedBadges.length >= 4
                  ? 'bg-slate-900 border dark:bg-white dark:text-slate-900 text-white hover:bg-slate-850 hover:-translate-y-0.5'
                  : 'bg-slate-105 select-none opacity-50 cursor-not-allowed border text-slate-400 border-slate-200'
              }`}
            >
              <FileCheck className="w-4 h-4" />
              {unlockedBadges.length >= 4 ? 'Download PDF Certificate' : 'Locks: complete 4 milestones first'}
            </button>
          </div>
        </div>

        {/* Redeem Pass Card */}
        <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-6 rounded-3xl relative overflow-hidden flex flex-col justify-between shadow-sm">
          <div className="space-y-3">
            <span className="text-[9px] font-mono text-amber-500 uppercase tracking-widest font-bold">Redeem passes</span>
            <h4 className="text-sm font-bold font-display text-slate-850 dark:text-slate-100">SaaS Seed Mentor Pass</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans font-normal">
              Redeem 1 session ticket to validate deck structures directly with VP/GP active mentors on our Discover calendar.
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              id="redeem-mentors-btn"
              onClick={() => onNavigate('Mentors')}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-sm"
            >
              <Users className="w-4 h-4" />
              View Available Advisors
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
