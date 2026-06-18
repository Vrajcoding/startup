import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Sparkles, 
  TrendingUp, 
  HelpCircle, 
  Clock, 
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  ChevronDown,
  Trash2,
  PieChart,
  Eye,
  RefreshCw,
  AlertTriangle,
  Layers,
  ArrowUpRight,
  Info
} from 'lucide-react';
import { DocumentInfo } from '../types';

interface PitchDeckDocumentsProps {
  documents: DocumentInfo[];
  onUploadDocument: (docId: string, name: string) => void;
  onUpdateAnalysis: (docId: string, data: any) => void;
  onUnlockArchiveBadge: () => void;
}

export default function PitchDeckDocuments({
  documents,
  onUploadDocument,
  onUpdateAnalysis,
  onUnlockArchiveBadge,
}: PitchDeckDocumentsProps) {
  const [analyzingDocId, setAnalyzingDocId] = useState<string | null>(null);
  const [selectedDocIdForFeedback, setSelectedDocIdForFeedback] = useState<string | null>("doc-1"); 
  const [selectedSlideIdx, setSelectedSlideIdx] = useState<number>(0);
  const [hoveredHotspot, setHoveredHotspot] = useState<string | null>(null);
  
  // Staged loading analytics simulation
  const [analysisStage, setAnalysisStage] = useState<number>(0);
  const [analysisProgress, setAnalysisProgress] = useState<number>(0);
  const [dragOverDocId, setDragOverDocId] = useState<string | null>(null);

  const STAGES = [
    "Opening archive package & parsing file signatures...",
    "Extracting metadata stream (PDF compression)...",
    "Running structural due diligence OCR models...",
    "Scanning competitive matrix and pricing anchors...",
    "Querying Gemini 3.5 Flash compliance matrices..."
  ];

  // Simulated file upload picker handler
  const handleSimulatedUpload = (docId: string) => {
    const defaultFileNames: Record<string, string> = {
      "doc-1": "Startup_Master_PitchDeck_v3.pdf",
      "doc-2": "Financial_Model_Baseline_2026.xlsx",
      "doc-3": "SaaS_Business_Plan_Abstract.docx",
      "doc-4": "TAM_SAM_Market_Research_Report.pdf",
      "doc-5": "Seed_Round_Investor_QA.pdf"
    };

    onUploadDocument(docId, defaultFileNames[docId]);
    setTimeout(() => {
      if (docId === "doc-1") {
        onUnlockArchiveBadge();
      }
    }, 400);
  };

  // call server-side analyzer endpoint
  const handleAnalyzeDocument = async (doc: DocumentInfo) => {
    if (doc.status === 'Empty') return;
    
    setAnalyzingDocId(doc.id);
    setAnalysisStage(0);
    setAnalysisProgress(0);

    // Multi-stage fake ticking progress bar for elite UI feel
    const interval = setInterval(() => {
      setAnalysisProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        const next = p + Math.floor(Math.random() * 15) + 3;
        const stageIndex = Math.min(Math.floor((next / 100) * STAGES.length), STAGES.length - 1);
        setAnalysisStage(stageIndex);
        return next > 100 ? 100 : next;
      });
    }, 350);

    try {
      const response = await fetch('/api/documents/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: doc.name, documentType: doc.type })
      });
      const data = await response.json();
      
      // Delay just a little bit to show the gorgeous progress tracker completed state
      setTimeout(() => {
        clearInterval(interval);
        setAnalysisProgress(100);
        if (data) {
          onUpdateAnalysis(doc.id, data);
          setSelectedDocIdForFeedback(doc.id);
          setSelectedSlideIdx(0);
        }
        setAnalyzingDocId(null);
      }, 1200);

    } catch (e) {
      console.error(e);
      clearInterval(interval);
      setAnalyzingDocId(null);
    }
  };

  const handleDragOver = (e: React.DragEvent, docId: string) => {
    e.preventDefault();
    setDragOverDocId(docId);
  };

  const handleDragLeave = () => {
    setDragOverDocId(null);
  };

  const handleDrop = (e: React.DragEvent, docId: string) => {
    e.preventDefault();
    setDragOverDocId(null);
    handleSimulatedUpload(docId);
  };

  const activeDocForFeedback = documents.find(d => d.id === selectedDocIdForFeedback);
  const uploadedCount = documents.filter(d => d.status !== 'Empty').length;
  const missingDocsList = documents.filter(d => d.status === 'Empty');

  // Render a live mockup illustration of any slide to provide an ultra-premium visual environment
  const renderSlideMockupCanvas = (slideTitle: string, slideNumber: number | string) => {
    const normalizedTitle = slideTitle.toLowerCase();
    
    if (normalizedTitle.includes('title') || normalizedTitle.includes('hook') || slideNumber === 1) {
      return (
        <div className="relative w-full h-[240px] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex flex-col justify-between p-6 text-white bg-radial from-indigo-950/40 via-slate-950 to-slate-950 shadow-inner">
          <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-br from-indigo-500/20 to-purple-500/0 rounded-full blur-2xl"></div>
          
          <div className="flex justify-between items-center z-10">
            <span className="text-[10px] font-mono tracking-widest text-indigo-400 font-bold">EXECUTIVE COVER</span>
            <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse"></div>
          </div>

          <div className="z-10 space-y-2 mt-4">
            <div className={`h-1.5 w-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded transition-all duration-300 ${hoveredHotspot === 'title' ? 'scale-110 shadow-lg' : ''}`}></div>
            <h1 className="text-xl md:text-2xl font-display font-extrabold tracking-tight">
              Alpha Group Pitch Deck
            </h1>
            <p className="text-[10px] text-slate-400 font-sans max-w-sm">
              Standard Seed-Tier funding request package for immediate validation reviews.
            </p>
          </div>

          <div className="border-t border-slate-900 pt-3 flex justify-between items-center text-[9px] text-slate-500 font-mono z-10">
            <span>CONFIDENTIAL DATA ROOM</span>
            <span>JUNE 2026 // v3.2</span>
          </div>

          {/* Hotspots */}
          <div 
            className="absolute top-[50%] left-[60%] cursor-crosshair group z-20"
            onMouseEnter={() => setHoveredHotspot('title')}
            onMouseLeave={() => setHoveredHotspot(null)}
          >
            <div className="w-4 h-4 bg-rose-500/30 border border-rose-500 rounded-full flex items-center justify-center animate-ping absolute"></div>
            <div className="w-4 h-4 bg-rose-500/80 border border-white rounded-full flex items-center justify-center text-[8px] text-white font-bold relative hover:scale-125 transition-transform">!</div>
            <div className="hidden group-hover:block absolute left-6 bottom-0 bg-slate-900 border border-rose-500/30 text-white rounded p-2 text-[10px] whitespace-nowrap shadow-xl">
              <span className="font-bold text-rose-400 block">Gap Trigger Point</span>
              Vague branding & visual tone.
            </div>
          </div>
        </div>
      );
    }

    if (normalizedTitle.includes('problem') || normalizedTitle.includes('discovery') || slideNumber === 2) {
      return (
        <div className="relative w-full h-[240px] bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 flex flex-col justify-between p-6 text-white shadow-inner">
          <span className="text-[10px] font-mono tracking-widest text-emerald-400 font-bold">BOTTLENECK ANALYTICS</span>
          
          <div className="grid grid-cols-2 gap-4 my-auto">
            <div className={`p-3 bg-slate-950/80 border border-slate-800/80 rounded-xl space-y-1.5 transition-transform duration-300 ${hoveredHotspot === 'problem' ? 'border-amber-500/30 -translate-y-1' : ''}`}>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                <span className="text-[10px] font-bold">Unconfirmed discovery</span>
              </div>
              <p className="text-[9px] text-slate-400 leading-relaxed font-sans">
                Founders often build MVPs before vetting non-biased workflows.
              </p>
            </div>

            <div className="p-3 bg-slate-950/80 border border-slate-800/80 rounded-xl space-y-1.5">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                <span className="text-[10px] font-bold">Competitor gaps</span>
              </div>
              <p className="text-[9px] text-slate-400 leading-relaxed font-sans">
                Legacy tools retain high overhead costs and slow API responses.
              </p>
            </div>
          </div>

          <div className="flex justify-between items-center text-[9px] text-slate-500 border-t border-slate-800/40 pt-2 font-mono">
            <span>TARGET AUDIENCE SYMPTOMS: 12H WASTED</span>
            <span className="text-rose-400 font-bold font-mono">CRITICAL FRICTION POINT</span>
          </div>

          {/* Hotspots */}
          <div 
            className="absolute top-[30%] right-[25%] cursor-crosshair group z-20"
            onMouseEnter={() => setHoveredHotspot('problem')}
            onMouseLeave={() => setHoveredHotspot(null)}
          >
            <div className="w-4 h-4 bg-rose-500/30 border border-rose-500 rounded-full flex items-center justify-center animate-ping absolute"></div>
            <div className="w-4 h-4 bg-rose-500/80 border border-white rounded-full flex items-center justify-center text-[8px] text-white font-bold relative hover:scale-125 transition-transform">!</div>
            <div className="hidden group-hover:block absolute left-6 bottom-0 bg-slate-900 border border-rose-500/30 text-white rounded p-2 text-[10px] whitespace-nowrap shadow-xl">
              <span className="font-bold text-rose-400 block">Gap Trigger Point</span>
              Missing quantified financial pain.
            </div>
          </div>
        </div>
      );
    }

    if (normalizedTitle.includes('model') || normalizedTitle.includes('subscription') || normalizedTitle.includes('economics') || slideNumber === 3) {
      return (
        <div className="relative w-full h-[240px] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex flex-col justify-between p-6 text-white shadow-inner">
          <span className="text-[10px] font-mono tracking-widest text-indigo-400 font-bold">COMMERCIAL ENGINE</span>
          
          <div className="grid grid-cols-3 gap-3 my-auto">
            {['Launch', 'Growth Pro', 'Enterprise'].map((tier, i) => (
              <div key={i} className={`p-2.5 bg-slate-900/60 border ${i === 1 ? 'border-indigo-500 bg-indigo-950/20' : 'border-slate-850'} rounded-lg text-center space-y-1`}>
                <span className="text-[9px] font-bold block text-slate-350">{tier}</span>
                <span className="text-[11px] font-mono font-extrabold text-white block">
                  {i === 0 ? '$49' : i === 1 ? '$149' : 'Custom'}
                </span>
                <span className="text-[7.5px] text-slate-500 block">per seat / mo</span>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center text-[8.5px] text-slate-400 bg-slate-900/40 p-2 rounded-lg border border-slate-900">
            <span className="flex items-center gap-1"><Info className="w-3 h-3 text-indigo-400" /> B2B pilot trials to commence in Q3</span>
            <span className="font-bold text-indigo-400">85% Gross Margin</span>
          </div>

          {/* Hotspots */}
          <div 
            className="absolute top-[20%] right-[38%] cursor-crosshair group z-20"
            onMouseEnter={() => setHoveredHotspot('economics')}
            onMouseLeave={() => setHoveredHotspot(null)}
          >
            <div className="w-4 h-4 bg-amber-500/30 border border-amber-500 rounded-full flex items-center justify-center animate-ping absolute"></div>
            <div className="w-4 h-4 bg-amber-500/80 border border-white rounded-full flex items-center justify-center text-[8px] text-white font-bold relative hover:scale-125 transition-transform">!</div>
            <div className="hidden group-hover:block absolute left-6 bottom-0 bg-slate-900 border border-amber-500/30 text-white rounded p-2 text-[10px] whitespace-nowrap shadow-xl">
              <span className="font-bold text-amber-400 block">Improvement Tip</span>
              Unvalidated pricing levels. Add target customer feedback logs.
            </div>
          </div>
        </div>
      );
    }

    // Default template fallback slide representation
    return (
      <div className="relative w-full h-[240px] bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 flex flex-col justify-between p-6 text-white shadow-inner">
        <span className="text-[10px] font-mono tracking-widest text-slate-400 font-bold uppercase">{slideTitle}</span>
        
        <div className="flex flex-col items-center justify-center my-auto space-y-2">
          <Layers className="w-8 h-8 text-indigo-500/80 animate-pulse-slow" />
          <p className="text-[10px] text-slate-400 font-sans max-w-xs text-center leading-relaxed">
            Live schematic structure rendered. Select surrounding sections to scan diagnostic feedback points.
          </p>
        </div>

        <div className="flex justify-between text-[9px] text-slate-500 border-t border-slate-800/40 pt-2 font-mono">
          <span>INVESTOR STRATEGY MATRIX</span>
          <span>SLIDE {slideNumber}</span>
        </div>
      </div>
    );
  };

  return (
    <div id="pitch-deck-documents" className="space-y-8 max-w-7xl mx-auto px-1">
      
      {/* Visual Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-6 rounded-3xl shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-indigo-650 dark:text-indigo-400">
            <ShieldCheck className="w-5 h-5" />
            <span className="text-[11px] font-mono font-bold tracking-widest uppercase">Secured Capital Portal</span>
          </div>
          <h2 className="text-3xl font-display font-extrabold tracking-tight text-slate-900 dark:text-white">
            Investor Data Room & AI Audit
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xl">
            Vette and enhance your startup due-diligence data package. Run deep, semantic-level, slide-by-slide analyses utilizing modern VC assessment frameworks.
          </p>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 px-4 py-3 rounded-2xl flex items-center gap-2.5">
            <div className="w-9 h-9 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center">
              <PieChart className="w-4 h-4" />
            </div>
            <div className="text-left">
              <span className="text-slate-400 block tracking-wider uppercase font-mono text-[9px]">Data Room Score</span>
              <span className="font-extrabold text-slate-800 dark:text-slate-200">
                {uploadedCount > 0 ? `${Math.round((uploadedCount / documents.length) * 100)}% Ready` : '0% Empty'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Data Room Files list + Scanning Loader / Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Capital due diligence checklists */}
        <div className="lg:col-span-4 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-6 rounded-3xl shadow-sm flex flex-col justify-between h-full space-y-6">
          <div className="space-y-4">
            <h3 className="font-display font-bold text-slate-855 dark:text-slate-200 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-indigo-500" />
              Completeness Checklist
            </h3>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold text-slate-500">
                <span>Active Vault Files</span>
                <span>{uploadedCount}/{documents.length}</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden relative">
                <div 
                  className="bg-indigo-600 h-full transition-all duration-500 ease-out"
                  style={{ width: `${(uploadedCount / documents.length) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-2.5 pt-2">
              {documents.map((doc) => {
                const isUploaded = doc.status !== 'Empty';
                return (
                  <div 
                    key={doc.id} 
                    className={`flex items-center justify-between border border-dashed rounded-xl p-3 transition-all duration-200 ${
                      isUploaded 
                        ? 'border-emerald-500/10 bg-emerald-500/5 text-emerald-950 dark:text-emerald-100' 
                        : 'border-slate-200 dark:border-slate-800 text-slate-500'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 max-w-[190px]">
                      {isUploaded ? (
                        <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                      )}
                      <div className="truncate">
                        <span className="text-xs font-semibold block leading-snug">{doc.type}</span>
                        <span className="text-[10px] text-slate-450 block truncate font-mono">
                          {isUploaded ? doc.name : 'Not yet uploaded'}
                        </span>
                      </div>
                    </div>
                    
                    {isUploaded ? (
                      <span className="text-[9px] font-mono font-bold uppercase bg-emerald-100 dark:bg-emerald-950/45 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded cursor-default">
                        Vetted
                      </span>
                    ) : (
                      <button 
                        id={`upload-trigger-list-${doc.id}`}
                        onClick={() => handleSimulatedUpload(doc.id)}
                        className="text-[9px] font-mono font-extrabold uppercase bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-md transition-all shrink-0 border border-slate-200 dark:border-slate-700 hover:border-indigo-200"
                      >
                        Mock Upload
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
            {missingDocsList.length === 0 ? (
              <p className="text-emerald-600 dark:text-emerald-450 font-bold flex items-center gap-1 bg-emerald-500/5 p-3 rounded-2xl border border-emerald-500/10">
                <CheckCircle className="w-4 h-4" />
                Diligence package fully loaded! You are readied for institutional pitch pipelines.
              </p>
            ) : (
              <p className="flex items-center gap-2 bg-amber-500/5 p-3 rounded-2xl border border-amber-500/10">
                <Info className="w-4 h-4 text-amber-500 shrink-0" />
                Missing {missingDocsList.length} items to unlock complete Seed checks.
              </p>
            )}
          </div>
        </div>

        {/* Right Side: Virtual Data Room Workspace Grid */}
        <div className="lg:col-span-8 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-6 rounded-3xl shadow-sm space-y-6">
          <div className="flex justify-between items-center pb-3 border-b border-slate-50 dark:border-slate-850">
            <h3 className="font-display font-black text-slate-800 dark:text-slate-100 text-lg">
              Virtual Repository
            </h3>
            <span className="text-[10px] font-mono text-slate-450 uppercase uppercase">Drag & Drop Supported</span>
          </div>

          {/* Interactive Document Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documents.map((doc) => {
              const isUploaded = doc.status !== 'Empty';
              const isAnalyzing = analyzingDocId === doc.id;
              const isSelected = selectedDocIdForFeedback === doc.id;

              return (
                <div 
                  key={doc.id}
                  id={`doc-card-${doc.id}`}
                  onDragOver={(e) => handleDragOver(e, doc.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, doc.id)}
                  className={`border rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 relative overflow-hidden group ${
                    isSelected 
                      ? 'border-indigo-650 bg-indigo-50/10 dark:bg-indigo-950/10 shadow-sm ring-1 ring-indigo-600/15' 
                      : dragOverDocId === doc.id
                      ? 'border-indigo-500 bg-indigo-500/5 scale-[1.01]'
                      : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 hover:-translate-y-0.5'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex gap-2.5 items-center">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        isUploaded 
                          ? 'bg-indigo-100/40 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400' 
                          : 'bg-slate-50 dark:bg-slate-900 text-slate-400'
                      }`}>
                        <FileText className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      </div>
                      <div className="space-y-0.5 max-w-[170px] truncate-all">
                        <h4 className="text-xs font-bold text-slate-850 dark:text-slate-100 flex items-center gap-1.5">
                          {doc.type}
                          {isUploaded && (
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          )}
                        </h4>
                        <span className="text-[10px] text-slate-450 block truncate font-mono">
                          {isUploaded ? doc.name : 'Missing file'}
                        </span>
                      </div>
                    </div>
                    
                    {isUploaded && doc.score !== undefined && (
                      <span className="text-[10px] bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-mono font-extrabold px-2 py-0.5 rounded-lg select-none">
                        {doc.score}% Standard
                      </span>
                    )}
                  </div>

                  {isUploaded ? (
                    <div className="flex justify-between items-center text-xs pt-3 border-t border-slate-50 dark:border-slate-900/40">
                      <span className="text-[10px] text-slate-400 font-mono">{doc.size || '1.8 MB'}</span>
                      <div className="flex gap-2">
                        {doc.score === undefined ? (
                          <button
                            id={`analyze-${doc.id}`}
                            onClick={() => handleAnalyzeDocument(doc)}
                            disabled={isAnalyzing}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-3 py-1.5 rounded-xl text-[10px] flex items-center gap-1 transition-all shadow-sm hover:scale-102"
                          >
                            <Sparkles className="w-3 h-3 text-indigo-200 animate-pulse" />
                            Analyze PDF
                          </button>
                        ) : (
                          <button
                            id={`view-feedback-${doc.id}`}
                            onClick={() => {
                              setSelectedDocIdForFeedback(doc.id);
                              setSelectedSlideIdx(0);
                            }}
                            className="font-bold px-3 py-1.5 rounded-xl text-[10px] border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-colors inline-flex items-center gap-1"
                          >
                            <Eye className="w-3 h-3 text-slate-400" />
                            Active Report
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <button
                      id={`upload-body-${doc.id}`}
                      onClick={() => handleSimulatedUpload(doc.id)}
                      className="w-full mt-2 py-2.5 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-center hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-all text-[10px] text-slate-550 dark:text-slate-400 font-semibold flex items-center justify-center gap-1"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      Upload Simulated {doc.type}
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Staged scanning overlay loader if analyzer is toggled */}
          <AnimatePresence>
            {analyzingDocId && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="bg-slate-950 border border-slate-800 text-white p-6 rounded-2xl flex flex-col items-center justify-center space-y-4 shadow-xl z-20 overflow-hidden relative min-h-[160px]"
              >
                <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl"></div>
                <div className="flex items-center gap-2 z-10">
                  <RefreshCw className="w-5 h-5 text-indigo-500 animate-spin" />
                  <span className="text-xs font-mono font-black tracking-widest text-indigo-400 uppercase">Interactive Machine Scan</span>
                </div>
                
                <div className="w-full max-w-md bg-slate-900 h-2.5 rounded-full overflow-hidden relative z-10 border border-slate-800">
                  <div 
                    className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full transition-all duration-300"
                    style={{ width: `${analysisProgress}%` }}
                  ></div>
                </div>

                <div className="text-center z-10 space-y-1">
                  <p className="text-xs font-mono font-bold text-slate-100">{STAGES[analysisStage]}</p>
                  <span className="text-[10px] text-slate-500 block font-mono">{analysisProgress}% Complete</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* Slide-by-slide feedback display panel */}
      {activeDocForFeedback && activeDocForFeedback.slideFeedback && !analyzingDocId && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-6 rounded-3xl shadow-sm space-y-6"
        >
          {/* Header */}
          <div className="border-b border-slate-50 dark:border-slate-850 pb-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 mb-1">
                <Sparkles className="w-4 h-4 animate-pulse" />
                <span className="text-[10px] font-mono tracking-widest font-extrabold uppercase block">Audit report published</span>
              </div>
              <h3 className="text-2xl font-display font-extrabold text-slate-850 dark:text-white">
                Slide-by-Slide Audit Room: {activeDocForFeedback.type}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-sans mt-0.5">
                Audit is based on institutional seed checklist standards. Click on individual slide cards to preview compliance hotspots.
              </p>
            </div>
            
            <div className="bg-indigo-500/5 hover:bg-indigo-500/10 border border-indigo-500/15 p-4 rounded-2xl text-center md:min-w-[150px]">
              <span className="text-[10px] font-mono text-indigo-500 uppercase font-extrabold block mb-0.5">Vetting score</span>
              <span className="text-3xl font-display font-black text-indigo-600 dark:text-indigo-400">{activeDocForFeedback.score}%</span>
            </div>
          </div>

          {/* General Feedback Box */}
          <div className="flex gap-3 bg-slate-50/50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-850 p-4 rounded-2xl items-start">
            <Info className="w-5 h-5 text-indigo-500 mt-0.5 shrink-0" />
            <p className="text-xs text-slate-650 dark:text-slate-300 font-medium leading-relaxed italic">
              “{activeDocForFeedback.generalFeedback}”
            </p>
          </div>

          {/* SPLIT SPLIT WORKSPACE AREA */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
            
            {/* Third 1 Column: Slide Card Items Checklist */}
            <div className="lg:col-span-3 space-y-2 max-h-[300px] lg:max-h-[340px] overflow-y-auto pr-1">
              <span className="text-[10px] font-mono text-slate-400 tracking-wider uppercase block mb-2">Section Slide deck</span>
              
              {activeDocForFeedback.slideFeedback.map((slide, idx) => {
                const isActive = selectedSlideIdx === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedSlideIdx(idx)}
                    className={`w-full text-left p-3 rounded-2xl transition-all border flex items-center justify-between gap-2 block ${
                      isActive 
                        ? 'bg-slate-900 border-slate-950 text-white shadow dark:bg-white dark:border-white dark:text-slate-900 font-semibold' 
                        : 'bg-slate-50/30 border-slate-100 dark:bg-slate-900/20 dark:border-slate-850 hover:bg-slate-50 hover:border-slate-200'
                    }`}
                  >
                    <div className="truncate space-y-0.5">
                      <span className={`text-[9px] font-mono tracking-widest uppercase block ${
                        isActive ? 'text-indigo-400 dark:text-indigo-650' : 'text-slate-400'
                      }`}>
                        Slide {slide.slide}
                      </span>
                      <h4 className="text-xs font-bold font-sans truncate">{slide.title}</h4>
                    </div>
                    <ArrowRight className="w-4 h-4 shrink-0 opacity-60" />
                  </button>
                );
              })}
            </div>

            {/* Third 2 Column: Dynamic Custom Rendered Slide Mockup */}
            <div className="lg:col-span-5 space-y-3">
              <span className="text-[10px] font-mono text-slate-400 tracking-wider uppercase block">Interactive Canvas Mockup</span>
              
              {activeDocForFeedback.slideFeedback[selectedSlideIdx] ? (
                renderSlideMockupCanvas(
                  activeDocForFeedback.slideFeedback[selectedSlideIdx].title, 
                  activeDocForFeedback.slideFeedback[selectedSlideIdx].slide
                )
              ) : (
                <div className="w-full h-[240px] bg-slate-900 rounded-2xl border border-slate-850 flex items-center justify-center p-6 text-white text-center">
                  <p className="text-xs text-slate-400 font-sans">No slide structure selected.</p>
                </div>
              )}
              
              <p className="text-[9.5px] text-slate-400 font-mono text-center flex items-center justify-center gap-1.5 bg-slate-50 dark:bg-slate-900/40 p-2 rounded-lg">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
                Interactive Hotspots active. Hover items to isolate recommendations instantly.
              </p>
            </div>

            {/* Third 3 Column: Detailed Selected Slide Audited feedback */}
            <div className="lg:col-span-4 bg-slate-50/30 dark:bg-slate-900/10 border border-slate-100 dark:border-slate-850 rounded-2xl p-4 flex flex-col justify-between h-full space-y-4">
              {activeDocForFeedback.slideFeedback[selectedSlideIdx] ? (
                <div className="space-y-3">
                  <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-150 dark:border-slate-800 shadow-sm">
                    <span className="text-[10px] font-mono font-bold text-indigo-500 dark:text-indigo-400 uppercase">
                      Slide {activeDocForFeedback.slideFeedback[selectedSlideIdx].slide}
                    </span>
                    <h4 className="text-xs font-bold text-slate-750 max-w-[160px] truncate">{activeDocForFeedback.slideFeedback[selectedSlideIdx].title}</h4>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[9px] font-mono text-emerald-600 block uppercase font-bold">Vetted Strengths</span>
                    <div className="space-y-1.5">
                      {activeDocForFeedback.slideFeedback[selectedSlideIdx].strengths.map((str, sIdx) => (
                        <div key={sIdx} className="flex gap-1.5 items-start bg-emerald-500/5 border border-emerald-500/10 p-1.5 rounded-lg">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span className="text-[10px] text-slate-600 dark:text-slate-300 leading-snug font-medium">{str}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[9px] font-mono text-rose-500 block uppercase font-bold">Flagged Gaps</span>
                    <div className="space-y-1.5">
                      {activeDocForFeedback.slideFeedback[selectedSlideIdx].gaps.map((gap, gIdx) => (
                        <div key={gIdx} className="flex gap-1.5 items-start bg-rose-500/5 border border-rose-500/10 p-1.5 rounded-lg cursor-help" onMouseEnter={() => setHoveredHotspot('problem')} onMouseLeave={() => setHoveredHotspot(null)}>
                          <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                          <span className="text-[10px] text-slate-600 dark:text-slate-350 leading-snug font-medium">{gap}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/15 p-3 rounded-2xl space-y-1">
                    <span className="text-[9px] font-mono text-amber-500 uppercase font-black tracking-wider block">Recommended Improvement Action</span>
                    <p className="text-[10.5px] text-slate-700 dark:text-slate-300 leading-relaxed font-sans font-medium">
                      {activeDocForFeedback.slideFeedback[selectedSlideIdx].improvements}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center text-slate-400">
                  <p className="text-xs font-sans">Wait...</p>
                </div>
              )}
            </div>

          </div>
        </motion.div>
      )}
    </div>
  );
}
