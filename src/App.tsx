import React, { useState } from 'react';
import { 
  Home, 
  Activity, 
  Flag, 
  CheckSquare, 
  FileText, 
  Sparkles, 
  Award, 
  Users, 
  MessageSquare,
  Sun,
  Moon,
  TrendingUp,
  Layout,
  Menu,
  X
} from 'lucide-react';
import HomeDashboard from './components/HomeDashboard';
import StartupAssessment from './components/StartupAssessment';
import StartupRoadmap from './components/StartupRoadmap';
import TasksExecution from './components/TasksExecution';
import PitchDeckDocuments from './components/PitchDeckDocuments';
import AICopilot from './components/AICopilot';
import AchievementVault from './components/AchievementVault';
import MentorSection from './components/MentorSection';
import CommunitySection from './components/CommunitySection';

import { 
  AssessmentResult, 
  RoadmapPhase, 
  Task, 
  DocumentInfo, 
  AchievementBadge, 
  Message,
  TaskStatus,
  TaskPriority
} from './types';

// Let's create our baseline state blueprints
const INITIAL_ASSESSMENT: AssessmentResult = {
  overallScore: 68,
  problemValidation: 75,
  customerValidation: 60,
  productReadiness: 70,
  marketOpportunity: 65,
  businessModel: 55,
  teamStrength: 80,
  financialHealth: 50,
  executionGrowth: 60,
  diagnosis: "Your startup shows good conceptual alignment. Customer interviews lag behind technical preparation. Focus on unbiased, un-pitched discovery before deploying complete MVP builds.",
  recommendations: [
    "Conduct 10 qualitative problem interviews",
    "Define quantitative buyer profiles",
    "Perform code validation drills"
  ],
  strengths: ["Strong competitor differentiation", "High technical setup readiness"],
  risks: ["Limited user problem discovery", "Unvalidated pricing cohorts"],
  recommendedActions: [
    "Conduct 10 qualitative problem interviews",
    "Define quantitative buyer profiles",
    "Perform code validation drills"
  ]
};

