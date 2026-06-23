import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);

  // ✅ POPUP INU VENDI 2 STATE
  const [showModal, setShowModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const API_URL = 'http://localhost:3001/api/todos';

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setTasks(data.map(t => ({
        id: t._id,
        title: t.title,
        completed: t.completed || false
      })));
      setError('');
    } catch (err) {
      setError('Failed to load tasks?');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!title.trim()) {
      setError('Please enter a task!');
      return;
    }
    if (title.trim().length < 3) {
      setError('Task must be at least 3 characters!');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title })
      });
      const newTask = await response.json();
      setTasks([...tasks, {
        id: newTask._id,
        title: newTask.title,
        completed: newTask.completed
      }]);
      setTitle('');
    } catch (err) {
      setError('Failed to add task. Try again!');
    } finally {
      setLoading(false);
    }
  };

  // ✅ STEP 1: DELETE CLICK CHEYYUMBOL POPUP SHOW CHEYYIKKUM
  const handleDeleteClick = (id) => {
    setTaskToDelete(id);
    setShowModal(true);
  };

  // ✅ STEP 2: "YES DELETE" ADICHAL MATHRAM DELETE AAVUM
  const confirmDelete = async () => {
    try {
      await fetch(`${API_URL}/${taskToDelete}`, {
        method: 'DELETE'
      });
      setTasks(tasks.filter(task => task.id !== taskToDelete));
      setShowModal(false);
      setTaskToDelete(null);
    } catch (err) {
      setError('Failed to delete task');
      setShowModal(false);
      setTaskToDelete(null);
    }
  };

  // ✅ STEP 3: "NO CANCEL" ADICHAL POPUP CLOSE AAVUM
  const cancelDelete = () => {
    setShowModal(false);
    setTaskToDelete(null);
  };

  const toggleTask = async (id) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    try {
      await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !task.completed })
      });
      setTasks(tasks.map(t =>
        t.id === id ? { ...t, completed: !t.completed } : t
      ));
    } catch (err) {
      setError('Failed to update task');
    }
  };

  const completed = tasks.filter(t => t.completed).length;
  const pending = tasks.length - completed;

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    return true;
  });

  return (
    <div className={darkMode ? 'app-dark' : 'app-light'}>
      <div className="container">
        <div className="header">
          <h1>Student Task Tracker 🚀</h1>
          <button className="mode-btn" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>

        <div className="stats">
          <div className="stat-card">
            <p>Total Tasks</p>
            <h2>{tasks.length}</h2>
          </div>
          <div className="stat-card">
            <p>Completed</p>
            <h2>{completed}</h2>
          </div>
          <div className="stat-card">
            <p>Pending</p>
            <h2>{pending}</h2>
          </div>
        </div>

        {error && <div className="error">{error}</div>}

        <div className="input-group">
          <input
            value={title}
            onChange={e => {
              setTitle(e.target.value);
              setError('');
            }}
            placeholder="Enter task"
            onKeyPress={e => e.key === 'Enter' && handleAdd()}
            disabled={loading}
          />
          <button className="add-btn" onClick={handleAdd} disabled={loading}>
            {loading ? 'Adding...' : 'Add Task'}
          </button>
        </div>

        <div className="filters">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({tasks.length})
          </button>
          <button
            className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Pending ({pending})
          </button>
          <button
            className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completed ({completed})
          </button>
        </div>

        <div className="task-list">
          {loading && tasks.length === 0 ? (
            <p className="empty">Loading tasks... ⏳</p>
          ) : filteredTasks.length === 0 ? (
            <p className="empty">No tasks found. Add one above! 🔍</p>
          ) : (
            filteredTasks.map(task => (
              <div key={task.id} className={`task-item ${task.completed ? 'done' : ''}`}>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                />
                <span>{task.title}</span>
                <button className="delete-btn" onClick={() => handleDeleteClick(task.id)}>
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ✅ DELETE POPUP MODAL */}
      {showModal && (
        <div className="modal-overlay" onClick={cancelDelete}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Warning</h3>
            <p>Are you sure you want to delete this task?</p>
            <div className="modal-buttons">
              <button onClick={cancelDelete} className="cancel-btn">No, Cancel</button>
              <button onClick={confirmDelete} className="delete-confirm-btn">Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;