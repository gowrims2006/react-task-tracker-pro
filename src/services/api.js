import axios from 'axios'

const API_URL = 'http://localhost:3001/api/todos'

export const getTodos = async () => {
    const res = await axios.get(API_URL)
    return res.data
}

export const addTodos = async (title) => {
    const res = await axios.post(API_URL, { title })
    return res.data
}

export const toggleTodos = async (id, completed) => {
    const res = await axios.put(`${API_URL}/${id}`, { completed })
    return res.data
}

export const deleteTodos = async (id) => {
    const res = await axios.delete(`${API_URL}/${id}`)
    return res.data
}