<<<<<<< HEAD
import axios from 'axios'

const API_URL = 'http://localhost:3001/api/todos'

export const getTodos = async () => {
    const res = await axios.get(API_URL)
    return res.data
}

export const addTodos = async (title) => {
    const res = await axios.post(API_URL, { title })
    return res.data
}

export const toggleTodos = async (id, completed) => {
    const res = await axios.put(`${API_URL}/${id}`, { completed })
    return res.data
}

export const deleteTodos = async (id) => {
    const res = await axios.delete(`${API_URL}/${id}`)
    return res.data
}
=======
const TASKS_KEY = 'student_tasks_v3';

export const getTasks = async () => {
    try {
        const data = localStorage.getItem(TASKS_KEY);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
};

export const addTask = async (text) => {
    const tasks = await getTasks();
    const newTask = {
        id: Date.now(),
        text: text.trim(),
        completed: false
    };
    const updated = [...tasks, newTask];
    localStorage.setItem(TASKS_KEY, JSON.stringify(updated));
    return newTask;
};

export const deleteTask = async (id) => {
    const tasks = await getTasks();
    const updated = tasks.filter(t => t.id !== id);
    localStorage.setItem(TASKS_KEY, JSON.stringify(updated));
};

export const toggleTask = async (id) => {
    const tasks = await getTasks();
    const updated = tasks.map(t =>
        t.id === id ? { ...t, completed: !t.completed } : t
    );
    localStorage.setItem(TASKS_KEY, JSON.stringify(updated));
    return updated.find(t => t.id === id);
};
>>>>>>> 66e15048bde61557dd0e13fbaa4da240f80e8fa9
