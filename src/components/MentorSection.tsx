import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Star, 
  Calendar, 
  MapPin, 
  Clock, 
  Sparkles, 
  ArrowRight,
  BookOpen,
  ChevronRight,
  HelpCircle,
  X,
  CheckCircle
} from 'lucide-react';
import { MOCK_MENTORS, STARTUP_BLOGS, Mentor, BlogCardInfo } from '../types';

interface MentorSectionProps {
  overallScore: number;
}

export default function MentorSection({ overallScore }: MentorSectionProps) {
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [bookingConfirmation, setBookingConfirmation] = useState<boolean>(false);
  const [bookedTime, setBookedTime] = useState<string>('');

  // Personalization: Recommend Anand Sen for low customer scores, Meera for validation pros
  const getRecommendedMentor = (): Mentor => {
    if (overallScore === 0) return MOCK_MENTORS[0]; // Anand
    if (overallScore >= 75) return MOCK_MENTORS[1]; // Meera
    return MOCK_MENTORS[2]; // Vikram
  };

  const recommendedAdvisor = getRecommendedMentor();

  const handleBookSession = (mentor: Mentor) => {
    setSelectedMentor(mentor);
  };

  const handleConfirmBooking = (timeOption: string) => {
    setBookedTime(timeOption);
    setBookingConfirmation(true);
    setTimeout(() => {
      setSelectedMentor(null);
      setBookingConfirmation(false);
    }, 2500);
  };

  return (
    <div id="mentor-section" className="space-y-8 max-w-6xl mx-auto">
      
      {/* Page header banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-display font-extrabold tracking-tight text-slate-900 dark:text-white">
            Discover Expert Mentors
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Book 1-on-1 advice loops, leverage your free rewards vault tickets, and read curated founder playbook playbooks.
          </p>
        </div>
      </div>

      {/* Recommended Advisor Callout Banner */}
      <div className="bg-gradient-to-tr from-slate-900 to-indigo-950 text-white rounded-3xl p-6 border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
        <div className="space-y-3 max-w-xl">
          <div className="flex items-center gap-1.5 text-indigo-400">
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span className="text-[10px] font-mono tracking-widest font-extrabold uppercase">Diagnostic recommendation</span>
          </div>
          <h3 className="text-xl font-display font-extrabold">Suggested Advisor for Your Stage</h3>
          <p className="text-xs text-slate-350 leading-relaxed font-sans">
            Based on your active diagnostic score of **{overallScore}%**, we recommend scheduling an operational review session with **{recommendedAdvisor.name}** specializing in **{recommendedAdvisor.domain}**.
          </p>
          <div className="flex flex-wrap gap-2 pt-2.5">
            {recommendedAdvisor.tags.map((tag, idx) => (
              <span key={idx} className="text-[9px] bg-slate-800 text-slate-300 font-mono tracking-wide px-2.5 py-1 rounded-full uppercase border border-slate-700/60">{tag}</span>
            ))}
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center gap-3.5 shrink-0 w-full md:w-auto">
          <img 
            referrerPolicy="no-referrer"
            src={recommendedAdvisor.photoUrl} 
            alt={recommendedAdvisor.name} 
            className="w-12 h-12 rounded-full object-cover shrink-0 border border-indigo-500/20"
          />
          <div className="text-xs space-y-1">
            <div className="font-extrabold font-display text-white">{recommendedAdvisor.name}</div>
            <div className="text-slate-400 text-[11px] leading-tight truncate max-w-[170px]">{recommendedAdvisor.role}</div>
            <button 
              id="reco-book-trigger"
              onClick={() => handleBookSession(recommendedAdvisor)}
              className="text-indigo-400 hover:text-indigo-300 font-bold flex items-center text-[10px] mt-1"
            >
              Request Pass booking
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Mentors Grid */}
      <div className="space-y-4">
        <span className="text-[10px] font-mono text-slate-400 tracking-wider uppercase">Active Advisory Pool</span>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MOCK_MENTORS.map((mentor) => (
            <div
              key={mentor.id}
              id={`mentor-card-${mentor.id}`}
              className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-5 rounded-2xl hover:shadow-lg transition-all flex flex-col justify-between space-y-5"
            >
              <div className="space-y-4">
                {/* Mentor top avatar block */}
                <div className="flex gap-4 items-start">
                  <img 
                    referrerPolicy="no-referrer"
                    src={mentor.photoUrl} 
                    alt={mentor.name} 
                    className="w-14 h-14 rounded-2xl object-cover shrink-0 border border-slate-100"
                  />
                  <div className="space-y-0.5 truncate">
                    <h4 className="text-xs font-bold text-slate-850 dark:text-white truncate">{mentor.name}</h4>
                    <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold block truncate">{mentor.domain}</span>
                    <span className="text-[10px] text-slate-450 block truncate">{mentor.role}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-[10px] text-slate-450 font-bold border-y border-slate-50 dark:border-slate-900 py-2">
                  <span className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    {mentor.rating.toFixed(1)} / 5.0
                  </span>
                  <span>|</span>
                  <span className="truncate">{mentor.experience} Exp</span>
                </div>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-sans leading-relaxed">
                  {mentor.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {mentor.tags.slice(0, 3).map((tag, idx) => (
                    <span key={idx} className="text-[9px] bg-slate-55 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 px-2.5 py-0.5 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action booking blocks */}
              <div className="space-y-3.5 border-t border-slate-50 dark:border-slate-900 pt-4 text-xs font-medium">
                <div className="flex justify-between items-center text-[10px] text-slate-500">
                  <span>Available slots:</span>
                  <span className="font-mono text-indigo-500">{mentor.freeDate.split(' (')[0]}</span>
                </div>

                <div className="flex gap-2">
                  <button
                    id={`mentor-book-card-btn-${mentor.id}`}
                    onClick={() => handleBookSession(mentor)}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-[11px] py-2 rounded-xl text-center shadow-xs transition-all hover:-translate-y-0.5"
                  >
                    Redeem Pass Block
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Blogs & Playbooks Section */}
      <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-850">
        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
          <BookOpen className="w-5 h-5 text-indigo-500" />
          <h3 className="font-display font-extrabold text-sm tracking-wide uppercase">Founder Playbook Blogs</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STARTUP_BLOGS.map((blog) => (
            <div
              key={blog.id}
              className="bg-white dark:bg-dark-card border border-slate-150 dark:border-slate-850 rounded-2xl overflow-hidden shadow-sm flex flex-col h-full hover:shadow-md transition-all hover:scale-[1.01]"
            >
              <img 
                referrerPolicy="no-referrer"
                src={blog.imageUrl} 
                alt={blog.title} 
                className="w-full h-36 object-cover"
              />
              <div className="p-4 flex flex-col justify-between flex-1 space-y-3">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-[9px] font-mono font-bold text-indigo-500 uppercase">
                    <span>{blog.category}</span>
                    <span>{blog.readTime}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-850 dark:text-white leading-normal h-8 line-clamp-2">
                    {blog.title}
                  </h4>
                  <p className="text-[10px] text-slate-450 font-sans leading-relaxed line-clamp-2">
                    {blog.excerpt}
                  </p>
                </div>
                
                <button className="text-[10px] font-semibold text-slate-750 dark:text-slate-300 hover:text-indigo-600 transition-colors flex items-center gap-0.5 inline-flex pt-2">
                  Read playbook study
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Calendar Modal / Popup */}
      <AnimatePresence>
        {selectedMentor && (
          <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-dark-card border border-slate-250 dark:border-dark-border p-6 rounded-3xl max-w-md w-full shadow-2xl relative overflow-hidden space-y-6"
            >
              <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <span className="text-[9px] font-mono text-indigo-500 uppercase tracking-widest block font-bold">Redeem Mentorship Token</span>
                  <h3 className="text-sm font-bold text-slate-850 dark:text-white">Schedule Advisor Session</h3>
                </div>
                <button onClick={() => setSelectedMentor(null)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {bookingConfirmation ? (
                <div className="text-center py-6 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto animate-bounce shadow">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-slate-850">Pass Slot Confirmed!</h4>
                    <p className="text-[11px] text-slate-400">Meeting links and agenda documents sent in founder mail.</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900 p-3 rounded-2xl">
                    <img 
                      referrerPolicy="no-referrer"
                      src={selectedMentor.photoUrl} 
                      alt={selectedMentor.name} 
                      className="w-10 h-10 rounded-full object-cover shrink-0"
                    />
                    <div className="text-xs">
                      <div className="font-extrabold">{selectedMentor.name}</div>
                      <div className="text-slate-400 text-[10px] leading-tight truncate max-w-[150px]">{selectedMentor.role}</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Available Scheduling Target Slots</span>
                    
                    <button
                      id="opt-time-free"
                      onClick={() => handleConfirmBooking(selectedMentor.freeDate)}
                      className="w-full text-left p-3.5 rounded-xl border border-indigo-100 dark:border-indigo-900/30 bg-indigo-50/15 text-xs font-semibold flex justify-between items-center hover:bg-indigo-50/30 transition-colors"
                    >
                      <div className="space-y-0.5">
                        <span className="text-indigo-600 dark:text-indigo-400 font-bold block">Free Session (Redeem Ticket)</span>
                        <span className="text-[10px] text-slate-500 font-normal">{selectedMentor.freeDate}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-indigo-500" />
                    </button>

                    <button
                      id="opt-time-paid"
                      onClick={() => handleConfirmBooking(`Paid Call — ${selectedMentor.paidFee}`)}
                      className="w-full text-left p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-dark-card text-xs font-semibold flex justify-between items-center hover:bg-slate-50 transition-colors"
                    >
                      <div className="space-y-0.5">
                        <span className="text-slate-700 dark:text-slate-350 font-bold block">Direct Premium Call</span>
                        <span className="text-[10px] text-slate-400 font-normal">Pricing fee: {selectedMentor.paidFee}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
