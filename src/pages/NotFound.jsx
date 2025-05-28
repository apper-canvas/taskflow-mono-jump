import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '../components/ApperIcon'

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-surface-50 to-surface-100 dark:from-surface-900 dark:to-surface-800">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center px-4"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-soft"
        >
          <ApperIcon name="AlertTriangle" className="h-16 w-16 text-white" />
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-6xl font-bold text-gradient mb-4"
        >
          404
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-xl text-surface-600 dark:text-surface-400 mb-8"
        >
          Oops! The page you're looking for doesn't exist.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Link
            to="/"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary to-secondary text-white px-8 py-4 rounded-xl font-semibold shadow-soft hover:shadow-card transform hover:scale-105 transition-all duration-200"
          >
            <ApperIcon name="Home" className="h-5 w-5" />
            <span>Back to TaskFlow</span>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default NotFound