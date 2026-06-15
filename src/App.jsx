import { useState, useEffect } from 'react';
import { getTasks } from './services/api';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import StatsCard from './components/StatsCard';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isDark, setIsDark] = useState(false);

    // ✅ THEME ONCE MATHRAM DECLARE CHEYYU
    const theme = {
        inputBg: isDark ? '#1c1c1e' : '#fff',
        text: isDark ? '#fff' : '#000',
        border: isDark ? '#38383a' : '#dee2e6',
        blue: '#0a84ff',
        bg: isDark ? '#000' : '#fff'
    };

    // 1. GET API
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const data = await getTasks();
                setTasks(data);
            } catch (err) {
                setError('Failed to load tasks');
            } finally {
                setLoading(false);
            }
        };
        fetchTasks();
    }, []);

    // 2. POST API - TaskForm il ninnu
    const handleAddTask = (newTaskObj) => {
        setTasks(prev => [newTaskObj, ...prev]);
    };

    const handleToggle = (id) => {
        setTasks(tasks.map(task =>
            task.id === id ? { ...task, completed: !task.completed } : task
        ));
    };

    const handleDelete = (id) => {
        setTasks(tasks.filter(task => task.id !== id));
    };

    // 5. Stats calculate
    const completedTasks = tasks.filter(t => t.completed).length;
    const pendingTasks = tasks.length - completedTasks;

    if (loading) return <div className="text-center mt-5">Loading...</div>;
    if (error) return <div className="text-center mt-5 text-danger">{error}</div>;

    // ✅ RETURN STATEMENT - JSX STARTS HERE
    return (
        <div style={{ backgroundColor: theme.bg, color: theme.text, minHeight: '100vh' }}>
            <div className="container pt-4" style={{ maxWidth: '800px' }}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1 className="mb-0">Student Task Tracker</h1>
                    <button
                        className="btn btn-outline-primary"
                        onClick={() => setIsDark(!isDark)}
                    >
                        {isDark ? '☀️ Light' : '🌙 Dark'}
                    </button>
                </div>

                <div className="row mb-4">
                    <div className="col-md-4">
                        <StatsCard title="Total Tasks" count={tasks.length} theme={theme} />
                    </div>
                    <div className="col-md-4">
                        <StatsCard title="Completed" count={completedTasks} theme={theme} />
                    </div>
                    <div className="col-md-4">
                        <StatsCard title="Pending" count={pendingTasks} theme={theme} />
                    </div>
                </div>

                <TaskForm onSubmit={handleAddTask} theme={theme} />

                <TaskList
                    tasks={tasks}
                    toggleTask={handleToggle}
                    deleteTask={handleDelete}
                    theme={theme}
                />
            </div>
        </div>
    );
}

export default App;