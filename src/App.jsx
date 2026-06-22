import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [tasks, setTasks] = useState([])
  const [input, setInput] = useState('')
  const [filter, setFilter] = useState('all')
  const [darkMode, setDarkMode] = useState(false)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [taskToDelete, setTaskToDelete] = useState(null)

  // Load from localStorage on start
  useEffect(() => {
    const savedTheme = localStorage.getItem('darkMode')
    if (savedTheme) setDarkMode(JSON.parse(savedTheme))

    const savedTasks = localStorage.getItem('tasks')
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    }
  }, [])

  // Save to localStorage when tasks change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])

  // Toggle dark mode
  useEffect(() => {
    document.body.className = darkMode? 'dark' : ''
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
  }, [darkMode])

  const addTask = () => {
    if (input.trim() === '') {
      setError('Please enter a task!')
      return
    }
    if (input.trim().length < 3) {
      setError('Task must be at least 3 characters!')
      return
    }
    const isDuplicate = tasks.some(task =>
      task.text.toLowerCase() === input.trim().toLowerCase()
    )
    if (isDuplicate) {
      setError('This task already exists!')
      return
    }

    setError('')
    const newTask = {
      id: Date.now(),
      text: input.trim(),
      completed: false
    }
    setTasks([...tasks, newTask])
    setInput('')
  }

  const toggleTask = (id) => {
    setTasks(tasks.map(t =>
      t.id === id? {...t, completed:!t.completed } : t
    ))
  }

  const handleDeleteClick = (id) => {
    setTaskToDelete(id)
    setShowModal(true)
  }

  const confirmDelete = () => {
    setTasks(tasks.filter(t => t.id!== taskToDelete))
    setShowModal(false)
    setTaskToDelete(null)
  }

  const cancelDelete = () => {
    setShowModal(false)
    setTaskToDelete(null)
  }

  const toggleTheme = () => {
    setDarkMode(!darkMode)
  }

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed
    if (filter === 'pending') return!task.completed
    return true
  })

  const totalTasks = tasks.length
  const completedTasks = tasks.filter(t => t.completed).length
  const pendingTasks = tasks.filter(t =>!t.completed).length

  return (
    <div className="app">
      <div className="container">
        <div className="header">
          <h1>Student Task Tracker 🚀</h1>
          <button className="theme-toggle" onClick={toggleTheme}>
            {darkMode? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>

        <div className="stats">
          <div className="stat-card">
            <p>Total Tasks</p>
            <h2>{totalTasks}</h2>
          </div>
          <div className="stat-card">
            <p>Completed</p>
            <h2>{completedTasks}</h2>
          </div>
          <div className="stat-card">
            <p>Pending</p>
            <h2>{pendingTasks}</h2>
          </div>
        </div>

        <div className="input-section">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTask()}
            placeholder="Enter task"
          />
          <button onClick={addTask}>Add Task</button>
        </div>

        {error && <p className="error-text">{error}</p>}

        <div className="filters">
          <button
            className={filter === 'all'? 'active' : ''}
            onClick={() => setFilter('all')}
          >
            All ({totalTasks})
          </button>
          <button
            className={filter === 'pending'? 'active' : ''}
            onClick={() => setFilter('pending')}
          >
            Pending ({pendingTasks})
          </button>
          <button
            className={filter === 'completed'? 'active' : ''}
            onClick={() => setFilter('completed')}
          >
            Completed ({completedTasks})
          </button>
        </div>

        <div className="task-list">
          {filteredTasks.length === 0? (
            <p className="empty">No tasks found 🔍</p>
          ) : (
            filteredTasks.map(task => (
              <div key={task.id} className={`task-item ${task.completed? 'completed' : ''}`}>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                />
                <span>{task.text}</span>
                <button onClick={() => handleDeleteClick(task.id)}>Delete</button>
              </div>
            ))
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={cancelDelete}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this task?</p>
            <div className="modal-buttons">
              <button onClick={cancelDelete}>Cancel</button>
              <button onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App