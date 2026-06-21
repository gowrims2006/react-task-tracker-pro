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