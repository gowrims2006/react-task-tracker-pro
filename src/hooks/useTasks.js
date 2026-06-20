import { useState, useEffect } from 'react';
import { getTasks, createTask } from '../services/api';

export const useTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Part 1: GET API + Part 2: Loading State + Part 3: Error Handling
    const fetchTasks = async () => {
        try {
            setLoading(true);
            setError('');
            const data = await getTasks(); // api.js il ninnu varunnu
            setTasks(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Part 4: POST API Integration
    const addTask = async (title, completed = false) => {
        if (!title.trim()) return; // Empty aanel stop

        try {
            const newTask = await createTask({
                title,
                completed,
                userId: 1
            });
            setTasks(prev => [{ ...newTask, id: Date.now() }, ...prev]);
            return newTask;
        } catch (err) {
            setError(err.message);
        }
    };

    // Page load aavumbol automatic aayi data edukkan
    useEffect(() => {
        fetchTasks();
    }, []);
    const deleteTask = async (id) => {
        try {
            await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
                method: 'DELETE'
            });
            setTasks(prev => prev.filter(task => task.id !== id));
        } catch (err) {
            setError(err.message);
        }
    };

    const toggleComplete = (id) => {
        setTasks(prev => prev.map(task =>
            task.id === id ? { ...task, completed: !task.completed } : task
        ));
    };

    return {
        tasks,
        loading,
        error,
        addTask,
        deleteTask,      // ✅ ADD CHEYTHU
        toggleComplete,  // ✅ ADD CHEYTHU
        refetch: fetchTasks
    };
};