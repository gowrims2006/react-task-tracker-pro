import axios from 'axios'

// Hardcode cheyyuka - env variable vendilla ippo
const API_URL = 'https://task-tracker-backend-1-nrzf.onrender.com'

console.log('API_URL used:', API_URL) // Debug nu vendi

// useTasks.js il use cheyyunna name thanne kodukkuka
export const getTasks = async () => {
    console.log('Calling API:', `${API_URL}/api/todos`)
    const res = await axios.get(`${API_URL}/api/todos`)
    return res.data
}

export const createTask = async (task) => {
    const res = await axios.post(`${API_URL}/api/todos`, task)
    return res.data
}

export const updateTask = async (id, task) => {
    const res = await axios.put(`${API_URL}/api/todos/${id}`, task)
    return res.data
}

export const deleteTaskApi = async (id) => {
    const res = await axios.delete(`${API_URL}/api/todos/${id}`)
    return res.data
}