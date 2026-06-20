import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [tasks, setTasks] = useState([])
  const [input, setInput] = useState('')
  const [filter, setFilter] = useState('all')
  const [darkMode, setDarkMode] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [showModal, setShowModal] = useState(false)
  const [taskToDelete, setTaskToDelete] = useState(null)

  // ✅ MAATTAM: Ninte own backend
  const API_URL = 'http://localhost:3001/api/todos'

  useEffect(() => {
    const savedTheme = localStorage.getItem('darkMode')
    if (savedTheme) setDarkMode(JSON.parse(savedTheme))
  }, [])

  // GET - Load tasks from YOUR API
  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true)
      try {
        const response = await fetch(API_URL)
        const result = await response.json()
        // Backend response: { success: true, data: [...] }
        const formattedTasks = result.data.map(t => ({
          id: t._id,  // MongoDB _id use cheyyunnu
          text: t.task,  // Backend il 'task' aanu field name
          completed: t.completed
        }))
        setTasks(formattedTasks)
      } catch (error) {
        console.error('Fetch error:', error)
        setError('Failed to load tasks from API. Backend running aano?')
      } finally {
        setLoading(false)
      }
    }
    fetchTasks()
  }, [])

  // POST - Add task
  const addTask = async () => {
    if (input.trim() === '') {
      setError('Please enter a task! 📝')
      return
    }
    if (input.trim().length < 3) {
      setError('Task must be at least 3 characters long!')
      return
    }
    const isDuplicate = tasks.some(task =>
      task.text.toLowerCase() === input.trim().toLowerCase()
    )
    if (isDuplicate) {
      setError('This task already exists! 🔄')
      return
    }

    setError('')
    setLoading(true)
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task: input.trim(),  // Backend 'task' expect cheyyunnu
          completed: false
        })
      })

      const result = await response.json()
      setTasks([...tasks, {
        id: result.data._id,  // MongoDB _id
        text: result.data.task,
        completed: result.data.completed
      }])
      setInput('')
    } catch (error) {
      console.error('Add error:', error)
      setError('Failed to add task. Try again!')
    } finally {
      setLoading(false)
    }
  }

  // PUT - Toggle complete
  const toggleTask = async (id) => {
    const task = tasks.find(t => t.id === id)
    if (!task) return

    try {
      await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !task.completed })
      })

      setTasks(tasks.map(t =>
        t.id === id ? { ...t, completed: !t.completed } : t
      ))
    } catch (error) {
      console.error('Update error:', error)
      setError('Failed to update task')
    }
  }

  const handleDeleteClick = (id) => {
    setTaskToDelete(id)
    setShowModal(true)
  }

  // DELETE
  const confirmDelete = async () => {
    try {
      await fetch(`${API_URL}/${taskToDelete}`, {
        method: 'DELETE'
      })
      setTasks(tasks.filter(task => task.id !== taskToDelete))
      setShowModal(false)
      setTaskToDelete(null)
    } catch (error) {
      console.error('Delete error:', error)
      setError('Failed to delete task')
      setShowModal(false)
      setTaskToDelete(null)
    }
  }

  const cancelDelete = () => {
    setShowModal(false)
    setTaskToDelete(null)
  }

  const toggleTheme = () => {
    setDarkMode(!darkMode)
    localStorage.setItem('darkMode', JSON.stringify(!darkMode))
  }

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed
    if (filter === 'pending') return !task.completed
    return true
  })

  const totalTasks = tasks.length
  const completedTasks = tasks.filter(t => t.completed).length
  const pendingTasks = tasks.filter(t => !t.completed).length

  return (
    <div className={`app ${darkMode ? 'dark' : 'light'}`}>
      <div className="container">
        <div className="header">
          <h1>Student Task Tracker 🚀</h1>
          <button className="theme-toggle" onClick={toggleTheme}>
            {darkMode ? '☀️ Light' : '🌙 Dark'}
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
            onChange={(e) => {
              setInput(e.target.value)
              setError('')
            }}
            onKeyDown={(e) => e.key === 'Enter' && addTask()}
            placeholder="Enter task"
            disabled={loading}
            className={error ? 'error' : ''}
          />
          <button onClick={addTask} disabled={loading}>
            {loading ? 'Adding...' : 'Add Task'}
          </button>
        </div>
        {error && <p className="error-text">{error}</p>}

        <div className="filters">
          <button
            className={filter === 'all' ? 'active' : ''}
            onClick={() => setFilter('all')}
          >
            All ({totalTasks})
          </button>
          <button
            className={filter === 'pending' ? 'active' : ''}
            onClick={() => setFilter('pending')}
          >
            Pending ({pendingTasks})
          </button>
          <button
            className={filter === 'completed' ? 'active' : ''}
            onClick={() => setFilter('completed')}
          >
            Completed ({completedTasks})
          </button>
        </div>

        {loading && tasks.length === 0 ? (
          <p className="empty">Loading tasks... ⏳</p>
        ) : (
          <div className="task-list">
            {filteredTasks.length === 0 ? (
              <p className="empty">No tasks found 🔍</p>
            ) : (
              filteredTasks.map(task => (
                <div key={task.id} className={`task ${task.completed ? 'done' : ''}`}>
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                  />
                  <span>{task.text}</span>
                  <button className="delete-btn" onClick={() => handleDeleteClick(task.id)}>
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={cancelDelete}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Warning</h3>
            <p>Are you sure you want to delete this task?</p>
            <div className="modal-buttons">
              <button onClick={cancelDelete} className="cancel-btn">No, Cancel</button>
              <button onClick={confirmDelete} className="delete-confirm-btn">Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App