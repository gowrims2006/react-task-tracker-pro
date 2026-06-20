function TaskItem({ task, toggleTask, deleteTask }) {
    return (
        <li className="list-group-item d-flex justify-content-between align-items-center mb-2">
            <div className="d-flex align-items-center gap-3">
                <input
                    type="checkbox"
                    className="form-check-input"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                />
                <span style={{
                    textDecoration: task.completed ? 'line-through' : 'none',
                    opacity: task.completed ? 0.6 : 1
                }}>
                    {task.title}
                </span>
            </div>
            <button
                className="btn btn-danger btn-sm"
                onClick={() => deleteTask(task.id)}
            >
                Delete
            </button>
        </li>
    );
}

export default TaskItem;