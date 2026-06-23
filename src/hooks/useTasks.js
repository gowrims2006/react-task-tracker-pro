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
            setError('Failed to load tasks. Check connection.');
            console.error(err); // Debug nu vendi
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

    useEffect(() => {
        fetchTasks();
    }, []);

    const deleteTask = async (id) => {
        try {
            await deleteTaskApi(id);
            setTasks(prev => prev.filter(task => task._id !== id)); // ← _id aaki maatti
        } catch (err) {
            setError('Failed to delete task');
            console.error(err);
        }
    };

    const toggleComplete = async (id) => {
        const task = tasks.find(t => t._id === id); // ← _id aaki maatti
        if (!task) return;
        try {
            const updated = await updateTask(id, { ...task, completed: !task.completed });
            setTasks(prev => prev.map(task =>
                task._id === id ? updated : task  // ← _id aaki maatti
            ));
        } catch (err) {
            setError('Failed to update task');
            console.error(err);
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