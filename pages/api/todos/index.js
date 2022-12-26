import { todos } from "../../../data/todos"

export default function handler(req, res) {
    if (req.method === 'GET') {
        res.status(200).json(todos)
    } else if (req.method === 'POST') {
        const todo = req.body.todo
        const newTodo = {
            id: Date.now(),
            text: todo
        }
        todos.push(newTodo)
        res.status(201).json(newTodo)
    }
}