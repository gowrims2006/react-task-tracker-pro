import React from "react";
import TaskItem from "./TaskItem"; // <-- Importing the child component

function TaskList({ tasks, toggleTask, deleteTask }) {
    if (tasks.length === 0) {
        return <p style={{ color: "#888", marginTop: "20px" }}>No tasks yet!</p>;
    }

    return (
        <ul style={{ listStyleType: "none", padding: 0, marginTop: "20px" }}>
            {tasks.map((task) => (
                <TaskItem
                    key={task.id}
                    task={task}
                    toggleTask={toggleTask}
                    deleteTask={deleteTask}
                />
            ))}
        </ul>
    );
}

export default TaskList;