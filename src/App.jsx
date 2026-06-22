// GET cheyyumbo
const loadTasks = async () => {
    setLoading(true);
    try {
        const data = await getTasks();
        // MongoDB _id and 'task' field use cheyyu
        const formatted = data.map(t => ({
            id: t._id,           // MongoDB _id
            title: t.task,       // Backend 'task' field
            completed: t.completed
        }));
        setTasks(formatted);
    } catch (err) {
        setError('Failed to load tasks');
    }
    setLoading(false);
};