import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import MainFeature from '../components/MainFeature'
import ApperIcon from '../components/ApperIcon'
import * as boardService from '../services/api/boardService'
import * as userService from '../services/api/userService'

const Home = () => {
  const [boards, setBoards] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const [boardsData, usersData] = await Promise.all([
          boardService.getAll(),
          userService.getAll()
        ])
        setBoards(boardsData || [])
        setUsers(usersData || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const handleBoardUpdate = (updatedBoard) => {
    setBoards(prev => prev.map(board => 
      board.id === updatedBoard.id ? updatedBoard : board
    ))
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center space-y-4"
        >
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-surface-600 font-medium">Loading your boards...</p>
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <ApperIcon name="AlertTriangle" className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-surface-800 mb-2">Something went wrong</h2>
          <p className="text-surface-600">{error}</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-emerald-50 flex">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: sidebarOpen ? 0 : -240 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed left-0 top-0 h-full w-70 bg-white/80 backdrop-blur-xl border-r border-surface-200 z-40 overflow-hidden"
      >
        <div className="p-6 border-b border-surface-200">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-3"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <ApperIcon name="Trello" className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              FlowBoard
            </h1>
          </motion.div>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-surface-700 mb-3 px-2">Your Boards</h2>
            <div className="space-y-2">
              {boards?.map((board, index) => (
                <motion.div
                  key={board.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 rounded-lg bg-surface-50 hover:bg-surface-100 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 rounded bg-gradient-to-br from-primary to-secondary" />
                    <span className="text-sm font-medium text-surface-700 group-hover:text-surface-900">
                      {board.name}
                    </span>
                  </div>
                  <p className="text-xs text-surface-500 mt-1 ml-7">
                    {board.columns?.length || 0} columns • {board.members?.length || 0} members
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-surface-700 mb-3 px-2">Team Members</h2>
            <div className="space-y-2">
              {users?.slice(0, 5).map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (index + boards?.length) * 0.1 }}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-surface-50 transition-colors"
                >
                  <img
                    src={user.avatar || `https://images.unsplash.com/photo-1494790108755-2616b612b5e5?w=32&h=32&fit=crop&crop=face`}
                    alt={user.name}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span className="text-sm font-medium text-surface-700">{user.name}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-70' : 'ml-10'}`}>
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="h-14 bg-white/70 backdrop-blur-xl border-b border-surface-200 flex items-center justify-between px-6 sticky top-0 z-30"
        >
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-surface-100 transition-colors focus-ring"
            >
              <ApperIcon name="Menu" className="w-5 h-5 text-surface-600" />
            </button>
            <h1 className="text-lg font-semibold text-surface-800">
              {boards?.[0]?.name || "Project Board"}
            </h1>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex -space-x-2">
              {users?.slice(0, 3).map((user) => (
                <img
                  key={user.id}
                  src={user.avatar || `https://images.unsplash.com/photo-1494790108755-2616b612b5e5?w=32&h=32&fit=crop&crop=face`}
                  alt={user.name}
                  className="w-8 h-8 rounded-full border-2 border-white object-cover"
                />
              ))}
            </div>
            <button className="p-2 rounded-lg hover:bg-surface-100 transition-colors focus-ring">
              <ApperIcon name="Settings" className="w-5 h-5 text-surface-600" />
            </button>
          </div>
        </motion.header>

        {/* Board Container */}
        <div className="p-6 overflow-hidden">
          <MainFeature
            boards={boards}
            users={users}
            onBoardUpdate={handleBoardUpdate}
          />
        </div>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}

export default Home