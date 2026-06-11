import { useState, useEffect } from 'react';
import StatsCard from './components/StatsCard';
import Button from './components/Button';

function App() {
  // STEP 1: Initial state direct localStorage il ninnu edukkuka
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  const [input, setInput] = useState('');
  const [filter, setFilter] = useState('all');

  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode === 'true';
  });
  const [error, setError] = useState('');

  // STEP 2: Tasks maarumbol localStorage il save cheyyum
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // STEP 3: Mode maarumbol localStorage il save cheyyum
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const addTask = (e) => {
    e.preventDefault();
    if (input.trim() === '') {
      setError('⚠️ Please enter a task first!');
      setTimeout(() => setError(''), 3000);
      return;
    }
    setError('');
    setTasks([...tasks, { id: Date.now(), text: input, completed: false }]);
    setInput('');
  };

  const toggleComplete = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    return true;
  });

  const activeTasks = tasks.filter(task => !task.completed).length;

  return (
    <div style={{
      minHeight: '100vh',
      background: darkMode ? '#000000' : 'linear-gradient(180deg, #0f172a 0%, #1e40af 50%, #3b82f6 100%)',
      color: 'white',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      transition: 'background 0.5s ease'
    }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '24px' }}>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
          <button
            onClick={() => setDarkMode(!darkMode)}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              padding: '12px',
              borderRadius: '8px',
              fontSize: '28px',
              cursor: 'pointer',
              backdropFilter: 'blur(10px)'
            }}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '8px' }}>
          <h1 style={{ fontSize: '48px', fontWeight: 'bold', margin: '0 0 8px 0' }}>
            Student Task Tracker
          </h1>
          <p style={{ fontSize: '18px', color: '#cbd5e1', margin: '0' }}>
            Learn React
          </p>
        </div>

        <div className="stats-container">
          <StatsCard title="Total Tasks" count={tasks.length} />
          <StatsCard title="Completed Tasks" count={tasks.filter(t => t.completed).length} />
          <StatsCard title="Pending Tasks" count={tasks.filter(t => !t.completed).length} />
        </div>

        <div style={{ textAlign: 'center', marginBottom: '24px', fontSize: '20px', color: '#93c5fd' }}>
          {activeTasks} tasks left
        </div>

        {error && (
          <div style={{
            color: '#ff4d4f',
            background: 'rgba(255, 77, 79, 0.15)',
            padding: '10px 16px',
            borderRadius: '6px',
            marginBottom: '16px',
            textAlign: 'center',
            fontSize: '15px',
            fontWeight: '500',
            backdropFilter: 'blur(10px)'
          }}>
            {error}
          </div>
        )}
        <form onSubmit={addTask} style={{ display: 'flex', gap: '8px', marginBottom: '24px', justifyContent: 'center' }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter task"
            style={{
              padding: '10px 16px',
              borderRadius: '6px',
              border: '1px solid rgba(255,255,255,0.2)',
              background: 'rgba(255,255,255,0.1)',
              color: 'white',
              width: '250px',
              fontSize: '16px',
              outline: 'none'
            }}
          />
          <button
            type="submit"
            style={{
              background: '#3b82f6',
              color: 'white',
              padding: '10px 24px',
              border: 'none',
              borderRadius: '6px',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Add Task
          </button>
        </form>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', justifyContent: 'center' }}>
          <button
            onClick={() => setFilter('all')}
            style={{
              padding: '8px 24px',
              borderRadius: '6px',
              border: 'none',
              background: filter === 'all' ? '#3b82f6' : 'rgba(255,255,255,0.1)',
              color: 'white',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            All
          </button>
          <button
            onClick={() => setFilter('pending')}
            style={{
              padding: '8px 24px',
              borderRadius: '6px',
              border: 'none',
              background: filter === 'pending' ? '#3b82f6' : 'rgba(255,255,255,0.1)',
              color: 'white',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('completed')}
            style={{
              padding: '8px 24px',
              borderRadius: '6px',
              border: 'none',
              background: filter === 'completed' ? '#3b82f6' : 'rgba(255,255,255,0.1)',
              color: 'white',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            Completed
          </button>
        </div>

        {filteredTasks.length === 0 ? (
          <div style={{ textAlign: 'center', fontSize: '20px', color: '#cbd5e1' }}>
            No tasks yet!
          </div>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {filteredTasks.map(task => (
              <li
                key={task.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px',
                  marginBottom: '12px',
                  borderRadius: '8px',
                  background: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleComplete(task.id)}
                  style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                />
                <span style={{
                  flex: 1,
                  fontSize: '18px',
                  textDecoration: task.completed ? 'line-through' : 'none',
                  color: task.completed ? '#94a3b8' : 'white'
                }}>
                  {task.text}
                </span>
                <button
                  onClick={() => deleteTask(task.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#f87171',
                    fontSize: '28px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}

      </div>
    </div>
  );
}

export default App;    
