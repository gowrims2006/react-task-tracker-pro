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

  // ✅ LOCALSTORAGE NINNU LOAD CHEYYUKA
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = () => {
    setLoading(true);
    setError('');
    try {
      const saved = localStorage.getItem('tasks');
      setTasks(saved ? JSON.parse(saved) : []);
    } catch (err) {
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const saveTasks = (newTasks) => {
    localStorage.setItem('tasks', JSON.stringify(newTasks));
    setTasks(newTasks);
  };

  const handleAdd = () => {
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

    const newTask = {
      id: Date.now(),
      title: title.trim(),
      completed: false
    };

    const updatedTasks = [...tasks, newTask];
    saveTasks(updatedTasks);
    setTitle('');
    setLoading(false);
  };

  // ✅ STEP 1: DELETE CLICK CHEYYUMBOL POPUP SHOW CHEYYIKKUM
  const handleDeleteClick = (id) => {
    setTaskToDelete(id);
    setShowModal(true);
  };

  // ✅ STEP 2: "YES DELETE" ADICHAL MATHRAM DELETE AAVUM
  const confirmDelete = () => {
    const updatedTasks = tasks.filter(task => task.id !== taskToDelete);
    saveTasks(updatedTasks);
    setShowModal(false);
    setTaskToDelete(null);
  };

  // ✅ STEP 3: "NO CANCEL" ADICHAL POPUP CLOSE AAVUM
  const cancelDelete = () => {
    setShowModal(false);
    setTaskToDelete(null);
  };

  const toggleTask = (id) => {
    const updatedTasks = tasks.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    saveTasks(updatedTasks);
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