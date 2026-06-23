import axios from 'axios'

const API_URL = 'https://task-tracker-backend-1-nrzf.onrender.com' // ← /api/todos kalayuka

export const getTodos = async () => {
    console.log('Calling API:', `${API_URL}/api/todos`)
    const res = await axios.get(`${API_URL}/api/todos`) // ← ivide add cheyyu
    return res.data
}

export const addTodos = async (title) => {
    const res = await axios.post(`${API_URL}/api/todos`, { title }) // ← ivide add cheyyu
    return res.data
}

export const toggleTodos = async (id, completed) => {
    const res = await axios.put(`${API_URL}/api/todos/${id}`, { completed }) // ← ippo sheri aayi
    return res.data
}

export const deleteTodos = async (id) => {
    const res = await axios.delete(`${API_URL}/api/todos/${id}`) // ← ippo sheri aayi
    return res.data
}