const INITIAL_PHASES: RoadmapPhase[] = [
  {
    id: 1,
    phaseName: "Phase 1: Problem Discovery",
    targetDuration: "Weeks 1-3",
    progress: 50,
    iconName: "Compass",
    milestones: [
      { id: "m1-1", title: "Problem Definition Matrix", description: "Draft the primary consumer pain point and articulate critical competitor shortcomings.", completed: true, locked: false },
      { id: "m1-2", title: "Customer Segment Hypothesis", description: "Establish a list of 3 candidate demographic groups facing high daily friction.", completed: true, locked: false },
      { id: "m1-3", title: "Unbiased Competitor Audit", description: "Map features, pricing points, and review grids of the top 5 alternatives.", completed: false, locked: false },
      { id: "m1-4", title: "Value Proposition Blueprint", description: "Establish how your product builds a 10x workflow upgrade over alternative setups.", completed: false, locked: false }
    ]
  },
  {
    id: 2,
    phaseName: "Phase 2: Discovery Validation",
    targetDuration: "Weeks 4-6",
    progress: 0,
    iconName: "Activity",
    milestones: [
      { id: "m2-1", title: "First 10 Discovery Calls", description: "Conduct customer calls regarding friction points without pitching your solution.", completed: false, locked: false },
      { id: "m2-2", title: "First 25 Interview Transcripts", description: "Gather 25 systematic transcript responses identifying key words.", completed: false, locked: true },
      { id: "m2-3", title: "Verify High Pain Patterns", description: "Summarize if at least 15 interviewees rank the pain in their top 3 issues.", completed: false, locked: true },
      { id: "m2-4", title: "Core Demographics Survey", description: "Acquire 50 quantitative response values confirming buyer trends.", completed: false, locked: true }
    ]
  },
  {
    id: 3,
    phaseName: "Phase 3: Prototype & MVP",
    targetDuration: "Weeks 7-10",
    progress: 0,
    iconName: "Layers",
    milestones: [
      { id: "m3-1", title: "Clickable UI Overviews", description: "Design a high-fidelity visual preview of the primary workspace screens.", completed: false, locked: true },
      { id: "m3-2", title: "Minimal Functional Core", description: "Build and run the minimum code loop addressing the candidate pain point.", completed: false, locked: true },
      { id: "m3-3", title: "Interactive Closed Beta Runs", description: "Deploy basic preview routes to 5 cohort groups for live usability test sessions.", completed: false, locked: true },
      { id: "m3-4", title: "Qualitative User Logs", description: "Log quantitative interactions and identify navigation bugs.", completed: false, locked: true }
    ]
  },
  {
    id: 4,
    phaseName: "Phase 4: Market Entry",
    targetDuration: "Weeks 11-13",
    progress: 0,
    iconName: "TrendingUp",
    milestones: [
      { id: "m4-1", title: "First Anchor pilot", description: "Convert 1 beta brand or customer into an active full-workflow tester.", completed: false, locked: true },
      { id: "m4-2", title: "First 5 active clients", description: "Acquire 5 recurring active accounts utilizing files daily.", completed: false, locked: true },
      { id: "m4-3", title: "Verify transaction rails", description: "Finalize and test billing gateways, receipt logs, and invoices.", completed: false, locked: true },
      { id: "m4-4", title: "First Paying Account", description: "Close your first commercial transaction with real-world revenue.", completed: false, locked: true }
    ]
  },
  {
    id: 5,
    phaseName: "Phase 5: Early Scalability",
    targetDuration: "Weeks 14-16",
    progress: 0,
    iconName: "Award",
    milestones: [
      { id: "m5-1", title: "Earn 10k Baseline Revenue", description: "Validate continuous commercial value conversion by hitting baseline metrics.", completed: false, locked: true },
      { id: "m5-2", title: "Document User Case Studies", description: "Acquire 3 detailed client statements documenting positive business outcomes.", completed: false, locked: true },
      { id: "m5-3", title: "Establish Key Partnerships", description: "Secure a strategic promotional arrangement with a community or newsletter network.", completed: false, locked: true },
      { id: "m5-4", title: "SaaS Referral Mechanics", description: "Draft automated invitation passes and reward coupons.", completed: false, locked: true }
    ]
  },
  {
    id: 6,
    phaseName: "Phase 6: Seed Readiness",
    targetDuration: "Weeks 17-20",
    progress: 0,
    iconName: "Briefcase",
    milestones: [
      { id: "m6-1", title: "ISO Compliance Audits", description: "Verify secure encryption structures and clear server credentials configurations.", completed: false, locked: true },
      { id: "m6-2", title: "Seed Deck Package Prep", description: "Secure a v1 pitch deck, multi-tier spreadsheet models, and structured agreements.", completed: false, locked: true },
      { id: "m6-3", title: "Advisor Warm Inspections", description: "Verify financial variables with external incubator leaders or mentors.", completed: false, locked: true },
      { id: "m6-4", title: "First 3 Angel Meetings", description: "Conduct presentation passes with VC associates or capital groups.", completed: false, locked: true }
    ]
  }
];

const INITIAL_TASKS: Task[] = [
  { id: "t1", title: "Draft problem discovery script", description: "Write list of 5 open-ended questions targeting workflow pain points without pitching features.", status: 'To Do', priority: 'High', assignedTo: "Founder (You)", deadline: "2026-06-20", progress: 0, category: 'Daily' },
  { id: "t2", title: "Benchmark peer features & pricing parameters", description: "Log pricing structures, subscription layers, and entry-level packages of top 3 alternatives.", status: 'In Progress', priority: 'Medium', assignedTo: "Analyst Karan", deadline: "2026-06-22", progress: 40, category: 'Weekly' },
  { id: "t3", title: "Audit financial master spreadsheets", description: "Verify custom unit-economics inputs and standard conversion logs for due diligence packages.", status: 'Review', priority: 'High', assignedTo: "Advisor Meera", deadline: "2026-06-25", progress: 90, category: 'Team' },
  { id: "t4", title: "Establish core user interview cohort", description: "Filter LinkedIn networks to compile a robust target contact list of 30 product managers.", status: 'Completed', priority: 'Low', assignedTo: "Founder (You)", deadline: "2026-06-16", progress: 100, category: 'Daily' }
];

