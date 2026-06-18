import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Trash2, 
  Wand2, 
  CheckSquare, 
  Clock, 
  User, 
  AlertCircle, 
  Sparkles, 
  Grid, 
  List, 
  Calendar as CalendarIcon,
  HelpCircle,
  TrendingUp,
  X
} from 'lucide-react';
import { Task, TaskStatus, TaskPriority } from '../types';

interface TasksExecutionProps {
  tasks: Task[];
  onAddTask: (task: Omit<Task, 'id'>) => void;
  onUpdateTaskStatus: (taskId: string, status: TaskStatus) => void;
  onUpdateTaskSuggestion: (taskId: string, suggestion: string) => void;
  onDeleteTask: (taskId: string) => void;
}

export default function TasksExecution({
  tasks,
  onAddTask,
  onUpdateTaskStatus,
  onUpdateTaskSuggestion,
  onDeleteTask
}: TasksExecutionProps) {
  // Views navigation
  const [activeView, setActiveView] = useState<'kanban' | 'matrix' | 'table'>('kanban');
  const [activeCategory, setActiveCategory] = useState<'all' | 'Daily' | 'Weekly' | 'Team'>('all');
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  
  // Selected detail task state
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [improvingTaskId, setImprovingTaskId] = useState<string | null>(null);

  // New task form state
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState<'Daily' | 'Weekly' | 'Team'>('Daily');
  const [newPriority, setNewPriority] = useState<TaskPriority>('Medium');
  const [newAssignee, setNewAssignee] = useState('');
  const [newDeadline, setNewDeadline] = useState('2026-06-25');

  const filteredTasks = tasks.filter(t => activeCategory === 'all' || t.category === activeCategory);

  // Kanban status columns
  const statuses: TaskStatus[] = ['To Do', 'In Progress', 'Review', 'Completed'];

  // Add Task handler
  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddTask({
      title: newTitle,
      description: newDesc,
      status: 'To Do',
      priority: newPriority,
      assignedTo: newAssignee || 'Unassigned',
      deadline: newDeadline,
      progress: 0,
      category: newCategory
    });

    // Reset Form
    setNewTitle('');
    setNewDesc('');
    setNewAssignee('');
    setModalOpen(false);
  };

  // call server-side AI task improve endpoint
  const handleEnhanceTask = async (task: Task) => {
    setImprovingTaskId(task.id);
    try {
      const response = await fetch('/api/tasks/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: task.title, description: task.description })
      });
      const data = await response.json();
      if (data.suggestion) {
        onUpdateTaskSuggestion(task.id, data.suggestion);
        // Sync selected state immediately
        setSelectedTask(prev => prev && prev.id === task.id ? { ...prev, aiSuggestion: data.suggestion } : prev);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setImprovingTaskId(null);
    }
  };

  return (
    <div id="tasks-execution" className="space-y-8 max-w-6xl mx-auto">
      {/* Task Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-display font-extrabold tracking-tight text-slate-900 dark:text-white">
            Tasks & Agile Sprints
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Map Eisenhower schedules, draft active sprint logs, and request AI optimization suggestions.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Sub Views Switches */}
          <div className="bg-slate-100 dark:bg-slate-900 p-1 rounded-xl flex border border-slate-200 dark:border-slate-800">
            <button 
              id="view-kanban"
              onClick={() => setActiveView('kanban')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 ${
                activeView === 'kanban' ? 'bg-white dark:bg-dark-card shadow-sm font-bold text-slate-850 dark:text-white' : 'text-slate-500'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              Kanban
            </button>
            <button 
              id="view-matrix"
              onClick={() => setActiveView('matrix')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 ${
                activeView === 'matrix' ? 'bg-white dark:bg-dark-card shadow-sm font-bold text-slate-850 dark:text-white' : 'text-slate-500'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              Priority Matrix
            </button>
            <button 
              id="view-table"
              onClick={() => setActiveView('table')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 ${
                activeView === 'table' ? 'bg-white dark:bg-dark-card shadow-sm font-bold text-slate-850 dark:text-white' : 'text-slate-500'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              Spreadsheet
            </button>
          </div>

          <button
            id="add-task-modal-btn"
            onClick={() => setModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-4 py-2 rounded-xl flex items-center gap-1 shadow-sm transition-all hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4" />
            Create Task
          </button>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex border-b border-slate-100 dark:border-slate-800">
        {['all', 'Daily', 'Weekly', 'Team'].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat as any)}
            className={`px-5 py-2.5 text-xs font-semibold border-b-2 -mb-px transition-colors ${
              activeCategory === cat 
                ? 'border-indigo-600 text-indigo-600 font-bold dark:text-indigo-400' 
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {cat === 'all' ? 'All Sprint Items' : `${cat} Tasks`}
          </button>
        ))}
      </div>

      {/* View Render logic */}
      <AnimatePresence mode="wait">
        {activeView === 'kanban' && (
          /* Kanban Board layout */
          <motion.div 
            key="kanban"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6"
          >
            {statuses.map((status) => {
              const statusTasks = filteredTasks.filter(t => t.status === status);
              return (
                <div key={status} className="bg-slate-50/55 dark:bg-slate-900/40 p-4 rounded-3xl border border-slate-100 dark:border-slate-850 flex flex-col min-h-[500px]">
                  <div className="flex justify-between items-center mb-4 px-1.5">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{status}</span>
                    <span className="text-[10px] bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded-full font-mono font-bold text-slate-500">
                      {statusTasks.length}
                    </span>
                  </div>

                  <div className="space-y-4 flex-1 overflow-y-auto max-h-[600px] pr-1">
                    {statusTasks.length === 0 ? (
                      <div className="text-center py-10 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-slate-400">
                        No tasks here
                      </div>
                    ) : (
                      statusTasks.map((task) => (
                        <div
                          key={task.id}
                          id={`task-card-${task.id}`}
                          onClick={() => setSelectedTask(task)}
                          className="bg-white dark:bg-dark-card border border-slate-150 dark:border-slate-850 p-4 rounded-2xl shadow-sm hover:shadow-md hover:border-indigo-600/20 hover:scale-[1.01] transition-all cursor-pointer space-y-3"
                        >
                          <div className="flex justify-between items-start gap-2">
                            <span className="text-[10px] font-mono text-indigo-500 uppercase tracking-wide font-semibold">{task.category}</span>
                            <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-semibold ${
                              task.priority === 'High' ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' :
                              task.priority === 'Medium' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                              'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20'
                            }`}>
                              {task.priority}
                            </span>
                          </div>

                          <h4 className="text-xs font-bold text-slate-800 dark:text-white line-clamp-2">
                            {task.title}
                          </h4>

                          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 font-sans font-normal">
                            {task.description}
                          </p>

                          {task.aiSuggestion && (
                            <div className="flex items-center gap-1 bg-violet-50/50 dark:bg-violet-950/10 text-[10px] font-medium text-violet-700 dark:text-violet-400 p-2 rounded-xl">
                              <Sparkles className="w-3 h-3 text-violet-500 animate-pulse" />
                              <span className="truncate">Ready with AI Refinement</span>
                            </div>
                          )}

                          <div className="flex justify-between items-center pt-2.5 border-t border-slate-100 dark:border-slate-800/80 text-[10px] text-slate-400 font-medium">
                            <div className="flex items-center gap-1.5">
                              <User className="w-3.5 h-3.5 text-slate-400" />
                              <span>{task.assignedTo}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{task.deadline}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}

        {activeView === 'matrix' && (
          /* Eisenhower priority Matrix */
          <motion.div 
            key="matrix"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Quadrant 1: Urgent & Important (High Priority) */}
            <div className="bg-rose-500/5 border border-rose-500/15 p-6 rounded-3xl space-y-4">
              <div className="flex justify-between items-center border-b border-rose-500/10 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div>
                  <h3 className="font-display font-extrabold text-sm text-slate-800 dark:text-white">Q1: Immediate Execution</h3>
                </div>
                <span className="text-[10px] font-mono text-rose-500 uppercase font-bold">Urgent & Important</span>
              </div>
              <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {filteredTasks.filter(t => t.priority === 'High' && t.status !== 'Completed').map(task => (
                  <div key={task.id} onClick={() => setSelectedTask(task)} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-3.5 rounded-xl flex justify-between items-center cursor-pointer hover:translate-x-0.5 transition-transform shadow-sm">
                    <span className="text-xs font-semibold truncate max-w-sm">{task.title}</span>
                    <span className="text-[10px] font-mono text-slate-400 shrink-0 ml-2">{task.assignedTo}</span>
                  </div>
                ))}
                {filteredTasks.filter(t => t.priority === 'High' && t.status !== 'Completed').length === 0 && (
                  <div className="text-center py-10 text-slate-400 font-sans text-xs">No immediate urgent blockers logged.</div>
                )}
              </div>
            </div>

            {/* Quadrant 2: Important, Not Urgent (Medium Priority) */}
            <div className="bg-indigo-55/5 border border-indigo-500/15 p-6 rounded-3xl space-y-4">
              <div className="flex justify-between items-center border-b border-indigo-500/10 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
                  <h3 className="font-display font-extrabold text-sm text-slate-800 dark:text-white">Q2: Strategic Development</h3>
                </div>
                <span className="text-[10px] font-mono text-indigo-500 uppercase font-bold">Important & Not Urgent</span>
              </div>
              <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {filteredTasks.filter(t => t.priority === 'Medium' && t.status !== 'Completed').map(task => (
                  <div key={task.id} onClick={() => setSelectedTask(task)} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-3.5 rounded-xl flex justify-between items-center cursor-pointer hover:translate-x-0.5 transition-transform shadow-sm">
                    <span className="text-xs font-semibold truncate max-w-sm">{task.title}</span>
                    <span className="text-[10px] font-mono text-slate-400 shrink-0 ml-2">{task.assignedTo}</span>
                  </div>
                ))}
                {filteredTasks.filter(t => t.priority === 'Medium' && t.status !== 'Completed').length === 0 && (
                  <div className="text-center py-10 text-slate-400 font-sans text-xs">No medium strategic objectives listed.</div>
                )}
              </div>
            </div>

            {/* Quadrant 3: Urgent, Not Important (Low Priority in Done/Review status) */}
            <div className="bg-amber-500/5 border border-amber-500/15 p-6 rounded-3xl space-y-4">
              <div className="flex justify-between items-center border-b border-amber-500/10 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                  <h3 className="font-display font-extrabold text-sm text-slate-800 dark:text-white">Q3: Delegation & Support</h3>
                </div>
                <span className="text-[10px] font-mono text-amber-500 uppercase font-bold">Urgent but Low Impact</span>
              </div>
              <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {filteredTasks.filter(t => t.priority === 'Low' && t.status !== 'Completed').map(task => (
                  <div key={task.id} onClick={() => setSelectedTask(task)} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-3.5 rounded-xl flex justify-between items-center cursor-pointer hover:translate-x-0.5 transition-transform shadow-sm">
                    <span className="text-xs font-semibold truncate max-w-sm">{task.title}</span>
                    <span className="text-[10px] font-mono text-slate-400 shrink-0 ml-2">{task.assignedTo}</span>
                  </div>
                ))}
                {filteredTasks.filter(t => t.priority === 'Low' && t.status !== 'Completed').length === 0 && (
                  <div className="text-center py-10 text-slate-400 font-sans text-xs">No secondary support tasks mapped.</div>
                )}
              </div>
            </div>

            {/* Quadrant 4: Eliminations & Archival (Completed items) */}
            <div className="bg-emerald-500/5 border border-emerald-500/15 p-6 rounded-3xl space-y-4">
              <div className="flex justify-between items-center border-b border-emerald-500/10 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                  <h3 className="font-display font-extrabold text-sm text-slate-800 dark:text-white">Q4: Archival Done Items</h3>
                </div>
                <span className="text-[10px] font-mono text-emerald-500 uppercase font-bold">Safe Accomplished Blocks</span>
              </div>
              <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {filteredTasks.filter(t => t.status === 'Completed').map(task => (
                  <div key={task.id} onClick={() => setSelectedTask(task)} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-3.5 rounded-xl flex justify-between items-center cursor-pointer hover:translate-x-0.5 transition-transform shadow-sm opacity-60">
                    <span className="text-xs font-semibold truncate line-through max-w-sm">{task.title}</span>
                    <span className="text-[10px] font-mono text-emerald-500 font-semibold uppercase">Completed</span>
                  </div>
                ))}
                {filteredTasks.filter(t => t.status === 'Completed').length === 0 && (
                  <div className="text-center py-10 text-slate-400 font-sans text-xs">Move some tasks to completed status to fill your done log.</div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {activeView === 'table' && (
          /* Spreadsheet List view */
          <motion.div 
            key="table"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-2xl overflow-hidden shadow-sm"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900 text-slate-400 font-mono text-[10px] uppercase border-b border-slate-150 dark:border-slate-800">
                    <th className="p-4">Task Name</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Priority</th>
                    <th className="p-4">Owner</th>
                    <th className="p-4">Date Constraint</th>
                    <th className="p-4 text-right">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.map(task => (
                    <tr key={task.id} className="border-b last:border-0 border-slate-100 dark:border-slate-850 hover:bg-slate-50/50">
                      <td className="p-4 font-bold text-slate-800 dark:text-slate-100">
                        <button onClick={() => setSelectedTask(task)} className="text-left font-semibold text-xs hover:text-indigo-600 transition-colors">
                          {task.title}
                        </button>
                      </td>
                      <td className="p-4 text-slate-500 font-medium">{task.category}</td>
                      <td className="p-4">
                        <select
                          id={`status-selector-${task.id}`}
                          value={task.status}
                          onChange={(e) => onUpdateTaskStatus(task.id, e.target.value as TaskStatus)}
                          className="bg-slate-55 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1.5 rounded-lg text-xs"
                        >
                          <option value="To Do">To Do</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Review">Review</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded font-mono text-[9px] font-bold ${
                          task.priority === 'High' ? 'bg-rose-500/10 text-rose-500' :
                          task.priority === 'Medium' ? 'bg-amber-500/10 text-indigo-500' :
                          'bg-indigo-500/10 text-indigo-500'
                        }`}>
                          {task.priority}
                        </span>
                      </td>
                      <td className="p-4 font-medium text-slate-600 dark:text-slate-350">{task.assignedTo}</td>
                      <td className="p-4 font-mono text-slate-400">{task.deadline}</td>
                      <td className="p-4 text-right">
                        <button 
                          id={`del-task-${task.id}`}
                          onClick={() => onDeleteTask(task.id)}
                          className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Task Creation Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-dark-card border border-slate-250 dark:border-dark-border p-6 rounded-3xl max-w-md w-full shadow-xl space-y-6"
            >
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="font-display font-extrabold text-sm text-slate-800 dark:text-white">Create Sprint Log</h3>
                <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateTask} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">Task Title</label>
                  <input
                    id="new-task-title-input"
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Conduct interview questionnaire..."
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-dark-border bg-slate-50 dark:bg-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block block">Description</label>
                  <textarea
                    id="new-task-desc-input"
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="Provide micro actions details..."
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-dark-border bg-slate-50 dark:bg-slate-900 h-20 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-400 uppercase block">Category</label>
                    <select
                      id="new-task-category-select"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as any)}
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-dark-border bg-slate-50 dark:bg-slate-900"
                    >
                      <option value="Daily">Daily</option>
                      <option value="Weekly">Weekly</option>
                      <option value="Team">Team</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-400 uppercase block">Priority</label>
                    <select
                      id="new-task-priority-select"
                      value={newPriority}
                      onChange={(e) => setNewPriority(e.target.value as any)}
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-dark-border bg-slate-50 dark:bg-slate-900"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-400 uppercase block">Assigned Owner</label>
                    <input
                      id="new-task-owner"
                      type="text"
                      value={newAssignee}
                      onChange={(e) => setNewAssignee(e.target.value)}
                      placeholder="e.g. Karan"
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-dark-border bg-slate-50 dark:bg-slate-900"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-400 uppercase block">Deadline Date</label>
                    <input
                      id="new-task-date"
                      type="date"
                      value={newDeadline}
                      onChange={(e) => setNewDeadline(e.target.value)}
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-dark-border bg-slate-50 dark:bg-slate-900"
                    />
                  </div>
                </div>

                <button
                  id="new-task-submit"
                  type="submit"
                  className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-3 rounded-xl text-xs font-semibold hover:bg-slate-800 block shadow-md pt-3.5"
                >
                  Create Task
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Task Detail inspect drawer/modal */}
      <AnimatePresence>
        {selectedTask && (
          <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-dark-card border border-slate-250 dark:border-dark-border p-6 rounded-3xl max-w-xl w-full shadow-2xl space-y-6"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-indigo-500 uppercase font-bold tracking-wider">{selectedTask.category} Task</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-350 mt-0.5"></span>
                    <span className="text-[10px] font-mono uppercase text-slate-400">ID: {selectedTask.id}</span>
                  </div>
                  <h3 className="text-lg font-display font-black text-slate-900 dark:text-white leading-snug">{selectedTask.title}</h3>
                </div>
                <button onClick={() => setSelectedTask(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Details & Context</span>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">{selectedTask.description}</p>
              </div>

              {/* Status control */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                <div className="space-y-1">
                  <span className="text-[9px] font-mono text-slate-400 uppercase">Status</span>
                  <select
                    id="detail-task-status"
                    value={selectedTask.status}
                    onChange={(e) => {
                      onUpdateTaskStatus(selectedTask.id, e.target.value as TaskStatus);
                      setSelectedTask(prev => prev ? { ...prev, status: e.target.value as TaskStatus } : null);
                    }}
                    className="w-full bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 p-1 rounded-xl text-xs font-semibold"
                  >
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Review">Review</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div className="space-y-0.5 text-xs">
                  <span className="text-[9px] font-mono text-slate-400 uppercase block">Priority</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 block pt-1.5 leading-none">{selectedTask.priority}</span>
                </div>

                <div className="space-y-0.5 text-xs">
                  <span className="text-[9px] font-mono text-slate-400 uppercase block">Assignee</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 block pt-1.5 leading-none">{selectedTask.assignedTo}</span>
                </div>

                <div className="space-y-0.5 text-xs">
                  <span className="text-[9px] font-mono text-slate-400 uppercase block">Deadline</span>
                  <span className="font-extrabold font-mono text-indigo-600 dark:text-indigo-400 block pt-1.5 leading-none">{selectedTask.deadline}</span>
                </div>
              </div>

              {/* Server-Side AIuggestion Container */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">AI Improvement Advisor Guidance</span>
                  <button
                    id="enhance-task-btn"
                    onClick={() => handleEnhanceTask(selectedTask)}
                    disabled={improvingTaskId !== null}
                    className="bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-600 dark:text-indigo-400 px-3 py-1.5 rounded-xl text-[10px] font-semibold flex items-center gap-1 transition-all"
                  >
                    <Wand2 className={`w-3 h-3 ${improvingTaskId ? 'animate-spin' : ''}`} />
                    {improvingTaskId ? 'Optimizing Task...' : 'Refine Task with Gemini'}
                  </button>
                </div>

                <div className="bg-gradient-to-tr from-slate-50 to-indigo-50/20 dark:from-slate-900/40 dark:to-indigo-950/20 border border-indigo-100/40 dark:border-indigo-900/30 p-4 rounded-2xl relative overflow-hidden">
                  <div className="absolute top-2 right-2 text-indigo-400 opacity-20">
                    <Sparkles className="w-8 h-8 animate-pulse-slow" />
                  </div>

                  {selectedTask.aiSuggestion ? (
                    <p className="text-xs text-indigo-900/90 dark:text-indigo-300/95 leading-relaxed font-sans italic">
                      “{selectedTask.aiSuggestion}”
                    </p>
                  ) : (
                    <div className="text-center py-4 space-y-1">
                      <HelpCircle className="w-6 h-6 text-indigo-300 dark:text-indigo-800 mx-auto" />
                      <p className="text-[11px] text-slate-400">Click the wand button to analyze details and generate quantitative, results-safe micro metrics.</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex justify-end">
                <button 
                  id="close-selected-details"
                  onClick={() => setSelectedTask(null)}
                  className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-2 rounded-xl text-xs font-semibold block"
                >
                  Close Inspection
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
