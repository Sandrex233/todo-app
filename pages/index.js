import React, { useEffect, useState } from 'react'


const TodoPage = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [todos, setTodos] = useState([])
    const [todo, setTodo] = useState('');

    // fetching todos
    useEffect(() => {
        async function fetchTodos() {
            const response = await fetch('api/todos')
            const data = await response.json()
            setTodos(data)
            setIsLoading(false)
        }
        fetchTodos()
    }, []);

    if (isLoading) {
        return <h2>Loading...</h2>
    }

    const makeRequest = async () => {
        const response = await fetch('api/todos')
        const data = await response.json()
        setTodos(data)
        setIsLoading(false)
    }


    const submitTodo = async () => {
        const response = await fetch('api/todos', {
            method: "POST",
            body: JSON.stringify({ todo }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const data = await response.json()
        console.log(data)

        // make another request after new Todo is submitted
        makeRequest()
    }


    const deleteTodo = async (todoId) => {
        const response = await fetch(`/api/todos/${todoId}`, {
            method: "DELETE",
        })
        const data = await response.json()
        console.log(data)

        // make another request after new Todo is submitted
        makeRequest()
    }

    return (
        <div>
            <div className='flex flex-row'>
                <input
                    type="text"
                    value={todo}
                    onChange={(e) => setTodo(e.target.value)}
                    className='form-control block px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none'
                />
                <button
                    onClick={submitTodo}
                    className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                >
                    submit todos
                </button>
            </div>
            {todos.map((todo) => {
                return (
                    <div key={todo.id}>
                        {todo.id} {todo.text}
                        <button
                            onClick={() => deleteTodo(todo.id)}
                            className='ml-5 class="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"'>Delete</button>
                    </div>)
            })}
            <h2>{todos.length}</h2>
        </div>
    )
}


export default TodoPage