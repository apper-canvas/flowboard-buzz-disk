import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from './ApperIcon'
import * as cardService from '../services/api/cardService'
import * as columnService from '../services/api/columnService'
import { format, isToday, isTomorrow, isThisWeek } from 'date-fns'

const MainFeature = ({ boards, users, onBoardUpdate }) => {
  const [columns, setColumns] = useState([])
  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [draggedCard, setDraggedCard] = useState(null)
  const [draggedOverColumn, setDraggedOverColumn] = useState(null)
  const [isAddingCard, setIsAddingCard] = useState(null)
  const [newCardTitle, setNewCardTitle] = useState("")

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const [columnsData, cardsData] = await Promise.all([
          columnService.getAll(),
          cardService.getAll()
        ])
        setColumns(columnsData || [])
        setCards(cardsData || [])
      } catch (err) {
        setError(err.message)
        toast.error("Failed to load board data")
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const handleDragStart = (e, card) => {
    setDraggedCard(card)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e, columnId) => {
    e.preventDefault()
    setDraggedOverColumn(columnId)
  }

  const handleDragLeave = () => {
    setDraggedOverColumn(null)
  }

  const handleDrop = async (e, targetColumnId) => {
    e.preventDefault()
    setDraggedOverColumn(null)
    
    if (!draggedCard || draggedCard.columnId === targetColumnId) {
      setDraggedCard(null)
      return
    }

    try {
      const updatedCard = await cardService.update(draggedCard.id, {
        ...draggedCard,
        columnId: targetColumnId
      })
      
      setCards(prev => prev.map(card => 
        card.id === updatedCard.id ? updatedCard : card
      ))
      
      toast.success("Card moved successfully")
    } catch (err) {
      toast.error("Failed to move card")
    }
    
    setDraggedCard(null)
  }

  const handleAddCard = async (columnId) => {
    if (!newCardTitle.trim()) return

    try {
      const newCard = await cardService.create({
        title: newCardTitle,
        description: "",
        columnId,
        labels: [],
        assignees: [],
        dueDate: null,
        position: cards.filter(c => c.columnId === columnId).length
      })
      
      setCards(prev => [...prev, newCard])
      setNewCardTitle("")
      setIsAddingCard(null)
      toast.success("Card created successfully")
    } catch (err) {
      toast.error("Failed to create card")
    }
  }

  const getCardsForColumn = (columnId) => {
    return cards?.filter(card => card.columnId === columnId) || []
  }

  const formatDueDate = (date) => {
    if (!date) return null
    
    const dueDate = new Date(date)
    if (isToday(dueDate)) return "Today"
    if (isTomorrow(dueDate)) return "Tomorrow"
    if (isThisWeek(dueDate)) return format(dueDate, "EEEE")
    return format(dueDate, "MMM d")
  }

  const getDueDateColor = (date) => {
    if (!date) return "text-surface-500"
    
    const dueDate = new Date(date)
    const now = new Date()
    const diffDays = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) return "text-red-600 bg-red-50"
    if (diffDays === 0) return "text-orange-600 bg-orange-50"
    if (diffDays <= 2) return "text-yellow-600 bg-yellow-50"
    return "text-green-600 bg-green-50"
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-4">
            <div className="h-12 bg-surface-200 rounded-xl animate-pulse" />
            <div className="space-y-3">
              {[...Array(3)].map((_, j) => (
                <div key={j} className="h-24 bg-surface-100 rounded-lg animate-pulse" />
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="h-full">
      <div className="flex space-x-6 overflow-x-auto pb-6 scrollbar-hide">
        <AnimatePresence>
          {columns?.map((column, index) => {
            const columnCards = getCardsForColumn(column.id)
            const isDragOver = draggedOverColumn === column.id
            
            return (
              <motion.div
                key={column.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`min-w-80 max-w-80 flex-shrink-0 bg-white/60 backdrop-blur-lg rounded-2xl border border-surface-200 ${
                  isDragOver ? "ring-2 ring-primary bg-primary-50/50" : ""
                } transition-all duration-200`}
                onDragOver={(e) => handleDragOver(e, column.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, column.id)}
              >
                {/* Column Header */}
                <div className="p-4 border-b border-surface-100">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-surface-800 text-lg">
                      {column.title}
                    </h3>
                    <span className="text-sm text-surface-500 bg-surface-100 px-2 py-1 rounded-full">
                      {columnCards.length}
                    </span>
                  </div>
                </div>

                {/* Cards Container */}
                <div className="p-4 space-y-3 min-h-96 max-h-96 overflow-y-auto scrollbar-hide">
                  <AnimatePresence>
                    {columnCards.map((card, cardIndex) => (
                      <motion.div
                        key={card.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: cardIndex * 0.05 }}
                        draggable
                        onDragStart={(e) => handleDragStart(e, card)}
                        className={`bg-white rounded-xl border border-surface-200 p-4 cursor-grab active:cursor-grabbing card-hover group ${
                          draggedCard?.id === card.id ? "opacity-50" : ""
                        }`}
                      >
                        <div className="space-y-3">
                          <h4 className="font-medium text-surface-800 line-clamp-2">
                            {card.title}
                          </h4>
                          
                          {card.description && (
                            <p className="text-sm text-surface-600 line-clamp-2">
                              {card.description}
                            </p>
                          )}

                          {/* Labels */}
                          {card.labels?.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {card.labels.map((label, i) => (
                                <span
                                  key={i}
                                  className="px-2 py-1 text-xs font-medium rounded-full"
                                  style={{
                                    backgroundColor: label.color + "20",
                                    color: label.color
                                  }}
                                >
                                  {label.name}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Footer */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              {card.dueDate && (
                                <div className={`flex items-center space-x-1 text-xs px-2 py-1 rounded-full ${getDueDateColor(card.dueDate)}`}>
                                  <ApperIcon name="Clock" className="w-3 h-3" />
                                  <span>{formatDueDate(card.dueDate)}</span>
                                </div>
                              )}
                            </div>

                            {card.assignees?.length > 0 && (
                              <div className="flex -space-x-1">
                                {card.assignees.slice(0, 3).map((assigneeId) => {
                                  const user = users?.find(u => u.id === assigneeId)
                                  return user ? (
                                    <img
                                      key={user.id}
                                      src={user.avatar || `https://images.unsplash.com/photo-1494790108755-2616b612b5e5?w=24&h=24&fit=crop&crop=face`}
                                      alt={user.name}
                                      className="w-6 h-6 rounded-full border-2 border-white object-cover"
                                    />
                                  ) : null
                                })}
                                {card.assignees.length > 3 && (
                                  <div className="w-6 h-6 bg-surface-200 rounded-full border-2 border-white flex items-center justify-center">
                                    <span className="text-xs text-surface-600">
                                      +{card.assignees.length - 3}
                                    </span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Add Card */}
                  <div className="mt-4">
                    {isAddingCard === column.id ? (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="space-y-2"
                      >
                        <input
                          type="text"
                          placeholder="Enter card title..."
                          value={newCardTitle}
                          onChange={(e) => setNewCardTitle(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') handleAddCard(column.id)
                            if (e.key === 'Escape') setIsAddingCard(null)
                          }}
                          className="w-full p-3 border border-surface-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                          autoFocus
                        />
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleAddCard(column.id)}
                            className="px-3 py-1.5 bg-primary text-white text-sm rounded-md hover:bg-primary-dark transition-colors focus-ring"
                          >
                            Add Card
                          </button>
                          <button
                            onClick={() => {
                              setIsAddingCard(null)
                              setNewCardTitle("")
                            }}
                            className="px-3 py-1.5 text-surface-600 text-sm hover:bg-surface-100 rounded-md transition-colors focus-ring"
                          >
                            Cancel
                          </button>
                        </div>
                      </motion.div>
                    ) : (
                      <button
                        onClick={() => setIsAddingCard(column.id)}
                        className="w-full p-3 text-left text-surface-600 hover:text-surface-800 hover:bg-surface-50 rounded-lg transition-colors focus-ring group"
                      >
                        <div className="flex items-center space-x-2">
                          <ApperIcon name="Plus" className="w-4 h-4" />
                          <span className="text-sm">Add a card</span>
                        </div>
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>

        {/* Add Column Button */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: (columns?.length || 0) * 0.1 + 0.2 }}
          className="min-w-80 flex-shrink-0"
        >
          <button className="w-full h-32 bg-white/40 border-2 border-dashed border-surface-300 rounded-2xl hover:bg-white/60 hover:border-primary transition-all duration-200 focus-ring group">
            <div className="flex flex-col items-center justify-center space-y-2">
              <ApperIcon name="Plus" className="w-6 h-6 text-surface-400 group-hover:text-primary transition-colors" />
              <span className="text-sm font-medium text-surface-600 group-hover:text-primary transition-colors">
                Add another list
              </span>
            </div>
          </button>
        </motion.div>
      </div>
    </div>
  )
}

export default MainFeature