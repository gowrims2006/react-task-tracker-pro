import { useState } from 'react';
import { useTasks } from '../hooks/useTasks';
import TaskForm from './TaskForm';

const ApiTasks = () => {
    const { tasks, loading, error, addTask, deleteTask, toggleComplete } = useTasks();
    const [darkMode, setDarkMode] = useState(true);
    const [filter, setFilter] = useState('All');

    const completedCount = tasks.filter(t => t.completed).length;
    const pendingCount = tasks.length - completedCount;

    const filteredTasks = tasks.filter(task => {
        if (filter === 'Completed') return task.completed;
        if (filter === 'Pending') return !task.completed;
        return true;
    });

    if (loading) return <div className="text-center p-5">Loading...</div>;
    if (error) return <div className="alert alert-danger">Error: {error}</div>;

    // ✅ DARK & LIGHT THEME COLORS
    const theme = darkMode ? {
        bg: '#000000',
        cardBg: '#1c1c1e',
        inputBg: '#2c2c2e',
        text: '#ffffff',
        secondaryText: '#8e8e93',
        blue: '#0a84ff',
        red: '#ff453a',
        border: '#38383a'
    } : {
        bg: '#f2f2f7',
        cardBg: '#ffffff',
        inputBg: '#ffffff',
        text: '#000000',
        secondaryText: '#6d6d70',
        blue: '#007aff',
        red: '#ff3b30',
        border: '#d1d1d6'
    };

    return (
        <div style={{
            background: theme.bg,
            minHeight: '100vh',
            color: theme.text,
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            transition: 'all 0.3s'
        }}>
            <div className="container py-4" style={{ maxWidth: '600px' }}>

                {/* HEADER + TOGGLE */}
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <div></div>
                    <h1 className="text-center fw-bold">Student Task Tracker</h1>
                    <button
                        className="btn btn-sm rounded-pill"
                        style={{ background: theme.cardBg, color: theme.text, border: `1px solid ${theme.border}` }}
                        onClick={() => setDarkMode(!darkMode)}
                    >
                        {darkMode ? '☀️' : '🌙'}
                    </button>
                </div>
                <p className="text-center mb-4" style={{ color: theme.secondaryText }}>Learn React</p>

                {/* STATS CARDS */}
                <div className="row g-2 mb-3">
                    <div className="col-4">
                        <div className="p-3 rounded-3 text-center" style={{ background: theme.cardBg, border: `1px solid ${theme.border}` }}>
                            <div style={{ color: theme.secondaryText, fontSize: '14px' }}>Total Tasks</div>
                            <div style={{ color: theme.blue, fontSize: '32px', fontWeight: '600' }}>{tasks.length}</div>
                        </div>
                    </div>
                    <div className="col-4">
                        <div className="p-3 rounded-3 text-center" style={{ background: theme.cardBg, border: `1px solid ${theme.border}` }}>
                            <div style={{ color: theme.secondaryText, fontSize: '14px' }}>Completed Tasks</div>
                            <div style={{ color: theme.blue, fontSize: '32px', fontWeight: '600' }}>{completedCount}</div>
                        </div>
                    </div>
                    <div className="col-4">
                        <div className="p-3 rounded-3 text-center" style={{ background: theme.cardBg, border: `1px solid ${theme.border}` }}>
                            <div style={{ color: theme.secondaryText, fontSize: '14px' }}>Pending Tasks</div>
                            <div style={{ color: theme.blue, fontSize: '32px', fontWeight: '600' }}>{pendingCount}</div>
                        </div>
                    </div>
                </div>

                <p className="text-center mb-3" style={{ color: theme.blue, fontSize: '18px' }}>
                    {pendingCount} tasks left
                </p>

                <TaskForm onSubmit={addTask} theme={theme} />

                {/* FILTER BUTTONS */}
                <div className="d-flex justify-content-center gap-2 mb-4">
                    {['All', 'Pending', 'Completed'].map(btn => (
                        <button
                            key={btn}
                            className="px-4 py-2 rounded-3"
                            style={{
                                background: filter === btn ? theme.blue : theme.cardBg,
                                color: filter === btn ? '#fff' : theme.text,
                                border: `1px solid ${theme.border}`,
                                fontWeight: filter === btn ? '600' : '400'
                            }}
                            onClick={() => setFilter(btn)}
                        >
                            {btn}
                        </button>
                    ))}
                </div>

                {/* TASK LIST */}
                <div className="d-flex flex-column gap-2">
                    {filteredTasks.map(task => (
                        <div
                            key={task.id}
                            className="p-3 rounded-3 d-flex align-items-center justify-content-between"
                            style={{ background: theme.cardBg, border: `1px solid ${theme.border}` }}
                        >
                            <div className="d-flex align-items-center gap-3">
                                <input
                                    type="checkbox"
                                    checked={task.completed}
                                    onChange={() => toggleComplete(task.id)}
                                    style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                                />
                                <span style={{
                                    textDecoration: task.completed ? 'line-through' : 'none',
                                    color: task.completed ? theme.secondaryText : theme.text
                                }}>
                                    {task.title}
                                </span>
                            </div>
                            <button
                                className="btn btn-sm"
                                style={{ color: theme.red, fontSize: '20px', fontWeight: 'bold' }}
                                onClick={() => deleteTask(task.id)}
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ApiTasks;