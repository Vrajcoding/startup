import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ClipboardCheck, 
  HelpCircle, 
  ChevronRight, 
  ChevronLeft, 
  RefreshCw, 
  ShieldCheck, 
  Sparkles,
  Info
} from 'lucide-react';
import { ASSESSMENT_QUESTIONS, AssessmentResult, Question } from '../types';

interface StartupAssessmentProps {
  onSaveAssessment: (result: AssessmentResult) => void;
  savedResult: AssessmentResult;
}

export default function StartupAssessment({ onSaveAssessment, savedResult }: StartupAssessmentProps) {
  // Assessment state
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState<boolean>(savedResult.overallScore > 0);

  const totalQuestions = ASSESSMENT_QUESTIONS.length;
  const activeQuestion = ASSESSMENT_QUESTIONS[currentIdx];

  const handleSelectOption = (score: number) => {
    setAnswers(prev => ({ ...prev, [activeQuestion.id]: score }));
    
    // Auto advance with tiny lag for nice user response feel
    setTimeout(() => {
      if (currentIdx < totalQuestions - 1) {
        setCurrentIdx(prev => prev + 1);
      }
    }, 250);
  };

  const handleBack = () => {
    if (currentIdx > 0) {
      setCurrentIdx(prev => prev - 1);
    }
  };

  const computeResults = () => {
    // Collect scores per category
    const categories: Record<string, { total: number; count: number }> = {
      problemValidation: { total: 0, count: 0 },
      customerValidation: { total: 0, count: 0 },
      productReadiness: { total: 0, count: 0 },
      marketOpportunity: { total: 0, count: 0 },
      businessModel: { total: 0, count: 0 },
      teamStrength: { total: 0, count: 0 },
      financialHealth: { total: 0, count: 0 },
      executionGrowth: { total: 0, count: 0 }
    };

    // Calculate baseline score per category based on answers (answers default to 5/10 if unanswered)
    ASSESSMENT_QUESTIONS.forEach(q => {
      const selectedScore = answers[q.id] !== undefined ? answers[q.id] : 5;
      categories[q.category].total += selectedScore;
      categories[q.category].count += 1;
    });

    // Normalize out of 100 for each category
    const problemValidation = Math.round((categories.problemValidation.total / (categories.problemValidation.count * 10)) * 100);
    const customerValidation = Math.round((categories.customerValidation.total / (categories.customerValidation.count * 10)) * 100);
    const productReadiness = Math.round((categories.productReadiness.total / (categories.productReadiness.count * 10)) * 100);
    const marketOpportunity = Math.round((categories.marketOpportunity.total / (categories.marketOpportunity.count * 10)) * 100);
    const businessModel = Math.round((categories.businessModel.total / (categories.businessModel.count * 10)) * 100);
    const teamStrength = Math.round((categories.teamStrength.total / (categories.teamStrength.count * 10)) * 100);
    const financialHealth = Math.round((categories.financialHealth.total / (categories.financialHealth.count * 10)) * 100);
    const executionGrowth = Math.round((categories.executionGrowth.total / (categories.executionGrowth.count * 10)) * 100);

    // Compute weighted average
    // Weights:
    // Problem Validation: 15%, Customer Validation: 20%, Product Readiness: 15%, Market: 10%, Model: 10%, Team: 10%, Finance: 10%, Execution: 10%
    const overallScore = Math.round(
      (problemValidation * 0.15) +
      (customerValidation * 0.20) +
      (productReadiness * 0.15) +
      (marketOpportunity * 0.10) +
      (businessModel * 0.10) +
      (teamStrength * 0.10) +
      (financialHealth * 0.10) +
      (executionGrowth * 0.10)
    );

    // Dynamic Diagnosis Builder
    let diagnosis = "";
    const recommendations: string[] = [];

    if (overallScore >= 80) {
      diagnosis = "Your startup possesses extremely robust commercial and engineering alignment. The core customer group is validated, feedback loops are intact, and the team shows strong modular execution structure. You are highly positioned to prepare documentation for seed funding dialogues.";
      recommendations.push(
        "Generate a slide-by-slide investor ready narrative with high stress testing on TAM.",
        "Refine bottom-up cash model matrices with active baseline and conservative forecast options.",
        "Onboard expert Payment or Venture advisors using Mentorship tokens."
      );
    } else if (overallScore >= 50) {
      diagnosis = "Your startup concept is well-structured and has basic product prototype validation. However, customer development and monetization frameworks remain unconfirmed. Focus on transition workflows and customer interview conversion telemetry before scaling channels.";
      recommendations.push(
        "Conduct 25 unbiased customer interviews targeting high-pain beachhead users.",
        "Build a lo-fi Figma interactive prototype to run user-testing metrics.",
        "Establish pricing trial options and validate immediate interest via LOIs or pilot commits."
      );
    } else {
      diagnosis = "Your startup is in the highly speculative incubation stage with unmapped assumptions. Your highest operational focus is defining a crisp beachhead group and ensuring their problem is verified with direct qualitative validation data.";
      recommendations.push(
        "Stop writing product software code immediately to avoid waste.",
        "Draft a target beachhead persona outlining their daily alternative workarounds.",
        "Conduct 15 open, non-sales problem discovery talks with target customers."
      );
    }

    const result: AssessmentResult = {
      problemValidation,
      customerValidation,
      productReadiness,
      marketOpportunity,
      businessModel,
      teamStrength,
      financialHealth,
      executionGrowth,
      overallScore,
      diagnosis,
      recommendations
    };

    onSaveAssessment(result);
    setShowResults(true);
  };

  const handleRetake = () => {
    setAnswers({});
    setCurrentIdx(0);
    setShowResults(false);
  };

  // Custom Radar Chart Geometry Computations
  const categoriesList = [
    { label: 'Problem Val.', key: 'problemValidation', value: showResults ? (savedResult.problemValidation || 0) : 0 },
    { label: 'Customer Val.', key: 'customerValidation', value: showResults ? (savedResult.customerValidation || 0) : 0 },
    { label: 'Product Ready', key: 'productReadiness', value: showResults ? (savedResult.productReadiness || 0) : 0 },
    { label: 'Market Opp.', key: 'marketOpportunity', value: showResults ? (savedResult.marketOpportunity || 0) : 0 },
    { label: 'Business Model', key: 'businessModel', value: showResults ? (savedResult.businessModel || 0) : 0 },
    { label: 'Team Strength', key: 'teamStrength', value: showResults ? (savedResult.teamStrength || 0) : 0 },
    { label: 'Financial Health', key: 'financialHealth', value: showResults ? (savedResult.financialHealth || 0) : 0 },
    { label: 'Execution', key: 'executionGrowth', value: showResults ? (savedResult.executionGrowth || 0) : 0 }
  ];

  const centerX = 160;
  const centerY = 160;
  const maxRadius = 110;
  const angleStep = (2 * Math.PI) / 8;

  // Build grid rings
  const ringCount = 4;
  const gridRings = Array.from({ length: ringCount }).map((_, idx) => {
    const r = (maxRadius / ringCount) * (idx + 1);
    const points = Array.from({ length: 9 }).map((_, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const x = centerX + r * Math.cos(angle);
      const y = centerY + r * Math.sin(angle);
      return `${x},${y}`;
    }).join(' ');
    return points;
  });

  // Category labels and lines
  const radialLinesAndLabels = categoriesList.map((cat, idx) => {
    const angle = idx * angleStep - Math.PI / 2;
    const xLine = centerX + maxRadius * Math.cos(angle);
    const yLine = centerY + maxRadius * Math.sin(angle);
    const xLabel = centerX + (maxRadius + 22) * Math.cos(angle);
    const yLabel = centerY + (maxRadius + 14) * Math.sin(angle);
    return { xLine, yLine, xLabel, yLabel, label: cat.label };
  });

  // Data Polygon Vertices
  const radarPoints = categoriesList.map((cat, idx) => {
    const angle = idx * angleStep - Math.PI / 2;
    const r = (cat.value / 100) * maxRadius;
    const x = centerX + r * Math.cos(angle);
    const y = centerY + r * Math.sin(angle);
    return `${x},${y}`;
  }).join(' ');

  const progressPercent = Math.round((Object.keys(answers).length / totalQuestions) * 100);

  return (
    <div id="startup-assessment" className="space-y-8 max-w-5xl mx-auto">
      {/* Tab Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-display font-extrabold tracking-tight text-slate-900 dark:text-white">
            Startup Assessment Diagnostic
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Formulate high-fidelity validation matrices across 15 operational segments.
          </p>
        </div>
        {showResults && (
          <button 
            id="retake-assessment-btn"
            onClick={handleRetake}
            className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-card hover:bg-slate-50 transition-all rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300"
          >
            <RefreshCw className="w-4 h-4 text-indigo-500" />
            Re-run Diagnostic
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {!showResults ? (
          /* Assessment Questions Wizard */
          <motion.div 
            key="wizard"
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-6 md:p-8 rounded-3xl shadow-sm space-y-6"
          >
            {/* Progress line */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-mono text-indigo-500 font-semibold uppercase">Question {currentIdx + 1} of {totalQuestions}</span>
                <span className="font-bold">{progressPercent}% Completed</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-indigo-600 h-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>

            {/* Question Text block */}
            <div className="py-4 space-y-3">
              <div className="inline-flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 py-1.5 px-3 rounded-full text-[11px] font-mono leading-none capitalize">
                <ClipboardCheck className="w-3.5 h-3.5" />
                Category: {activeQuestion.category.replace(/([A-Z])/g, ' $1').trim()}
              </div>
              <h3 className="text-xl md:text-2xl font-display font-extrabold text-slate-800 dark:text-white leading-tight">
                {activeQuestion.text}
              </h3>
            </div>

            {/* Answer Options Grid */}
            <div className="space-y-3 pt-2">
              {activeQuestion.options.map((option, idx) => {
                const isSelected = answers[activeQuestion.id] === option.score;
                return (
                  <button
                    key={idx}
                    id={`opt-${activeQuestion.id}-${idx}`}
                    onClick={() => handleSelectOption(option.score)}
                    className={`w-full text-left p-4 rounded-2xl border text-sm transition-all flex items-center justify-between group ${
                      isSelected 
                        ? 'border-indigo-600 bg-indigo-50/20 dark:bg-indigo-950/25 font-semibold text-indigo-700 dark:text-indigo-300' 
                        : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 bg-white dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 hover:translate-x-1'
                    }`}
                  >
                    <span>{option.label}</span>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ml-3 transition-colors ${
                      isSelected ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300 dark:border-slate-700 group-hover:border-slate-400'
                    }`}>
                      {isSelected && <div className="w-2.5 h-2.5 bg-white rounded-full"></div>}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Nav Row */}
            <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800/80">
              <button
                id="assess-back-btn"
                onClick={handleBack}
                disabled={currentIdx === 0}
                className={`flex items-center gap-1.5 px-4 py-2 border border-slate-100 dark:border-dark-border bg-white dark:bg-slate-900 rounded-xl text-xs font-semibold ${
                  currentIdx === 0 ? 'opacity-40 cursor-not-allowed text-slate-400' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                Previous Step
              </button>

              {currentIdx === totalQuestions - 1 && Object.keys(answers).length >= totalQuestions - 1 ? (
                <button
                  id="assess-submit-btn"
                  onClick={computeResults}
                  className="flex items-center gap-1.5 px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-xs font-semibold hover:-translate-y-0.5 transition-all shadow-md"
                >
                  <Sparkles className="w-4 h-4 text-indigo-400 dark:text-indigo-600 animate-pulse" />
                  Compile Diagnostics
                </button>
              ) : (
                <button
                  id="assess-next-btn"
                  onClick={() => currentIdx < totalQuestions - 1 && setCurrentIdx(prev => prev + 1)}
                  disabled={answers[activeQuestion.id] === undefined}
                  className={`flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    answers[activeQuestion.id] === undefined 
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed' 
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md'
                  }`}
                >
                  Next Question
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>
        ) : (
          /* Diagnosis Results Dashboard */
          <motion.div 
            key="results"
            initial={{ opacity: 0, scale: 0.98 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* Top Stat card */}
            <div className="lg:col-span-12 bg-slate-900 dark:bg-slate-950 text-white p-6 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center border border-slate-800 gap-6">
              <div className="space-y-1">
                <span className="text-[10px] font-mono tracking-widest text-indigo-400 uppercase">Assessment Complete</span>
                <h3 className="text-2xl font-display font-extrabold">Overall Audit Health Index</h3>
                <p className="text-xs text-slate-400 max-w-xl">
                  Constructed based on 15 core questions weighted across Problem Validation, Customer Development, Infrastructure, and Unit Economics.
                </p>
              </div>
              <div className="flex items-center gap-4 border-l md:border-l border-slate-800 pl-0 md:pl-8 shrink-0">
                <div className="text-center">
                  <span className="text-5xl font-display font-black tracking-tight text-white">{savedResult.overallScore}%</span>
                  <span className="text-[10px] font-mono text-slate-500 uppercase block mt-1">Weighted Health</span>
                </div>
              </div>
            </div>

            {/* Radar Visualizer */}
            <div className="lg:col-span-6 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-6 rounded-3xl flex flex-col justify-between shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-display font-bold text-slate-800 dark:text-slate-200">Execution Vector Radar</h4>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
                  <Info className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Max Radius: 100</span>
                </div>
              </div>

              {/* Render dynamic SVG Radar */}
              <div className="flex justify-center py-6 overflow-visible">
                <svg width="340" height="340" viewBox="0 0 320 320" className="overflow-visible select-none">
                  <defs>
                    <radialGradient id="radarGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0" />
                    </radialGradient>
                  </defs>

                  {/* Polygon Grid Rings */}
                  {gridRings.map((points, idx) => (
                    <polygon
                      key={idx}
                      points={points}
                      fill="transparent"
                      stroke="currentColor"
                      className="text-slate-100 dark:text-slate-800/80"
                      strokeWidth="1"
                    />
                  ))}

                  {/* Axis line spikes */}
                  {radialLinesAndLabels.map((line, idx) => (
                    <line
                      key={idx}
                      x1={centerX}
                      y1={centerY}
                      x2={line.xLine}
                      y2={line.yLine}
                      stroke="currentColor"
                      className="text-slate-150 dark:text-slate-800/60"
                      strokeWidth="1"
                      strokeDasharray="2 3"
                    />
                  ))}

                  {/* Glowing Radar Mesh Polygon Area */}
                  <polygon
                    points={radarPoints}
                    fill="url(#radarGlow)"
                    stroke="#6366f1"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]"
                  />

                  {/* Attribute Label Text tags */}
                  {radialLinesAndLabels.map((item, idx) => (
                    <text
                      key={idx}
                      x={item.xLabel}
                      y={item.yLabel}
                      textAnchor="middle"
                      alignmentBaseline="middle"
                      className="text-[9px] font-mono font-bold fill-slate-500 dark:fill-slate-400"
                    >
                      {item.label}
                    </text>
                  ))}

                  {/* Dot anchors */}
                  {categoriesList.map((cat, idx) => {
                    const angle = idx * angleStep - Math.PI / 2;
                    const r = (cat.value / 100) * maxRadius;
                    const x = centerX + r * Math.cos(angle);
                    const y = centerY + r * Math.sin(angle);
                    return (
                      <circle
                        key={idx}
                        cx={x}
                        cy={y}
                        r="3.5"
                        fill="#4f46e5"
                        stroke="#ffffff"
                        strokeWidth="1"
                        className="transition-all hover:scale-125 cursor-pointer"
                      />
                    );
                  })}
                </svg>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs border-t border-slate-100 dark:border-slate-800/80 pt-4 bg-slate-50 dark:bg-slate-900/40 p-4 rounded-2xl">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-indigo-500 shrink-0"></div>
                  <span className="text-slate-500">Validation Vectors</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-slate-200 dark:bg-slate-800 shrink-0"></div>
                  <span className="text-slate-500">Core baseline reference</span>
                </div>
              </div>
            </div>

            {/* Scorecard Category Bars */}
            <div className="lg:col-span-6 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-6 rounded-3xl shadow-sm space-y-6">
              <h4 className="font-display font-bold text-slate-800 dark:text-slate-200">Score Metrics Matrix</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
                {categoriesList.map((item, idx) => (
                  <div key={idx} className="space-y-1.5 border-b border-slate-50 dark:border-slate-900 pb-3 last:border-0 last:pb-0">
                    <div className="flex justify-between items-center text-xs font-medium">
                      <span className="text-slate-700 dark:text-slate-300">{item.label}</span>
                      <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{item.value}%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-indigo-600 h-full transition-all duration-1000"
                        style={{ width: `${item.value}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Security Banner Info */}
              <div className="flex gap-3 bg-indigo-50/20 dark:bg-indigo-950/15 border border-indigo-100/40 dark:border-indigo-900/30 p-4 rounded-2xl">
                <ShieldCheck className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h5 className="text-xs font-semibold text-indigo-900 dark:text-indigo-300">Continuous Assessment Logic</h5>
                  <p className="text-[11px] text-indigo-700/80 dark:text-indigo-400/80 leading-relaxed font-sans">
                    Your Startup diagnostic is fully integrated. Completing locked Roadmap sub-milestones and uploading validated pitch decks will recalculate and scale your scores automatically.
                  </p>
                </div>
              </div>
            </div>

            {/* Diagnosis & Recommendations Panel */}
            <div className="lg:col-span-12 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-6 rounded-3xl shadow-sm space-y-6">
              <div>
                <h4 className="text-lg font-display font-extrabold text-slate-800 dark:text-white mb-2">Startup Diagnosis</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{savedResult.diagnosis}</p>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800/80 pt-6 space-y-3">
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest block font-bold">Recommended Immediate Road Actions</span>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {savedResult.recommendations.map((reco, idx) => (
                    <div key={idx} className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 flex flex-col justify-between space-y-3">
                      <div className="space-y-1.5">
                        <span className="w-6 h-6 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-black">
                          {idx + 1}
                        </span>
                        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{reco}</p>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">Impact: High</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
