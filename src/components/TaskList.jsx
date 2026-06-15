import React from "react";
import TaskItem from "./TaskItem"; // <-- Importing the child component

function TaskList({ tasks, toggleTask, deleteTask, theme }) {
    return (
        <ul className="list-group mt-4">
            {tasks.map(task => (
                <TaskItem
                    key={task.id}
                    task={task}
                    toggleTask={toggleTask}
                    deleteTask={deleteTask}
                    theme={theme}
                />
            ))}
        </ul>
    );
}

export default TaskList;