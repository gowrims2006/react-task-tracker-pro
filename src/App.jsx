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

    const theme = {
        inputBg: '#1c1c1e',
        text: '#fff',
        border: '#38383a',
        blue: '#0a84ff'
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

    // ✅ '/' KALANJU. INI SHERI AAYI
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
        <div className="container mt-4" style={{ maxWidth: '800px' }}>
            <h1 className="text-center mb-4">Student Task Tracker</h1>

            <div className="row mb-4">
                <div className="col-md-4">
                    <StatsCard title="Total Tasks" count={tasks.length} />
                </div>
                <div className="col-md-4">
                    <StatsCard title="Completed" count={completedTasks} />
                </div>
                <div className="col-md-4">
                    <StatsCard title="Pending" count={pendingTasks} />
                </div>
            </div>

            <TaskForm onSubmit={handleAddTask} theme={theme} />

            <TaskList
                tasks={tasks}
                toggleTask={handleToggle}
                deleteTask={handleDelete}
            />
        </div>
    ); // ✅ RETURN ENDS HERE
} // ✅ FUNCTION ENDS HERE

export default App;