import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { format, isToday, isPast, isTomorrow, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns'

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
    }
  ])

  const [viewMode, setViewMode] = useState('list')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)

  const [showTaskForm, setShowTaskForm] = useState(false)
  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('dueDate')
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    projectId: 'work'
  })

  const projects = [
    { id: 'work', name: 'Work Tasks', color: 'bg-blue-500' },
    { id: 'personal', name: 'Personal', color: 'bg-green-500' },
    { id: 'learning', name: 'Learning', color: 'bg-purple-500' }
  ]

  const priorities = [
    { value: 'high', label: 'High Priority', color: 'text-red-600' },
    { value: 'medium', label: 'Medium Priority', color: 'text-yellow-600' },
    { value: 'low', label: 'Low Priority', color: 'text-green-600' }
  ]

  const filters = [
    { value: 'all', label: 'All Tasks', icon: 'List' },
    { value: 'pending', label: 'Pending', icon: 'Clock' },
    { value: 'in-progress', label: 'In Progress', icon: 'Play' },
    { value: 'completed', label: 'Completed', icon: 'CheckCircle' },
    { value: 'overdue', label: 'Overdue', icon: 'AlertTriangle' }
  ]

  const filteredTasks = tasks
    .filter(task => {
      if (filter === 'all') return true
      if (filter === 'overdue') return isPast(task.dueDate) && !task.completed
      return task.status === filter
    })
    .sort((a, b) => {
      if (sortBy === 'dueDate') return new Date(a.dueDate) - new Date(b.dueDate)
      if (sortBy === 'priority') {
        const priorityOrder = { high: 3, medium: 2, low: 1 }
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      }
      return new Date(b.createdAt) - new Date(a.createdAt)
    })

  const handleCreateTask = (e) => {
    e.preventDefault()
    if (!newTask.title.trim()) {
      toast.error('Task title is required')
      return
    }

    const task = {
      id: Date.now().toString(),
      ...newTask,
      dueDate: new Date(newTask.dueDate),
      status: 'pending',
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    setTasks(prev => [...prev, task])
    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: '',
      projectId: 'work'
    })
    setShowTaskForm(false)
    toast.success('Task created successfully!')
  }

  const toggleTaskComplete = (taskId) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        const updated = {
          ...task,
          completed: !task.completed,
          status: !task.completed ? 'completed' : 'pending',
          updatedAt: new Date()
        }
        toast.success(updated.completed ? 'Task completed!' : 'Task reopened!')
        return updated
      }
      return task
    }))
  }

  const deleteTask = (taskId) => {
    setTasks(prev => prev.filter(task => task.id !== taskId))
    toast.success('Task deleted successfully!')
  }

  const getDateLabel = (date) => {
    if (isToday(date)) return 'Today'
    if (isTomorrow(date)) return 'Tomorrow'
    if (isPast(date)) return 'Overdue'
    return format(date, 'MMM dd, yyyy')
  }

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'high': return 'priority-high'
      case 'medium': return 'priority-medium'
      case 'low': return 'priority-low'
      default: return ''
    }
  }

  const getProjectColor = (projectId) => {
    const project = projects.find(p => p.id === projectId)
    return project?.color || 'bg-gray-500'
  }

  const getTasksForDate = (date) => {
    return tasks.filter(task => isSameDay(new Date(task.dueDate), date))
  }

  const getCalendarDays = () => {
    const start = startOfWeek(startOfMonth(currentDate))
    const end = endOfWeek(endOfMonth(currentDate))
    return eachDayOfInterval({ start, end })
  }

  const navigateMonth = (direction) => {
    if (direction === 'prev') {
      setCurrentDate(subMonths(currentDate, 1))
    } else {
      setCurrentDate(addMonths(currentDate, 1))
    }
  }

  const handleDateClick = (date) => {
    setSelectedDate(date)
    const tasksOnDate = getTasksForDate(date)
    if (tasksOnDate.length === 0) {
      setNewTask(prev => ({
        ...prev,
        dueDate: format(date, 'yyyy-MM-dd')
      }))
      setShowTaskForm(true)
    }
  }

  const CalendarView = () => {
    const calendarDays = getCalendarDays()
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Calendar Header */}
        <div className="flex items-center justify-between">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigateMonth('prev')}
            className="calendar-nav-button"
          >
            <ApperIcon name="ChevronLeft" className="h-5 w-5 text-surface-700 dark:text-surface-300" />
          </motion.button>
          
          <h3 className="text-xl font-bold text-surface-900 dark:text-surface-100">
            {format(currentDate, 'MMMM yyyy')}
          </h3>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigateMonth('next')}
            className="calendar-nav-button"
          >
            <ApperIcon name="ChevronRight" className="h-5 w-5 text-surface-700 dark:text-surface-300" />
          </motion.button>
        </div>

        {/* Calendar Grid */}
        <div className="calendar-grid">
          {/* Week headers */}
          {weekDays.map(day => (
            <div key={day} className="calendar-header">
              {day}
            </div>
          ))}
          
          {/* Calendar days */}
          {calendarDays.map((day, index) => {
            const tasksOnDate = getTasksForDate(day)
            const isCurrentMonth = isSameMonth(day, currentDate)
            const isCurrentDay = isToday(day)
            const isSelected = selectedDate && isSameDay(day, selectedDate)
            
            return (
              <motion.div
                key={day.toString()}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.01 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleDateClick(day)}
                className={`calendar-date ${
                  isCurrentDay ? 'calendar-date-today' : ''
                } ${
                  !isCurrentMonth ? 'calendar-date-other-month' : ''
                } ${
                  isSelected ? 'calendar-date-selected' : ''
                }`}
              >
                <div className="flex flex-col h-full">
                  <span className="text-sm font-medium">{format(day, 'd')}</span>
                  
                  {/* Task indicators */}
                  {tasksOnDate.length > 0 && (
                    <div className="flex-1 flex flex-col justify-end">
                      <div className="flex flex-wrap gap-1 mt-1">
                        {tasksOnDate.slice(0, 3).map((task, taskIndex) => (
                          <div
                            key={task.id}
                            className={`w-2 h-2 rounded-full ${
                              task.priority === 'high' ? 'bg-red-500' :
                              task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            title={task.title}
                          />
                        ))}
                      </div>
                      
                      {tasksOnDate.length > 3 && (
                        <div className="calendar-task-count">
                          {tasksOnDate.length}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Selected Date Tasks */}
        {selectedDate && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
                Tasks for {format(selectedDate, 'MMMM d, yyyy')}
              </h4>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedDate(null)}
                className="text-surface-400 hover:text-surface-600 dark:hover:text-surface-300"
              >
                <ApperIcon name="X" className="h-5 w-5" />
              </motion.button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {getTasksForDate(selectedDate).map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`task-card p-4 ${getPriorityClass(task.priority)} ${task.completed ? 'task-card-completed' : ''}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2 flex-1">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => toggleTaskComplete(task.id)}
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                          task.completed
                            ? 'bg-accent border-accent text-white'
                            : 'border-surface-300 dark:border-surface-600 hover:border-accent'
                        }`}
                      >
                        {task.completed && <ApperIcon name="Check" className="h-3 w-3" />}
                      </motion.button>
                      
                      <h5 className={`font-medium text-sm text-surface-900 dark:text-surface-100 ${task.completed ? 'line-through opacity-60' : ''}`}>
                        {task.title}
                      </h5>
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => deleteTask(task.id)}
                      className="text-surface-400 hover:text-red-500 transition-colors duration-200"
                    >
                      <ApperIcon name="Trash2" className="h-3 w-3" />
                    </motion.button>
                  </div>
                  
                  {task.description && (
                    <p className="text-xs text-surface-600 dark:text-surface-400 mb-2">
                      {task.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-1">
                      <div className={`w-2 h-2 rounded-full ${getProjectColor(task.projectId)}`} />
                      <span className="text-surface-500 dark:text-surface-400">
                        {projects.find(p => p.id === task.projectId)?.name}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <div className={`w-2 h-2 rounded-full ${
                        task.priority === 'high' ? 'bg-red-500' :
                        task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                      }`} />
                      <span className="text-surface-500 capitalize">{task.priority}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {getTasksForDate(selectedDate).length === 0 && (
                <div className="col-span-2 text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 bg-surface-100 dark:bg-surface-800 rounded-full flex items-center justify-center">
                    <ApperIcon name="Calendar" className="h-8 w-8 text-surface-400" />
                  </div>
                  <p className="text-surface-500 dark:text-surface-400 mb-4">
                    No tasks scheduled for this date
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setNewTask(prev => ({
                        ...prev,
                        dueDate: format(selectedDate, 'yyyy-MM-dd')
                      }))
                      setShowTaskForm(true)
                    }}
                    className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-medium shadow-soft hover:shadow-card transition-all duration-200"
                  >
                    Add Task
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </motion.div>
    )
  }


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
        

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowTaskForm(true)}
          className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-xl font-semibold shadow-soft hover:shadow-card transition-all duration-200 flex items-center space-x-2"
        >
          <ApperIcon name="Plus" className="h-5 w-5" />
          <span>New Task</span>
        </motion.button>
      </motion.div>


      {/* Calendar View */}
      {viewMode === 'calendar' && <CalendarView />}


      {/* View Mode Toggle */}
      {viewMode === 'list' && (
        <>
          {/* Filters and Sort */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col lg:flex-row gap-4"
          >
            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2">
              {filters.map((filterOption) => (
                <motion.button
                  key={filterOption.value}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFilter(filterOption.value)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    filter === filterOption.value
                      ? 'bg-primary text-white shadow-soft'
                      : 'bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-400 hover:bg-surface-200 dark:hover:bg-surface-600'
                  }`}
                >
                  <ApperIcon name={filterOption.icon} className="h-4 w-4" />
                  <span className="hidden sm:inline">{filterOption.label}</span>
                </motion.button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="lg:ml-auto">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-field py-2 text-sm min-w-[150px]"
              >
                <option value="dueDate">Sort by Due Date</option>
                <option value="priority">Sort by Priority</option>
                <option value="created">Sort by Created</option>
              </select>
            </div>
          </motion.div>

          {/* Task Grid */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6"
          >
            <AnimatePresence>
              {filteredTasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ 
                    duration: 0.3, 
                    delay: index * 0.05,
                    type: "spring",
                    stiffness: 200
                  }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className={`task-card p-6 ${getPriorityClass(task.priority)} ${task.completed ? 'task-card-completed' : ''}`}
                >
                  {/* Task Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3 flex-1">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => toggleTaskComplete(task.id)}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                          task.completed
                            ? 'bg-accent border-accent text-white'
                            : 'border-surface-300 dark:border-surface-600 hover:border-accent'
                        }`}
                      >
                        {task.completed && <ApperIcon name="Check" className="h-3 w-3" />}
                      </motion.button>
                      
                      <div className="flex-1">
                        <h3 className={`font-semibold text-surface-900 dark:text-surface-100 ${task.completed ? 'line-through opacity-60' : ''}`}>
                          {task.title}
                        </h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className={`w-2 h-2 rounded-full ${getProjectColor(task.projectId)}`} />
                          <span className="text-xs text-surface-500 dark:text-surface-400">
                            {projects.find(p => p.id === task.projectId)?.name}
                          </span>
                        </div>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => deleteTask(task.id)}
                      className="text-surface-400 hover:text-red-500 transition-colors duration-200"
                    >
                      <ApperIcon name="Trash2" className="h-4 w-4" />
                    </motion.button>
                  </div>

                  {/* Task Description */}
                  {task.description && (
                    <p className={`text-sm text-surface-600 dark:text-surface-400 mb-4 ${task.completed ? 'opacity-60' : ''}`}>
                      {task.description}
                    </p>
                  )}

                  {/* Task Footer */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <ApperIcon name="Calendar" className="h-3 w-3 text-surface-500" />
                      <span className={`${isPast(task.dueDate) && !task.completed ? 'text-red-500 font-medium' : 'text-surface-500'}`}>
                        {getDateLabel(task.dueDate)}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        task.priority === 'high' ? 'bg-red-500' :
                        task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                      }`} />
                      <span className="text-surface-500 capitalize">{task.priority}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Empty State */}
          {filteredTasks.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="w-24 h-24 mx-auto mb-6 bg-surface-100 dark:bg-surface-800 rounded-full flex items-center justify-center">
                <ApperIcon name="CheckSquare" className="h-12 w-12 text-surface-400" />
              </div>
              <h3 className="text-xl font-semibold text-surface-700 dark:text-surface-300 mb-2">
                No tasks found
              </h3>
              <p className="text-surface-500 dark:text-surface-400 mb-6">
                {filter === 'all' ? 'Create your first task to get started' : `No ${filter} tasks at the moment`}
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowTaskForm(true)}
                className="bg-primary text-white px-6 py-3 rounded-xl font-medium shadow-soft hover:shadow-card transition-all duration-200"
              >
                Create Task
              </motion.button>
            </motion.div>
          )}
        </>



      )}

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