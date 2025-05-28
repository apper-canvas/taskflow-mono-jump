import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'
import TaskManager from './TaskManager/TaskManager'
import ProgressDashboard from './ProgressDashboard/ProgressDashboard'
import ApperIcon from './ApperIcon'

const MainFeature = () => {
  const [tasks, setTasks] = useState([
    {
      id: '1',
      title: 'Complete project proposal',
      description: 'Finalize the Q4 project proposal and submit to stakeholders',
      status: 'pending',
      priority: 'high',
      dueDate: new Date('2024-12-30'),
      projectId: 'work',
      completed: false,
      createdAt: new Date()
    },
    {
      id: '2',
      title: 'Review code documentation',
      description: 'Go through the API documentation and update outdated sections',
      status: 'in-progress',
      priority: 'medium',
      dueDate: new Date('2024-12-28'),
      projectId: 'work',
      completed: false,
      createdAt: new Date()
    },
    {
      id: '3',
      title: 'Plan weekend trip',
      description: 'Research destinations and book accommodations',
      status: 'completed',
      priority: 'low',
      dueDate: new Date('2024-12-25'),
      projectId: 'personal',
      completed: true,
      createdAt: new Date()
    },
    {
      id: '4',
      title: 'Learn React Advanced Patterns',
      description: 'Study advanced React patterns and implement in practice project',
      status: 'in-progress',
      priority: 'medium',
      dueDate: new Date('2024-12-29'),
      projectId: 'learning',
      completed: false,
      createdAt: new Date()
    },
    {
      id: '5',
      title: 'Prepare presentation slides',
      description: 'Create slides for quarterly business review meeting',
      status: 'pending',
      priority: 'high',
      dueDate: new Date('2024-12-31'),
      projectId: 'work',
      completed: false,
      createdAt: new Date()
    },
    {
      id: '6',
      title: 'Exercise routine',
      description: 'Complete 30-minute workout session',
      status: 'completed',
      priority: 'low',
      dueDate: new Date('2024-12-26'),
      projectId: 'personal',
      completed: true,
      createdAt: new Date()
    }
  ])

  const [viewMode, setViewMode] = useState('list')

  const taskManager = TaskManager({ tasks, setTasks })
  const { CalendarView, ListView, showTaskForm, setShowTaskForm, newTask, setNewTask, handleCreateTask, projects, priorities } = taskManager

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-surface-900 dark:text-surface-100">
            Task Management
          </h2>
          <p className="text-surface-600 dark:text-surface-400 mt-1">
            Organize and track your tasks efficiently
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setViewMode('dashboard')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              viewMode === 'dashboard'
                ? 'bg-primary text-white shadow-soft'
                : 'bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-400 hover:bg-surface-200 dark:hover:bg-surface-600'
            }`}
          >
            <ApperIcon name="BarChart3" className="h-4 w-4" />
            <span>Dashboard</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setViewMode('list')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              viewMode === 'list'
                ? 'bg-primary text-white shadow-soft'
                : 'bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-400 hover:bg-surface-200 dark:hover:bg-surface-600'
            }`}
          >
            <ApperIcon name="List" className="h-4 w-4" />
            <span>List</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setViewMode('calendar')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              viewMode === 'calendar'
                ? 'bg-primary text-white shadow-soft'
                : 'bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-400 hover:bg-surface-200 dark:hover:bg-surface-600'
            }`}
          >
            <ApperIcon name="Calendar" className="h-4 w-4" />
            <span>Calendar</span>
          </motion.button>
        </div>
        
        {viewMode !== 'dashboard' && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowTaskForm(true)}
            className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-xl font-semibold shadow-soft hover:shadow-card transition-all duration-200 flex items-center space-x-2"
          >
            <ApperIcon name="Plus" className="h-5 w-5" />
            <span>New Task</span>
          </motion.button>
        )}
      </motion.div>

      {/* Dashboard View */}
      {viewMode === 'dashboard' && <ProgressDashboard tasks={tasks} />}

      {/* Calendar View */}
      {viewMode === 'calendar' && <CalendarView />}

      {/* List View */}
      {viewMode === 'list' && <ListView />}

      {/* Task Creation Modal */}
      <AnimatePresence>
        {showTaskForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowTaskForm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-surface-800 rounded-2xl shadow-soft max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-surface-900 dark:text-surface-100">
                    Create New Task
                  </h3>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowTaskForm(false)}
                    className="text-surface-400 hover:text-surface-600 dark:hover:text-surface-300"
                  >
                    <ApperIcon name="X" className="h-6 w-6" />
                  </motion.button>
                </div>

                <form onSubmit={handleCreateTask} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Task Title *
                    </label>
                    <input
                      type="text"
                      value={newTask.title}
                      onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                      className="input-field"
                      placeholder="Enter task title..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Description
                    </label>
                    <textarea
                      value={newTask.description}
                      onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                      className="input-field resize-none"
                      rows="3"
                      placeholder="Add task description..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                        Priority
                      </label>
                      <select
                        value={newTask.priority}
                        onChange={(e) => setNewTask(prev => ({ ...prev, priority: e.target.value }))}
                        className="input-field"
                      >
                        {priorities.map(priority => (
                          <option key={priority.value} value={priority.value}>
                            {priority.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                        Project
                      </label>
                      <select
                        value={newTask.projectId}
                        onChange={(e) => setNewTask(prev => ({ ...prev, projectId: e.target.value }))}
                        className="input-field"
                      >
                        {projects.map(project => (
                          <option key={project.id} value={project.id}>
                            {project.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
                      className="input-field"
                      min={format(new Date(), 'yyyy-MM-dd')}
                    />
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => setShowTaskForm(false)}
                      className="flex-1 py-3 px-4 border border-surface-300 dark:border-surface-600 text-surface-700 dark:text-surface-300 rounded-xl font-medium hover:bg-surface-50 dark:hover:bg-surface-700 transition-all duration-200"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="flex-1 py-3 px-4 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-medium shadow-soft hover:shadow-card transition-all duration-200"
                    >
                      Create Task
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default MainFeature
