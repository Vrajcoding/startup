import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, 
  UserPlus, 
  Calendar, 
  Trophy, 
  ThumbsUp, 
  CornerDownRight, 
  Send,
  Flag,
  CheckCircle,
  HelpCircle,
  Users,
  X,
  Zap,
  ArrowRight
} from 'lucide-react';
import { 
  DISCUSSIONS, 
  COFOUNDER_MATCHES, 
  STARTUP_EVENTS, 
  LEADERBOARD,
  CommunityPost, 
  MatchingProfile, 
  StartupEvent, 
  LeaderboardUser 
} from '../types';

export default function CommunitySection() {
  const [activeSubTab, setActiveSubTab] = useState<'discuss' | 'cofounder' | 'events' | 'leaderboard'>('discuss');

  // Interactive local list states
  const [posts, setPosts] = useState<CommunityPost[]>(DISCUSSIONS);
  const [rsvpEvents, setRsvpEvents] = useState<Record<string, boolean>>({});
  const [sentMatches, setSentMatches] = useState<Record<string, boolean>>({});

  // Discussions states
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [showDiscussForm, setShowDiscussForm] = useState(false);

  // Upvote handl
  const handleUpvote = (id: string) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, votes: p.votes + 1 } : p));
  };

  // Add thread
  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newPost: CommunityPost = {
      id: `p-${Date.now()}`,
      author: 'You (Founder)',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
      role: 'Founding Team, Active',
      title: newTitle,
      content: newContent,
      votes: 1,
      replies: 0
    };

    setPosts(prev => [newPost, ...prev]);
    setNewTitle('');
    setNewContent('');
    setShowDiscussForm(false);
  };

  const handleRSVP = (id: string) => {
    setRsvpEvents(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleConnectCoFounder = (id: string) => {
    setSentMatches(prev => ({ ...prev, [id]: true }));
  };

  return (
    <div id="community-section" className="space-y-8 max-w-6xl mx-auto h-[620px] md:h-[680px] flex flex-col justify-between">
      
      {/* Tab bar header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <div>
          <h2 className="text-3xl font-display font-extrabold tracking-tight text-slate-900 dark:text-white">
            Founder Ecosystem Community
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Collaborate in structured discussions, unlock co-founder matching portfolios, and track mixer events.
          </p>
        </div>

        {/* View toggles */}
        <div className="bg-slate-100 dark:bg-slate-905 p-1 rounded-xl flex border border-slate-205 dark:border-slate-800">
          <button 
            id="sub-discuss"
            onClick={() => setActiveSubTab('discuss')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 ${
              activeSubTab === 'discuss' ? 'bg-white dark:bg-dark-card shadow-sm font-bold text-slate-850 dark:text-white' : 'text-slate-500'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Discussions
          </button>
          
          <button 
            id="sub-cofounder"
            onClick={() => setActiveSubTab('cofounder')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 ${
              activeSubTab === 'cofounder' ? 'bg-white dark:bg-dark-card shadow-sm font-bold text-slate-850 dark:text-white' : 'text-slate-500'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            Co-Founder Matching
          </button>

          <button 
            id="sub-events"
            onClick={() => setActiveSubTab('events')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 ${
              activeSubTab === 'events' ? 'bg-white dark:bg-dark-card shadow-sm font-bold text-slate-850 dark:text-white' : 'text-slate-500'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            Events
          </button>

          <button 
            id="sub-leaderboard"
            onClick={() => setActiveSubTab('leaderboard')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 ${
              activeSubTab === 'leaderboard' ? 'bg-white dark:bg-dark-card shadow-sm font-bold text-slate-850 dark:text-white' : 'text-slate-500'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            Leaderboard
          </button>
        </div>
      </div>

      {/* Main scrolling card area */}
      <div className="flex-1 overflow-y-auto py-4">
        <AnimatePresence mode="wait">
          
          {activeSubTab === 'discuss' && (
            /* Discussions View */
            <motion.div 
              key="discuss"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-350">Struggling with SaaS models? Converse with matching co-founders.</span>
                <button
                  id="forum-discuss-trigger"
                  onClick={() => setShowDiscussForm(!showDiscussForm)}
                  className="bg-slate-900 border text-white dark:bg-white dark:text-slate-900 font-semibold text-xs px-4 py-2 rounded-xl flex items-center gap-1"
                >
                  {showDiscussForm ? 'Close Editor' : 'Start Thread'}
                </button>
              </div>

              {/* Collapsible Thread form */}
              {showDiscussForm && (
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-5 rounded-2xl space-y-4"
                >
                  <form onSubmit={handleCreatePost} className="space-y-3">
                    <input
                      id="forum-new-title"
                      type="text"
                      required
                      placeholder="Thread Title..."
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-dark-border bg-slate-50 dark:bg-slate-900"
                    />
                    <textarea
                      id="forum-new-content"
                      required
                      placeholder="Convey details of your pricing, developer bottleneck, or question..."
                      value={newContent}
                      onChange={(e) => setNewContent(e.target.value)}
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-dark-border bg-slate-50 dark:bg-slate-900 h-24 resize-none"
                    />
                    <button id="discuss-form-submit" type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs py-2 px-5 rounded-xl block">
                      Post Thread
                    </button>
                  </form>
                </motion.div>
              )}

              {/* Feed items */}
              <div className="space-y-4 font-sans">
                {posts.map((post) => (
                  <div key={post.id} className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-5 rounded-2xl shadow-sm flex gap-4">
                    
                    {/* Upvote side button code */}
                    <div className="flex flex-col items-center shrink-0">
                      <button 
                        id={`upvote-btn-${post.id}`}
                        onClick={() => handleUpvote(post.id)}
                        className="p-2 border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 hover:bg-indigo-50 rounded-xl flex flex-col items-center gap-1 text-[11px] font-bold text-slate-600 transition-colors"
                      >
                        <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-300" />
                        <span>{post.votes}</span>
                      </button>
                    </div>

                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-2.5">
                        <img 
                          referrerPolicy="referrer"
                          src={post.avatar} 
                          alt={post.author} 
                          className="w-8 h-8 rounded-full object-cover border"
                        />
                        <div className="text-[10px] space-y-0.5">
                          <span className="font-extrabold text-slate-800 dark:text-white block leading-none">{post.author}</span>
                          <span className="text-slate-400 block leading-none">{post.role}</span>
                        </div>
                      </div>

                      <h4 className="text-xs font-bold text-slate-850 dark:text-white leading-snug">{post.title}</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">{post.content}</p>

                      <div className="flex items-center gap-2 pt-2 border-t border-slate-50 dark:border-slate-905 text-[10px] text-slate-400 font-semibold">
                        <span>{post.replies} Replies</span>
                        <span>•</span>
                        <span className="text-indigo-600 dark:text-indigo-400 cursor-pointer hover:underline">Draft response thread</span>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeSubTab === 'cofounder' && (
            /* Co-founder matching block */
            <motion.div 
              key="cofounder"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {COFOUNDER_MATCHES.map((profile) => {
                const isSent = sentMatches[profile.id];
                return (
                  <div key={profile.id} className="bg-white dark:bg-dark-card border border-slate-205 dark:border-dark-border p-5 rounded-2xl flex flex-col justify-between shadow-sm space-y-4">
                    <div className="space-y-3 font-sans">
                      <div className="flex gap-3 items-center">
                        <img 
                          referrerPolicy="referrer"
                          src={profile.avatar} 
                          alt={profile.name} 
                          className="w-12 h-12 rounded-2xl object-cover border"
                        />
                        <div className="text-xs">
                          <h4 className="font-extrabold text-slate-850 dark:text-white leading-none">{profile.name}</h4>
                          <span className="text-indigo-600 dark:text-indigo-400 font-semibold block pt-0.5">{profile.role}</span>
                        </div>
                      </div>

                      <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-3 rounded-xl divide-y divide-slate-100 dark:divide-slate-850 text-[10px] space-y-2">
                        <div className="flex justify-between pb-1.5 text-slate-450 font-medium">
                          <span>Startup:</span>
                          <span className="font-bold text-slate-700 dark:text-slate-300">{profile.stage}</span>
                        </div>
                        <div className="flex justify-between pt-1.5 text-slate-450 font-medium font-medium">
                          <span>Seeking Co-Founders:</span>
                          <span className="font-bold text-slate-700 dark:text-slate-300">{profile.seeking}</span>
                        </div>
                      </div>

                      <div className="space-y-1.5 pt-1">
                        <span className="text-[9px] font-mono text-slate-400 uppercase">Tags & expertises</span>
                        <div className="flex flex-wrap gap-1.5">
                          {profile.skills.map((skill, idx) => (
                            <span key={idx} className="bg-slate-100 dark:bg-slate-850 text-slate-600 dark:text-slate-350 text-[9px] px-2 py-0.5 rounded-md font-mono">{skill}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <button
                      id={`cofounder-match-btn-${profile.id}`}
                      onClick={() => handleConnectCoFounder(profile.id)}
                      disabled={isSent}
                      className={`w-full py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-xs ${
                        isSent 
                          ? 'bg-emerald-500/15 text-emerald-600'
                          : 'bg-indigo-600 hover:bg-slate-900 text-white'
                      }`}
                    >
                      {isSent ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          <span>Pitch proposal deliver!</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Pitch Co-Founder Connection</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </motion.div>
          )}

          {activeSubTab === 'events' && (
            /* Events module list */
            <motion.div 
              key="events"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {STARTUP_EVENTS.map((ev) => {
                const isRsvped = rsvpEvents[ev.id];
                return (
                  <div key={ev.id} className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-5 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xs">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-mono text-indigo-500 uppercase tracking-widest bg-indigo-50 dark:bg-indigo-950 px-2.5 py-0.5 rounded-md font-bold">{ev.type}</span>
                        <span className="text-[10px] text-slate-450 font-mono">{ev.date} • {ev.time}</span>
                      </div>
                      <h4 className="text-xs font-extrabold text-slate-850 dark:text-white leading-tight">{ev.title}</h4>
                      
                      <div className="flex flex-wrap gap-2 text-[10px] text-slate-500 font-semibold pt-1">
                        <span>Hosts:</span>
                        {ev.speakers.map((s, idx) => (
                          <span key={idx} className="text-indigo-600 font-bold dark:text-indigo-400">“{s}”</span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-slate-50 pt-3 md:pt-0 shrink-0">
                      <span className="text-[9px] font-mono text-slate-400">{ev.attendees} Attending</span>
                      <button
                        id={`rsvp-btn-${ev.id}`}
                        onClick={() => handleRSVP(ev.id)}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1 transition-all ${
                          isRsvped 
                            ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                            : 'bg-slate-900 border text-white dark:bg-white dark:text-slate-900 hover:bg-slate-850'
                        }`}
                      >
                        {isRsvped ? 'Attending ✓' : 'RSVP Free pass'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}

          {activeSubTab === 'leaderboard' && (
            /* Founder leaderboard */
            <motion.div 
              key="leaderboard"
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.99 }}
              className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-2xl overflow-hidden shadow-sm font-sans"
            >
              <div className="p-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-150 dark:border-slate-800 flex justify-between items-center text-xs">
                <span className="font-mono text-slate-400 font-bold uppercase">Weekly Ecosystem Leaderboard</span>
                <span className="text-[10px] font-mono text-slate-400">Refreshed: 2026-06-17</span>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-850">
                {LEADERBOARD.map((user) => (
                  <div key={user.rank} className="p-4 flex items-center justify-between text-xs hover:bg-slate-50/40">
                    <div className="flex items-center gap-4">
                      {/* Rank tag */}
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center font-mono font-bold ${
                        user.rank === 1 ? 'bg-amber-400 text-white shadow' :
                        user.rank === 2 ? 'bg-slate-300 text-slate-700' :
                        'bg-slate-100 dark:bg-slate-900 text-slate-400'
                      }`}>
                        {user.rank}
                      </div>

                      {/* User metadata */}
                      <div className="flex items-center gap-3">
                        <img 
                          referrerPolicy="referrer"
                          src={user.avatar} 
                          alt={user.name} 
                          className="w-8 h-8 rounded-full object-cover border"
                        />
                        <div className="text-xs">
                          <span className="font-extrabold text-slate-800 dark:text-white block leading-none">{user.name}</span>
                          <span className="text-[10px] text-slate-450 block pt-0.5">{user.startup}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 font-mono text-xs">
                      <div className="text-right">
                        <span className="block font-bold text-slate-800 dark:text-white">{user.badgeCount}</span>
                        <span className="text-[10px] text-slate-400">Badges</span>
                      </div>
                      <div className="text-right">
                        <span className="block font-black text-indigo-600 dark:text-indigo-400">{user.points}</span>
                        <span className="text-[10px] text-slate-400">Vault Pts</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      <div className="bg-indigo-50/25 border border-indigo-100/40 p-4 rounded-2xl shrink-0 text-center text-[10px] text-slate-400 font-sans">
        Founder Ecosystem matching represents unstructured networks. Always verify and document intellectual alignments separately.
      </div>

    </div>
  );
}
