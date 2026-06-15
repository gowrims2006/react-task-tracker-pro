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

    // Theme object - nee use cheyyunna same
    const theme = {
        inputBg: '#1c1c1e',
        text: '#fff',
        border: '#38383a',
        blue: '#0a84ff'
    };

    // 1. GET API - first 10 tasks load cheyyan
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

    // 2. POST API - TaskForm il ninnu kittunna object add cheyyan
    const handleAddTask = (newTaskObj) => {
        setTasks(prev => [newTaskObj, ...prev]); // Top il add cheyyum
    };

    // 3. Stats calculate cheyyan
    const completedTasks = tasks.filter(t => t.completed).length;
    const pendingTasks = tasks.length - completedTasks;

    if (loading) return <div className="text-center mt-5">Loading...</div>;
    if (error) return <div className="text-center mt-5 text-danger">{error}</div>;

    return (
        <div className="container mt-4" style={{ maxWidth: '800px' }}>
            <h1 className="text-center mb-4">Student Task Tracker</h1>

            {/* StatsCard - 5 marks kittan */}
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

            {/* TaskForm - POST API connect cheythathu */}
            <TaskForm onSubmit={handleAddTask} theme={theme} />

            {/* TaskList - tasks display cheyyan */}
            <TaskList
                tasks={tasks}
                toggleTask={handleToggle}
                deleteTask={handleDelete}
            />
        </div>
    );
}

export default App;