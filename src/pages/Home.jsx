import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import MainFeature from '../components/MainFeature'
import ApperIcon from '../components/ApperIcon'
import abc from '../abc'

const Home = () => {
  const [darkMode, setDarkMode] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    toast.success(`${darkMode ? 'Light' : 'Dark'} mode activated`, {
      position: "top-right",
      autoClose: 2000,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 via-white to-surface-100 dark:from-surface-900 dark:via-surface-800 dark:to-surface-900">
      {/* Header */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="glass-card border-b border-surface-200/50 dark:border-surface-700/50 sticky top-0 z-50"
      >
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo and Menu */}
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="neu-button p-2 rounded-xl lg:hidden"
              >
                <ApperIcon name="Menu" className="h-5 w-5 text-surface-700 dark:text-surface-300" />
              </motion.button>
              
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="flex items-center space-x-3"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-soft">
                  <ApperIcon name="CheckSquare" className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-gradient">TaskFlow</h1>
              </motion.div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleDarkMode}
                className="neu-button p-2 sm:p-3 rounded-xl"
              >
                <ApperIcon 
                  name={darkMode ? "Sun" : "Moon"} 
                  className="h-4 w-4 sm:h-5 sm:w-5 text-surface-700 dark:text-surface-300" 
                />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="neu-button p-2 sm:p-3 rounded-xl"
              >
                <ApperIcon name="Search" className="h-4 w-4 sm:h-5 sm:w-5 text-surface-700 dark:text-surface-300" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="neu-button p-2 sm:p-3 rounded-xl"
              >
                <ApperIcon name="Bell" className="h-4 w-4 sm:h-5 sm:w-5 text-surface-700 dark:text-surface-300" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="flex">
        {/* Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              {/* Mobile overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSidebarOpen(false)}
                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
              />
              
              {/* Sidebar content */}
              <motion.aside
                initial={{ x: -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed lg:sticky top-16 sm:top-20 left-0 z-50 lg:z-auto h-[calc(100vh-4rem)] sm:h-[calc(100vh-5rem)] w-80 glass-card border-r border-surface-200/50 dark:border-surface-700/50 overflow-y-auto scrollbar-hide"
              >
                <div className="p-4 sm:p-6">
                  {/* Quick Stats */}
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="grid grid-cols-2 gap-3 mb-6"
                  >
                    <div className="task-card p-4 text-center">
                      <div className="text-2xl font-bold text-primary">12</div>
                      <div className="text-xs text-surface-600 dark:text-surface-400">Total Tasks</div>
                    </div>
                    <div className="task-card p-4 text-center">
                      <div className="text-2xl font-bold text-accent">8</div>
                      <div className="text-xs text-surface-600 dark:text-surface-400">Completed</div>
                    </div>
                  </motion.div>

                  {/* Projects */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mb-6"
                  >
                    <h3 className="text-sm font-semibold text-surface-600 dark:text-surface-400 mb-3 uppercase tracking-wide">Projects</h3>
                    <div className="space-y-2">
                      {[
                        { name: 'Work Tasks', color: 'bg-blue-500', count: 5 },
                        { name: 'Personal', color: 'bg-green-500', count: 3 },
                        { name: 'Learning', color: 'bg-purple-500', count: 4 }
                      ].map((project, index) => (
                        <motion.button
                          key={project.name}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.5 + index * 0.1 }}
                          whileHover={{ scale: 1.02, x: 4 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-700 transition-all duration-200"
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 rounded-full ${project.color}`} />
                            <span className="text-sm font-medium text-surface-700 dark:text-surface-300">{project.name}</span>
                          </div>
                          <span className="text-xs bg-surface-200 dark:bg-surface-600 text-surface-600 dark:text-surface-400 px-2 py-1 rounded-full">
                            {project.count}
                          </span>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>

                  {/* Quick Actions */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    <h3 className="text-sm font-semibold text-surface-600 dark:text-surface-400 mb-3 uppercase tracking-wide">Quick Actions</h3>
                    <div className="space-y-2">
                      {[
                        { name: 'All Tasks', icon: 'List' },
                        { name: 'Today', icon: 'Calendar' },
                        { name: 'Important', icon: 'Star' },
                        { name: 'Completed', icon: 'CheckCircle' }
                      ].map((item, index) => (
                        <motion.button
                          key={item.name}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.8 + index * 0.1 }}
                          whileHover={{ scale: 1.02, x: 4 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-700 transition-all duration-200"
                        >
                          <ApperIcon name={item.icon} className="h-4 w-4 text-surface-600 dark:text-surface-400" />
                          <span className="text-sm font-medium text-surface-700 dark:text-surface-300">{item.name}</span>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <motion.main 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex-1 min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-5rem)]"
        >
          <MainFeature />
        </motion.main>
      </div>
    </div>
  )
}

export default Home
