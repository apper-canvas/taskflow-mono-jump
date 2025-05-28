import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import Chart from 'react-apexcharts'
import { format, isThisWeek, isThisMonth, startOfWeek, endOfWeek, eachDayOfInterval, isPast } from 'date-fns'
import ApperIcon from '../ApperIcon'

const ProgressDashboard = ({ tasks }) => {
  const [timeFrame, setTimeFrame] = useState('week')
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    setDarkMode(document.documentElement.classList.contains('dark'))
  }, [])

  const projects = [
    { id: 'work', name: 'Work Tasks', color: '#3b82f6' },
    { id: 'personal', name: 'Personal', color: '#10b981' },
    { id: 'learning', name: 'Learning', color: '#8b5cf6' }
  ]

  const statistics = useMemo(() => {
    const total = tasks.length
    const completed = tasks.filter(task => task.completed).length
    const pending = tasks.filter(task => !task.completed && !isPast(task.dueDate)).length
    const overdue = tasks.filter(task => !task.completed && isPast(task.dueDate)).length
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0
    
    const thisWeekTasks = tasks.filter(task => isThisWeek(new Date(task.dueDate)))
    const thisMonthTasks = tasks.filter(task => isThisMonth(new Date(task.dueDate)))
    
    const priorityBreakdown = {
      high: tasks.filter(task => task.priority === 'high').length,
      medium: tasks.filter(task => task.priority === 'medium').length,
      low: tasks.filter(task => task.priority === 'low').length
    }

    return {
      total,
      completed,
      pending,
      overdue,
      completionRate,
      thisWeekTasks: thisWeekTasks.length,
      thisMonthTasks: thisMonthTasks.length,
      priorityBreakdown
    }
  }, [tasks])

  const projectProgress = useMemo(() => {
    return projects.map(project => {
      const projectTasks = tasks.filter(task => task.projectId === project.id)
      const completedTasks = projectTasks.filter(task => task.completed).length
      const totalTasks = projectTasks.length
      const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
      
      return {
        ...project,
        totalTasks,
        completedTasks,
        progress
      }
    })
  }, [tasks, projects])

  const weeklyProductivity = useMemo(() => {
    const startWeek = startOfWeek(new Date())
    const endWeek = endOfWeek(new Date())
    const weekDays = eachDayOfInterval({ start: startWeek, end: endWeek })
    
    return weekDays.map(day => {
      const dayTasks = tasks.filter(task => {
        const taskDate = new Date(task.dueDate)
        return format(taskDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
      })
      const completedTasks = dayTasks.filter(task => task.completed).length
      
      return {
        day: format(day, 'EEE'),
        date: format(day, 'yyyy-MM-dd'),
        total: dayTasks.length,
        completed: completedTasks,
        productivity: dayTasks.length > 0 ? Math.round((completedTasks / dayTasks.length) * 100) : 0
      }
    })
  }, [tasks])

  // Chart configurations
  const completionChartOptions = {
    chart: {
      type: 'donut',
      background: 'transparent'
    },
    colors: ['#10b981', '#f59e0b', '#ef4444'],
    labels: ['Completed', 'Pending', 'Overdue'],
    legend: {
      show: false
    },
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total Tasks',
              fontSize: '14px',
              color: darkMode ? '#f1f5f9' : '#334155'
            },
            value: {
              fontSize: '24px',
              fontWeight: 'bold',
              color: darkMode ? '#f1f5f9' : '#334155'
            }
          }
        }
      }
    },
    dataLabels: {
      enabled: false
    },
    tooltip: {
      theme: darkMode ? 'dark' : 'light'
    }
  }

  const projectChartOptions = {
    chart: {
      type: 'bar',
      background: 'transparent',
      toolbar: {
        show: false
      }
    },
    colors: projects.map(p => p.color),
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 4
      }
    },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      categories: projects.map(p => p.name),
      labels: {
        style: {
          colors: darkMode ? '#94a3b8' : '#64748b'
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: darkMode ? '#94a3b8' : '#64748b'
        }
      }
    },
    grid: {
      borderColor: darkMode ? '#334155' : '#e2e8f0'
    },
    tooltip: {
      theme: darkMode ? 'dark' : 'light'
    }
  }

  const productivityChartOptions = {
    chart: {
      type: 'line',
      background: 'transparent',
      toolbar: {
        show: false
      }
    },
    colors: ['#6366f1'],
    stroke: {
      curve: 'smooth',
      width: 3
    },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      categories: weeklyProductivity.map(d => d.day),
      labels: {
        style: {
          colors: darkMode ? '#94a3b8' : '#64748b'
        }
      }
    },
    yaxis: {
      min: 0,
      max: 100,
      labels: {
        style: {
          colors: darkMode ? '#94a3b8' : '#64748b'
        },
        formatter: (value) => `${value}%`
      }
    },
    grid: {
      borderColor: darkMode ? '#334155' : '#e2e8f0'
    },
    tooltip: {
      theme: darkMode ? 'dark' : 'light',
      y: {
        formatter: (value) => `${value}%`
      }
    },
    markers: {
      size: 6,
      colors: ['#6366f1'],
      strokeColors: '#fff',
      strokeWidth: 2
    }
  }

  const StatCard = ({ title, value, subtitle, icon, color = 'primary', trend }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="dashboard-stat-card p-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-surface-600 dark:text-surface-400 mb-1">
            {title}
          </p>
          <p className="text-3xl font-bold text-surface-900 dark:text-surface-100">
            {value}
          </p>
          {subtitle && (
            <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">
              {subtitle}
            </p>
          )}
        </div>
        <div className={`w-12 h-12 bg-${color}/10 dark:bg-${color}/20 rounded-xl flex items-center justify-center`}>
          <ApperIcon name={icon} className={`h-6 w-6 text-${color}`} />
        </div>
      </div>
      {trend && (
        <div className="flex items-center mt-4 text-sm">
          <ApperIcon
            name={trend.direction === 'up' ? 'TrendingUp' : 'TrendingDown'}
            className={`h-4 w-4 mr-1 ${trend.direction === 'up' ? 'text-green-500' : 'text-red-500'}`}
          />
          <span className={trend.direction === 'up' ? 'text-green-600' : 'text-red-600'}>
            {trend.value}%
          </span>
          <span className="text-surface-500 ml-1">vs last week</span>
        </div>
      )}
    </motion.div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-surface-900 dark:text-surface-100">
            Progress Dashboard
          </h2>
          <p className="text-surface-600 dark:text-surface-400 mt-1">
            Track your productivity and task completion insights
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setTimeFrame('week')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              timeFrame === 'week'
                ? 'bg-primary text-white shadow-soft'
                : 'bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-400 hover:bg-surface-200 dark:hover:bg-surface-600'
            }`}
          >
            This Week
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setTimeFrame('month')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              timeFrame === 'month'
                ? 'bg-primary text-white shadow-soft'
                : 'bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-400 hover:bg-surface-200 dark:hover:bg-surface-600'
            }`}
          >
            This Month
          </motion.button>
        </div>
      </motion.div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Tasks"
          value={statistics.total}
          subtitle={`${statistics.thisWeekTasks} this week`}
          icon="CheckSquare"
          color="primary"
        />
        <StatCard
          title="Completion Rate"
          value={`${statistics.completionRate}%`}
          subtitle={`${statistics.completed} completed`}
          icon="Target"
          color="accent"
        />
        <StatCard
          title="Pending Tasks"
          value={statistics.pending}
          subtitle="Active tasks"
          icon="Clock"
          color="secondary"
        />
        <StatCard
          title="Overdue Tasks"
          value={statistics.overdue}
          subtitle="Need attention"
          icon="AlertTriangle"
          color="red-500"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Completion Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="dashboard-chart-card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
              Task Completion
            </h3>
            <ApperIcon name="PieChart" className="h-5 w-5 text-surface-500" />
          </div>
          <div className="h-80">
            <Chart
              options={completionChartOptions}
              series={[statistics.completed, statistics.pending, statistics.overdue]}
              type="donut"
              height="100%"
            />
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-3 h-3 bg-accent rounded-full" />
                <span className="text-sm font-medium text-surface-700 dark:text-surface-300">
                  Completed
                </span>
              </div>
              <p className="text-xl font-bold text-surface-900 dark:text-surface-100 mt-1">
                {statistics.completed}
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-3 h-3 bg-secondary rounded-full" />
                <span className="text-sm font-medium text-surface-700 dark:text-surface-300">
                  Pending
                </span>
              </div>
              <p className="text-xl font-bold text-surface-900 dark:text-surface-100 mt-1">
                {statistics.pending}
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                <span className="text-sm font-medium text-surface-700 dark:text-surface-300">
                  Overdue
                </span>
              </div>
              <p className="text-xl font-bold text-surface-900 dark:text-surface-100 mt-1">
                {statistics.overdue}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Project Progress Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="dashboard-chart-card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
              Project Progress
            </h3>
            <ApperIcon name="BarChart3" className="h-5 w-5 text-surface-500" />
          </div>
          <div className="h-80">
            <Chart
              options={projectChartOptions}
              series={[{
                name: 'Progress',
                data: projectProgress.map(p => p.progress)
              }]}
              type="bar"
              height="100%"
            />
          </div>
          <div className="space-y-3 mt-4">
            {projectProgress.map((project, index) => (
              <div key={project.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: project.color }}
                  />
                  <span className="text-sm font-medium text-surface-700 dark:text-surface-300">
                    {project.name}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-surface-900 dark:text-surface-100">
                    {project.progress}%
                  </span>
                  <p className="text-xs text-surface-500">
                    {project.completedTasks}/{project.totalTasks} tasks
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Weekly Productivity Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="dashboard-chart-card p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
            Weekly Productivity Trend
          </h3>
          <ApperIcon name="TrendingUp" className="h-5 w-5 text-surface-500" />
        </div>
        <div className="h-80">
          <Chart
            options={productivityChartOptions}
            series={[{
              name: 'Productivity',
              data: weeklyProductivity.map(d => d.productivity)
            }]}
            type="line"
            height="100%"
          />
        </div>
        <div className="grid grid-cols-7 gap-2 mt-4">
          {weeklyProductivity.map((day, index) => (
            <div key={index} className="text-center">
              <p className="text-xs font-medium text-surface-600 dark:text-surface-400 mb-1">
                {day.day}
              </p>
              <p className="text-sm font-bold text-surface-900 dark:text-surface-100">
                {day.completed}/{day.total}
              </p>
              <p className="text-xs text-surface-500">
                {day.productivity}%
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Priority Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="dashboard-chart-card p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
            Priority Breakdown
          </h3>
          <ApperIcon name="Flag" className="h-5 w-5 text-surface-500" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-3 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
              <ApperIcon name="AlertTriangle" className="h-8 w-8 text-red-500" />
            </div>
            <h4 className="text-2xl font-bold text-surface-900 dark:text-surface-100">
              {statistics.priorityBreakdown.high}
            </h4>
            <p className="text-sm text-surface-600 dark:text-surface-400">
              High Priority
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center">
              <ApperIcon name="Clock" className="h-8 w-8 text-yellow-500" />
            </div>
            <h4 className="text-2xl font-bold text-surface-900 dark:text-surface-100">
              {statistics.priorityBreakdown.medium}
            </h4>
            <p className="text-sm text-surface-600 dark:text-surface-400">
              Medium Priority
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-3 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
              <ApperIcon name="CheckCircle" className="h-8 w-8 text-green-500" />
            </div>
            <h4 className="text-2xl font-bold text-surface-900 dark:text-surface-100">
              {statistics.priorityBreakdown.low}
            </h4>
            <p className="text-sm text-surface-600 dark:text-surface-400">
              Low Priority
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default ProgressDashboard