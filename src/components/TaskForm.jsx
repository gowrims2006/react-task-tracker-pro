import { useState } from "react";
import { createTask } from '../services/api'; // ✅ 1. ITHU ADD CHEYYU - TOP IL

function TaskForm({ onSubmit, theme }) {
    const [task, setTask] = useState("");
    const [showError, setShowError] = useState(false);
    const [loading, setLoading] = useState(false); // ✅ 2. ITHU ADD CHEYYU

    // ✅ 3. handleSubmit FULL MAATTI ITHAKKU
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!task.trim()) {
            setShowError(true);
            setTimeout(() => setShowError(false), 3000);
            return;
        }

        setLoading(true); // Loading start
        setShowError(false);

        try {
            // API call cheyyunnu
            const newTask = await createTask({
                title: task.trim(),
                completed: false
            });

            // App.jsx il ulla state update cheyyan
            onSubmit({
                id: newTask.id,
                title: newTask.title,
                completed: false
            });

            setTask(""); // Clear input
        } catch (err) {
            setShowError(true); // Error vannal same message kaani
            setTimeout(() => setShowError(false), 3000);
        } finally {
            setLoading(false); // Loading stop
        }
    };

    return (
        <>
            {showError && (
                <div
                    className="mb-3 p-3 rounded-3 text-center"
                    style={{
                        background: '#ff453a33',
                        color: '#ff453a',
                        border: `1px solid #ff453a`
                    }}
                >
                    ⚠️ Please enter a task first!
                </div>
            )}

            <form onSubmit={handleSubmit} className="mb-3">
                <div className="d-flex gap-2">
                    <input
                        type="text"
                        placeholder="Enter task"
                        value={task}
                        onChange={(e) => setTask(e.target.value)}
                        className="form-control"
                        disabled={loading} // ✅ Loading time disable cheyyum
                        style={{
                            background: theme.inputBg,
                            color: theme.text,
                            border: `1px solid ${theme.border}`,
                            padding: '12px',
                            borderRadius: '8px'
                        }}
                    />
                    <button
                        type="submit"
                        disabled={loading} // ✅ Loading time disable cheyyum
                        className="px-4 rounded-3"
                        style={{
                            background: theme.blue,
                            color: '#fff',
                            border: 'none',
                            fontWeight: '600',
                            whiteSpace: 'nowrap',
                            opacity: loading ? 0.6 : 1 // ✅ Loading il dim aakum
                        }}
                    >
                        {loading ? 'Adding...' : 'Add Task'} {/* ✅ Text maaran */}
                    </button>
                </div>
            </form>
        </>
    );
}

export default TaskForm;