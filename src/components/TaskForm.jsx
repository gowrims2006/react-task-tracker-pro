import { useState } from "react";

function TaskForm({ onSubmit, theme }) {
    const [task, setTask] = useState("");
    const [showError, setShowError] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!task.trim()) {
            setShowError(true);
            setTimeout(() => setShowError(false), 3000);
            return;
        }
        onSubmit(task);
        setTask("");
        setShowError(false);
    };

    return (
        <>
            {/* ✅ FIXED ERROR MESSAGE */}
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
                        className="px-4 rounded-3"
                        style={{
                            background: theme.blue,
                            color: '#fff',
                            border: 'none',
                            fontWeight: '600',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        Add Task
                    </button>
                </div>
            </form>
        </>
    );
}

export default TaskForm;