const INITIAL_DOCUMENTS: DocumentInfo[] = [
  { id: "doc-1", type: "Pitch Deck", status: "Uploaded", name: "Alpha_Group_PitchDeck_Draft1.pdf", size: "4.2 MB" },
  { id: "doc-2", type: "Financial Model", status: "Empty" },
  { id: "doc-3", type: "Business Plan", status: "Empty" },
  { id: "doc-4", type: "Market Research", status: "Empty" },
  { id: "doc-5", type: "Investor QA", status: "Empty" }
];

const INITIAL_BADGES: AchievementBadge[] = [
  { id: "b1", title: "Auditing Master", description: "Completed the core startup diagnostic assessment questionnaire.", category: "Assessment", points: 100, icon: "ClipboardCheck", unlocked: true, unlockedAt: "Jun 16" },
  { id: "b2", title: "Community Pillar", description: "Participate in co-founder discussions or post an ecosystem thread.", category: "Community", points: 100, icon: "Users", unlocked: false },
  { id: "b3", title: "Agile Executor", description: "Successfully create or resolve active sprint tasks.", category: "Tasks", points: 100, icon: "Award", unlocked: false },
  { id: "b4", title: "Data Room Vetted", description: "Upload your initial pitch deck to the secure investor data room.", category: "Docs", points: 150, icon: "Briefcase", unlocked: false },
  { id: "b5", title: "AI Visionary", description: "Dialogue with Gemini Copilot to refine startup strategies.", category: "AI", points: 100, icon: "Sparkles", unlocked: false }
];

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('Home');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Core functional states
  const [assessment, setAssessment] = useState<AssessmentResult>(INITIAL_ASSESSMENT);
  const [phases, setPhases] = useState<RoadmapPhase[]>(INITIAL_PHASES);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [documents, setDocuments] = useState<DocumentInfo[]>(INITIAL_DOCUMENTS);
  const [badges, setBadges] = useState<AchievementBadge[]>(INITIAL_BADGES);
  
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'assistant',
      text: "Greetings! I am your AI execution partner. Let's translate your raw validation diagnostics into operational milestone completions.",
      timestamp: new Date()
    }
  ]);

  // Handle assessment update
  const handleCompleteAssessment = (result: AssessmentResult) => {
    setAssessment(result);

    // Dynamic Badge Unlock: Auditing Master
    setBadges(prev => prev.map(b => b.id === 'b1' ? { ...b, unlocked: true, unlockedAt: "Just Now" } : b));
  };

  const handleUnlockDiagnosticBadge = () => {
    setBadges(prev => prev.map(b => b.id === 'b1' ? { ...b, unlocked: true, unlockedAt: "Just Now" } : b));
  };

  // Toggle milestone checkbox on roadmap
  const handleToggleMilestone = (phaseId: number, milestoneId: string) => {
    setPhases(prev => {
      const updated = prev.map(phase => {
        if (phase.id !== phaseId) return phase;

        const updatedMilestones = phase.milestones.map(m => {
          if (m.id !== milestoneId) return m;
          return { ...m, completed: !m.completed };
        });

        return { ...phase, milestones: updatedMilestones };
      });

      // Recalculate milestone locks cascadingly (e.g. Phase 2 unlocks when Phase 1 overall progress hits > 50%)
      const phase1 = updated.find(p => p.id === 1);
      const phase1Completed = phase1?.milestones.filter(m => m.completed).length || 0;
      
      return updated.map(phase => {
        if (phase.id === 2) {
          const lockedState = phase1Completed < 2; // lock if less than 2 completed in Phase 1
          const updatedMilestones = phase.milestones.map(m => ({ ...m, locked: lockedState }));
          return { ...phase, milestones: updatedMilestones };
        }
        return phase;
      });
    });
  };

  // Add agile task
  const handleAddTask = (newTask: Omit<Task, 'id'>) => {
    const taskRecord: Task = {
      ...newTask,
      id: `t-${Date.now()}`
    };
    setTasks(prev => [taskRecord, ...prev]);

    // Badge Unlock: Agile Executor
    setBadges(prev => prev.map(b => b.id === 'b3' ? { ...b, unlocked: true, unlockedAt: "Just Now" } : b));
  };

  // Update task status from Kanban or table
  const handleUpdateTaskStatus = (taskId: string, status: TaskStatus) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: status } : t));
  };

  // Update task AI suggestion
  const handleUpdateTaskSuggestion = (taskId: string, suggestion: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, aiSuggestion: suggestion } : t));
  };

  // Delete task
  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  // Upload file inside data room
  const handleUploadDocument = (docId: string, name: string) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === docId ? { ...doc, name: name, status: 'Uploaded' } : doc
    ));
  };

  // Save audited document parameters
  const handleUpdateDocumentAnalysis = (docId: string, analysisData: any) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === docId ? { 
        ...doc, 
        score: analysisData.score, 
        generalFeedback: analysisData.generalFeedback,
        slideFeedback: analysisData.slideFeedback 
      } : doc
    ));
  };

  // AI Dialog messages hooks
  const handleAddMessage = (newMessage: Message) => {
    setMessages(prev => [...prev, newMessage]);
  };

  const handleUnlockArchiveBadge = () => {
    setBadges(prev => prev.map(b => b.id === 'b4' ? { ...b, unlocked: true, unlockedAt: "Just Now" } : b));
  };

  const handleUnlockAIBadge = () => {
    setBadges(prev => prev.map(b => b.id === 'b5' ? { ...b, unlocked: true, unlockedAt: "Just Now" } : b));
  };

  // Sidebar items definition
  const navItems = [
    { name: 'Home', icon: Home, tab: 'Home' },
    { name: 'Startup Diagnostic', icon: Activity, tab: 'Diagnostic' },
    { name: 'Roadmap Progress', icon: Flag, tab: 'Roadmap' },
    { name: 'Sprint Board', icon: CheckSquare, tab: 'Sprint' },
    { name: 'Document package', icon: FileText, tab: 'Documents' },
    { name: 'Gemini Copilot', icon: Sparkles, tab: 'Copilot' },
    { name: 'Ecosystem Vault', icon: Award, tab: 'Vault' },
    { name: 'Expert Mentors', icon: Users, tab: 'Mentors' },
    { name: 'Networking Feed', icon: MessageSquare, tab: 'Community' },
  ];

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-850'} flex font-sans antialiased transition-colors duration-300`}>
      
      {/* Drawer sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 bg-white dark:bg-dark-sidebar border-r border-slate-150 dark:border-dark-border transition-all duration-300 z-40 flex flex-col justify-between ${
          sidebarOpen ? 'w-64' : 'w-0 -translate-x-full md:w-20 md:translate-x-0'
        }`}
      >
        <div className="space-y-6 flex-1 py-5 flex flex-col">
          {/* Logo brand node */}
          <div className="px-5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-extrabold shadow-md shrink-0">
                S
              </div>
              {sidebarOpen && (
                <div className="font-display font-black text-xs tracking-tight text-slate-850 dark:text-white shrink-0">
                  SaaS Startup Hub
                </div>
              )}
            </div>
            {/* Collapse button */}
            <button 
              id="sidebar-toggle-aside"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-slate-400 hover:text-slate-600 md:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items list */}
          <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.tab;
              return (
                <button
                  key={item.tab}
                  id={`nav-link-${item.tab}`}
                  onClick={() => {
                    setCurrentTab(item.tab);
                    if (window.innerWidth < 768) {
                      setSidebarOpen(false);
                    }
                  }}
                  className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all select-none ${
                    isActive 
                      ? 'bg-indigo-600 text-white shadow-sm font-bold' 
                      : 'text-slate-500 hover:text-slate-850 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-900/40'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {sidebarOpen && <span className="truncate">{item.name}</span>}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User context footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-850 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 max-w-[150px] truncate">
            <div className="w-7 h-7 rounded-lg bg-indigo-505 dark:bg-slate-800 flex items-center justify-center font-bold text-xs truncate">
              F
            </div>
            {sidebarOpen && (
              <div className="text-[10px] space-y-0.5 truncate">
                <span className="font-extrabold block leading-none">Founder Hub</span>
                <span className="text-slate-400 block leading-none truncate">seed-cohort@startup.io</span>
              </div>
            )}
          </div>

          <button
            id="theme-switch"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-1.5 rounded-lg border border-slate-100 dark:border-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <div className={`flex-1 flex flex-col transition-all duration-300 min-w-0 ${
        sidebarOpen ? 'md:pl-64' : 'md:pl-20'
      }`}>
        
        {/* Top bar header */}
        <header className="h-16 border-b border-slate-150 dark:border-dark-border px-5 flex items-center justify-between shrink-0 bg-white/40 dark:bg-slate-950/20 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              id="sidebar-toggle-header"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-xl border border-slate-100 dark:border-slate-800 text-slate-400 hover:text-slate-600 block"
            >
              <Menu className="w-4 h-4" />
            </button>
            <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-400">
              <span className="capitalize">{currentTab}</span>
              <span className="text-slate-300">/</span>
              <span>Workspace Controller</span>
            </div>
          </div>

          {/* Core Level badge */}
          <div className="flex items-center gap-4">
            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-800 px-3 py-1.5 rounded-xl flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[10px] font-mono font-bold uppercase text-slate-500">Startup level: {Math.floor(assessment.overallScore / 20) + 1}</span>
            </div>
          </div>
        </header>

        {/* Swapped content boxes */}
        <main className="flex-1 p-6 overflow-y-auto">
          {currentTab === 'Home' && (
            <HomeDashboard 
              assessmentResult={assessment} 
              roadmapPhases={phases} 
              tasks={tasks}
              documents={documents}
              badges={badges}
              onNavigate={(tab) => setCurrentTab(tab)}
              onUnlockDiagnosticBadge={handleUnlockDiagnosticBadge}
            />
          )}

          {currentTab === 'Diagnostic' && (
            <StartupAssessment 
              onSaveAssessment={handleCompleteAssessment} 
              savedResult={assessment}
            />
          )}

          {currentTab === 'Roadmap' && (
            <StartupRoadmap 
              phases={phases}
              onToggleMilestone={handleToggleMilestone}
            />
          )}

          {currentTab === 'Sprint' && (
            <TasksExecution 
              tasks={tasks}
              onAddTask={handleAddTask}
              onUpdateTaskStatus={handleUpdateTaskStatus}
              onUpdateTaskSuggestion={handleUpdateTaskSuggestion}
              onDeleteTask={handleDeleteTask}
            />
          )}

          {currentTab === 'Documents' && (
            <PitchDeckDocuments 
              documents={documents}
              onUploadDocument={handleUploadDocument}
              onUpdateAnalysis={handleUpdateDocumentAnalysis}
              onUnlockArchiveBadge={handleUnlockArchiveBadge}
            />
          )}

          {currentTab === 'Copilot' && (
            <AICopilot 
              assessmentResult={assessment}
              messages={messages}
              onAddMessage={handleAddMessage}
              onUnlockAIBadge={handleUnlockAIBadge}
            />
          )}

          {currentTab === 'Vault' && (
            <AchievementVault 
              badges={badges}
              overallScore={assessment.overallScore}
              onNavigate={(tab) => setCurrentTab(tab)}
            />
          )}

          {currentTab === 'Mentors' && (
            <MentorSection 
              overallScore={assessment.overallScore}
            />
          )}

          {currentTab === 'Community' && (
            <CommunitySection />
          )}
        </main>

      </div>

    </div>
  );
}
