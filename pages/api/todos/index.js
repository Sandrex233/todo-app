import { todos } from "../../../data/todos"

export default function handler(req, res) {
    if (req.method === 'GET') {
        res.status(200).json(todos)
    } else if (req.method === 'POST') {
        const todo = req.body.todo
        const newTodo = {
            id: Date.now(),
            text: todo,
            completed: false
        }
        todos.push(newTodo)
        res.status(201).json(newTodo)
    } else if (req.method === 'DELETE') {
        const deletedTodos = todos.filter(val => val.completed === true)

        for (let i = 0; i < todos.length; i++) {
            let index = todos.indexOf(deletedTodos[i])
            if (index > -1) {
                todos.splice(index, 1)
            }
        }
        res.status(200).json(deletedTodos)
    }
}