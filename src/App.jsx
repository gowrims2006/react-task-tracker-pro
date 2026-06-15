import { useState, useEffect } from 'react'
import './App.css'

function App() {
    const [tasks, setTasks] = useState([])
    const [input, setInput] = useState('')
    const [filter, setFilter] = useState('all') // all, pending, completed
    const [darkMode, setDarkMode] = useState(true)

    // Load from localStorage
    useEffect(() => {
        const savedTasks = localStorage.getItem('tasks')
        const savedTheme = localStorage.getItem('darkMode')
        if (savedTasks) setTasks(JSON.parse(savedTasks))
        if (savedTheme) setDarkMode(JSON.parse(savedTheme))
    }, [])

    // Save to localStorage
    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(tasks))
        localStorage.setItem('darkMode', JSON.stringify(darkMode))
    }, [tasks, darkMode])

    // Add task
    const addTask = () => {
        if (input.trim() === '') return
        setTasks([...tasks, { id: Date.now(), text: input, completed: false }])
        setInput('')
    }

    // Toggle complete
    const toggleTask = (id) => {
        setTasks(tasks.map(task =>
            task.id === id ? { ...task, completed: !task.completed } : task
        ))
    }

    // Delete task
    const deleteTask = (id) => {
        setTasks(tasks.filter(task => task.id !== id))
    }

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
                {/* Header */}
                <div className="header">
                    <h1>Student Task Tracker</h1>
                    <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
                        {darkMode ? '☀️ Light' : '🌙 Dark'}
                    </button>
                </div>

                {/* Stats Cards */}
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

                {/* Input */}
                <div className="input-section">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addTask()}
                        placeholder="Enter task"
                    />
                    <button onClick={addTask}>Add Task</button>
                </div>

                {/* Filters - ITHAANU NEE CHODICHA ADDITIONAL FILTER */}
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

                {/* Task List */}
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
            </div>
        </div>
    )
}

export default App