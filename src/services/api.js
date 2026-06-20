const BASE_URL = 'https://task-tracker-backend-sbca.onrender.com';

export const getTasks = async () => {
    const res = await fetch(`${BASE_URL}/tasks`);
    if (!res.ok) throw new Error('Failed to fetch tasks');
    return await res.json();
};

export const createTask = async (taskData) => {
    const res = await fetch(`${BASE_URL}/tasks`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            title: taskData.title,
            completed: taskData.completed || false
        })
    });

    if (!res.ok) throw new Error('Failed to create task');
    return await res.json();
};

export const deleteTaskApi = async (id) => {
    const res = await fetch(`${BASE_URL}/tasks/${id}`, {
        method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete task');
    return await res.json();
};

export const updateTask = async (id, taskData) => {
    const res = await fetch(`${BASE_URL}/tasks/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData)
    });
    if (!res.ok) throw new Error('Failed to update task');
    return await res.json();
};