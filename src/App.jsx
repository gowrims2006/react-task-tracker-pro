import { useState, useEffect } from 'react'
import { getTodos, addTodos, toggleTodos, deleteTodos } from './services/api.js'
import './App.css'

function App() {
  const [tasks, setTasks] = useState([])
  const [input, setInput] = useState('')
  const [filter, setFilter] = useState('all')
  const [darkMode, setDarkMode] = useState(false)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [taskToDelete, setTaskToDelete] = useState(null)
  const [loading, setLoading] = useState(true)

  // Backend ninnu data load cheyyuka + dark mode
  useEffect(() => {
    const savedTheme = localStorage.getItem('darkMode')
    if (savedTheme) setDarkMode(JSON.parse(savedTheme))
    fetchTasks() // ← Backend ninnu edukkuka
  }, [])

  // Dark mode toggle
  useEffect(() => {
    document.body.className = darkMode ? 'dark' : ''
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
  }, [darkMode])

  // BACKEND NINNU GET CHEYYUKA
  const fetchTasks = async () => {
    try {
      setLoading(true)
      const data = await getTodos() // ← GET /api/todos
      setTasks(data)
      setError('')
    } catch (err) {
      setError('Server il ninnu tasks edukkana pattiyilla')
      console.error('GET Error:', err)
    } finally {
      setLoading(false)
    }
  }

  // BACKEND ILEKK POST CHEYYUKA
  const addTask = async () => {
    if (input.trim() === '') {
      setError('Please enter a task!')
      return
    }
    if (input.trim().length < 3) {
      setError('Task must be at least 3 characters!')
      return
    }

    try {
      await addTodos(input.trim()) // ← POST /api/todos
      setError('')
      setInput('')
      fetchTasks() // ← Veendum GET cheythu update aakuka
    } catch (err) {
      setError('unable to add task.')
      console.error('POST Error:', err)
    }
  }

  // BACKEND IL UPDATE CHEYYUKA
  const toggleTask = async (id) => {
    const task = tasks.find(t => t._id === id) // ← _id aanu MongoDB il
    try {
      await toggleTodos(id, !task.completed) // ← PUT /api/todos/:id
      fetchTasks()
    } catch (err) {
      setError('unable to update')
      console.error('PUT Error:', err)
    }
  }

  const handleDeleteClick = (id) => {
    setTaskToDelete(id)
    setShowModal(true)
  }

  // BACKEND NINNU DELETE CHEYYUKA
  const confirmDelete = async () => {
    try {
      await deleteTodos(taskToDelete) // ← DELETE /api/todos/:id
      setShowModal(false)
      setTaskToDelete(null)
      fetchTasks()
    } catch (err) {
      setError('unable to delete')
      console.error('DELETE Error:', err)
    }
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
    if (filter === 'pending') return !task.completed
    return true
  })

  const totalTasks = tasks.length
  const completedTasks = tasks.filter(t => t.completed).length
  const pendingTasks = tasks.filter(t => !t.completed).length

  return (
    <div className="app">
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
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTask()}
            placeholder="Enter task"
          />
          <button onClick={addTask}>Add Task</button>
        </div>

        {error && <p className="error-text">{error}</p>}
        {loading && <p className="loading">Loading tasks from server...</p>}

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

        <div className="task-list">
          {!loading && filteredTasks.length === 0 ? (
            <p className="empty">No tasks found 🔍</p>
          ) : (
            filteredTasks.map(task => (
              <div key={task._id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task._id)} // ← _id use cheyyuka
                />
                <span>{task.title}</span> // ← title ennaanu backend il
                <button onClick={() => handleDeleteClick(task._id)}>Delete</button>
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