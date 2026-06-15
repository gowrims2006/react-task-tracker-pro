import { useState, useEffect } from 'react'
import './App.css'

function App() {
    const [tasks, setTasks] = useState([])
    const [input, setInput] = useState('')
    const [filter, setFilter] = useState('all')
    const [darkMode, setDarkMode] = useState(true)
    const [loading, setLoading] = useState(false)

    const API_URL = 'https://jsonplaceholder.typicode.com/todos'

    // GET - Load tasks from API
    useEffect(() => {
        const fetchTasks = async () => {
            setLoading(true)
            try {
                const response = await fetch(`${API_URL}?_limit=10`)
                const data = await response.json()
                const formattedTasks = data.map(t => ({
                    id: t.id,
                    text: t.title,
                    completed: t.completed
                }))
                setTasks(formattedTasks)
            } catch (error) {
                console.error('Fetch error:', error)
                alert('API load cheyyan pattiyilla')
            } finally {
                setLoading(false)
            }
        }
        fetchTasks()
    }, [])

    // POST - Add task to API
    const addTask = async () => {
        if (input.trim() === '') return

        setLoading(true)
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: input,
                    completed: false,
                    userId: 1
                })
            })

            const newTask = await response.json()
            setTasks([...tasks, {
                id: newTask.id,
                text: newTask.title || input,
                completed: newTask.completed
            }])
            setInput('')
        } catch (error) {
            console.error('Add error:', error)
            alert('Task add cheyyan pattiyilla')
        } finally {
            setLoading(false)
        }
    }

    // PUT - Toggle complete with API
    const toggleTask = async (id) => {
        const task = tasks.find(t => t.id === id)
        if (!task) return

        try {
            await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...task,
                    completed: !task.completed
                })
            })

            setTasks(tasks.map(t =>
                t.id === id ? { ...t, completed: !t.completed } : t
            ))
        } catch (error) {
            console.error('Update error:', error)
            alert('Update cheyyan pattiyilla')
        }
    }

    // DELETE - Delete from API
    const deleteTask = async (id) => {
        try {
            await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            })
            setTasks(tasks.filter(task => task.id !== id))
        } catch (error) {
            console.error('Delete error:', error)
            alert('Delete cheyyan pattiyilla')
        }
    }

    // Toggle theme
    const toggleTheme = () => {
        setDarkMode(!darkMode)
        localStorage.setItem('darkMode', JSON.stringify(!darkMode))
    }

    useEffect(() => {
        const savedTheme = localStorage.getItem('darkMode')
        if (savedTheme) setDarkMode(JSON.parse(savedTheme))
    }, [])

    // Filter logic
    const filteredTasks = tasks.filter(task => {
        if (filter === 'completed') return task.completed
        if (filter === 'pending') return !task.completed
        return true
    })

    // Stats
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
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addTask()}
                        placeholder="Enter task"
                        disabled={loading}
                    />
                    <button onClick={addTask} disabled={loading}>
                        {loading ? 'Adding...' : 'Add Task'}
                    </button>
                </div>

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
                                    <button className="delete-btn" onClick={() => deleteTask(task.id)}>
                                        Delete
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default App