<<<<<<< HEAD
// GET cheyyumbo
const loadTasks = async () => {
    setLoading(true);
    try {
        const data = await getTasks();
        // MongoDB _id and 'task' field use cheyyu
        const formatted = data.map(t => ({
            id: t._id,           // MongoDB _id
            title: t.task,       // Backend 'task' field
            completed: t.completed
        }));
        setTasks(formatted);
    } catch (err) {
        setError('Failed to load tasks');
    }
    setLoading(false);
};
=======
import { useState, useEffect } from 'react'
import './App.css'
import { getTasks, addTask, deleteTask, toggleTask } from './api'

function App() {
    const [tasks, setTasks] = useState([])
    const [input, setInput] = useState('')
    const [darkMode, setDarkMode] = useState(false)
    const [filter, setFilter] = useState('all') // all, pending, completed

    useEffect(() => {
        document.body.className = darkMode ? 'dark' : 'light'
        loadTasks()
    }, [darkMode])

    const loadTasks = async () => {
        const data = await getTasks()
        setTasks(data)
    }

    const handleAdd = async (e) => {
        e.preventDefault()
        if (!input.trim()) return
        await addTask(input)
        setInput('')
        loadTasks()
    }

    const handleDelete = async (id) => {
        await deleteTask(id)
        loadTasks()
    }

    const handleToggle = async (id) => {
        await toggleTask(id)
        loadTasks()
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
    const pendingTasks = totalTasks - completedTasks

    return (
        <div className="container">
            <div className="header">
                <h1>Student Task Tracker</h1>
                <button className="theme-btn" onClick={() => setDarkMode(!darkMode)}>
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

            <form onSubmit={handleAdd}>
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter task"
                />
                <button className="add-btn" type="submit">Add Task</button>
            </form>

            <div className="filters">
                <button
                    className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                    onClick={() => setFilter('all')}
                >
                    All ({totalTasks})
                </button>
                <button
                    className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
                    onClick={() => setFilter('pending')}
                >
                    Pending ({pendingTasks})
                </button>
                <button
                    className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
                    onClick={() => setFilter('completed')}
                >
                    Completed ({completedTasks})
                </button>
            </div>

            <div className="task-list">
                {filteredTasks.length === 0 ? (
                    <p className="empty">No tasks found!</p>
                ) : (
                    filteredTasks.map(task => (
                        <div key={task.id} className={`task ${task.completed ? 'completed' : ''}`}>
                            <div className="task-left">
                                <input
                                    type="checkbox"
                                    checked={task.completed}
                                    onChange={() => handleToggle(task.id)}
                                />
                                <span>{task.text}</span>
                            </div>
                            <button className="delete-btn" onClick={() => handleDelete(task.id)}>
                                Delete
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default App
>>>>>>> 66e15048bde61557dd0e13fbaa4da240f80e8fa9
