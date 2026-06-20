
const BASE_URL = 'https://jsonplaceholder.typicode.com';

export const getTasks = async () => {
    const res = await fetch(`${BASE_URL}/todos?_limit=10`);
    if (!res.ok) throw new Error('Failed to fetch tasks');
    return await res.json();
};

export const createTask = async (taskData) => {
    const res = await fetch(`${BASE_URL}/posts`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            title: taskData.title,
            body: taskData.description || 'No description',
            userId: 1,
            completed: taskData.completed || false
        })
    });

    if (!res.ok) throw new Error('Failed to create task');
    return await res.json();
};