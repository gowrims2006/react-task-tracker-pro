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

    // ✅ NINTE REAL BACKEND
    const API_URL = 'http://localhost:3001/api/todos'

    useEffect(() => {
        const savedTheme = localStorage.getItem('darkMode')
        if (savedTheme) setDarkMode(JSON.parse(savedTheme))
    }, [])

    useEffect(() => {
        const fetchTasks = async () => {
            setLoading(true)
            try {
                const response = await fetch(API_URL)
                const result = await response.json()

                if (result.success) { // ✅ Success check cheyyanam
                    const formattedTasks = result.data.map(t => ({
                        id: t._id,
                        text: t.task,
                        completed: t.completed
                    }))
                    setTasks(formattedTasks)
                    setError('') // ✅ Error clear cheyyu
                } else {
                    setError('Failed to load tasks') // ❌ Enkil mathram
                }
            } catch (err) {
                setError('Failed to load tasks')
            } finally {
                setLoading(false)
            }
        }
        fetchTasks()
    }, [])
    const addTask = async () => {
        // ... validation code same ...

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    task: input.trim(),  // ✅ 'task' ennanu backend expect cheyyunnathu
                    completed: false
                })
            })
            const result = await response.json()
            setTasks([...tasks, {
                id: result.data._id,
                text: result.data.task,
                completed: result.data.completed
            }])
            setInput('')
        } catch (error) {
            setError('Failed to add task. Try again!')
        } finally {
            setLoading(false)
        }
    }
    // ✅ PUT - Update cheyyan
    const toggleTask = async (id) => {
        const task = tasks.find(t => t.id === id)
        if (!task) return

        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    task: task.text,
                    completed: !task.completed
                })
            })
            const result = await response.json()
            setTasks(tasks.map(t =>
                t.id === id ? { ...t, completed: result.data.completed } : t
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

    // ✅ DELETE - Backend il ninnu delete cheyyan
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
                    <h1>Student Task Tracker</h1>
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