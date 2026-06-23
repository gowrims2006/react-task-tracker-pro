import { useState, useEffect } from 'react';
import { getTasks, createTask, deleteTaskApi, updateTask } from '../services/api';

export const useTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchTasks = async () => {
        try {
            console.log('fetchTasks started');
            setLoading(true);
            setError('');
            const data = await getTasks();
            console.log('Data from API:', data);
            setTasks(data);
        } catch (err) {
            console.error('FETCH ERROR:', err);
            setError('Failed to load tasks. Check connection.');
        } finally {
            setLoading(false);
        }
    };

    const addTask = async (title, completed = false) => {
        if (!title.trim()) return;
        try {
            const newTask = await createTask({ title, completed });
            setTasks(prev => [newTask, ...prev]);
            return newTask;
        } catch (err) {
            setError('Failed to add task');
            console.error(err);
        }
    };

    const deleteTask = async (id) => {
        try {
            await deleteTaskApi(id);
            setTasks(prev => prev.filter(task => task._id !== id)); // MongoDB _id
        } catch (err) {
            setError('Failed to delete task');
            console.error(err);
        }
    };

    const toggleComplete = async (id) => {
        const task = tasks.find(t => t._id === id); // MongoDB _id
        if (!task) return;
        try {
            const updated = await updateTask(id, { ...task, completed: !task.completed });
            setTasks(prev => prev.map(t =>
                t._id === id ? updated : t // MongoDB _id
            ));
        } catch (err) {
            setError('Failed to update task');
            console.error(err);
        }
    };

    useEffect(() => {
        console.log('useTasks mounted, calling fetchTasks');
        fetchTasks();
    }, []);

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