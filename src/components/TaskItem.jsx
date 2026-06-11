import React from "react";

function TaskItem({ task, toggleTask, deleteTask }) {
    return (
        <li className="task-item">
            <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
            />
            <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                {task.text}
            </span>
            <button onClick={() => deleteTask(task.id)}>Delete</button>
        </li>
    );
}

export default TaskItem;