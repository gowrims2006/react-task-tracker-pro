import { useState, useEffect } from 'react';
import { getTasks, createTask, deleteTaskApi, updateTask } from '../services/api';

export const useTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchTasks = async () => {
        try {
            setLoading(true);
            setError('');
            const data = await getTasks();
            setTasks(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const addTask = async (title, completed = false) => {
        if (!title.trim()) return;
        try {
            const newTask = await createTask({
                title,
                completed
            });
            setTasks(prev => [newTask, ...prev]); // Date.now() venda, backend id tharum
            return newTask;
        } catch (err) {
            setError(err.message);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const deleteTask = async (id) => {
        try {
            await deleteTaskApi(id);
            setTasks(prev => prev.filter(task => task.id !== id));
        } catch (err) {
            setError(err.message);
        }
    };

    const toggleComplete = async (id) => {
        const task = tasks.find(t => t.id === id);
        try {
            const updated = await updateTask(id, { ...task, completed: !task.completed });
            setTasks(prev => prev.map(task =>
                task.id === id ? updated : task
            ));
        } catch (err) {
            setError(err.message);
        }
    };

    return {
        tasks,
        loading,
        error,
        addTask,
        deleteTask,
        toggleComplete,
        refetch: fetchTasks
    };
};