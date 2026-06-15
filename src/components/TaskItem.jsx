import React from "react";

function TaskItem({ task, toggleTask, deleteTask }) {
    return (
        <li
            className="d-flex align-items-center justify-content-between p-3 mb-2 rounded-3"
            style={{ background: '#1c1c1e', border: '1px solid #38383a' }}
        >
            <div className="d-flex align-items-center gap-3">
                <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                    style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                />
                {/* ✅ ITHU UNDENNU URAPPAKKU - TITLE */}
                <span
                    style={{
                        color: '#fff',
                        textDecoration: task.completed ? 'line-through' : 'none',
                        opacity: task.completed ? 0.5 : 1
                    }}
                >
                    {task.title}
                </span>
            </div>

            {/* ✅ DELETE BUTTON */}
            <button
                onClick={() => deleteTask(task.id)}
                className="btn btn-sm"
                style={{ background: '#ff453a', color: '#fff' }}
            >
                Delete
            </button>
        </li>
    );
}

export default TaskItem;