import React, { useEffect, useState } from 'react'
import { AiOutlineClose } from 'react-icons/ai'

const TodoPage = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [todos, setTodos] = useState([])
    const [todo, setTodo] = useState('');
    const [scrollbar, setScrollbar] = useState(false)
    // const [theme, setTheme] = useState(false);

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
        if (todo.length < 10) {
            alert("Enter a Todo that is longer than 10 characters")
        } else {
            const response = await fetch('api/todos', {
                method: "POST",
                body: JSON.stringify({ todo }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const data = await response.json()
            console.log(data)

            // clear search filed after todo is submitted
            setTodo("")

            // make another request after new Todo is submitted
            makeRequest()
        }
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

    // const themeToggle = () => {
    //     setTheme(!theme)
    // }

    const completeTodo = async (todoId) => {
        const response = await fetch(`/api/todos/${todoId}`, {
            method: "PUT",
        })
        const data = await response.json()
        console.log(data)

        // make another request after new Todo is submitted
        makeRequest()
    }

    const filteredTodos = todos.filter(val => val.completed === true)

    const deleteCompletedTodos = async () => {
        if (filteredTodos.length < 1) {
            alert("Please complete a Todo before clearing")
        } else {
            const response = await fetch('api/todos', {
                method: "DELETE",
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
    }

    const handleScrollbarDown = () => {
        setScrollbar(true)
    }


    const handleScrollbarUp = () => {
        setScrollbar(false)
    }

    return (
        <div className='bg-[#161722] min-h-screen bg-contain flex justify-center items-center flex-col'>
            <div className='flex flex-row'>
                <input
                    type="text"
                    value={todo}
                    onChange={(e) => setTodo(e.target.value)}
                    className='form-control block px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid
                  border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none'
                />
                <button
                    onClick={submitTodo}
                    className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded 
                    shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800
                    active:shadow-lg transition duration-150 ease-in-out"
                >
                    submit todos
                </button>
            </div>
            <div
                onMouseDown={handleScrollbarDown}
                onMouseUp={handleScrollbarUp}
                className={`mt-4 max-w-md w-[27em]  max-h-[600px] 
                    ${todos.length >= 8 ? 'overflow-y-scroll scrollbar scrollbar-thumb-rounded-md scrollbar-track-[#393a4c]' : ''}
                    ${scrollbar ? "scrollbar-thumb-[#aaacb8]" : "scrollbar-thumb-[#4d5066]"} px-4 bg-[#25273c] rounded-sm shadow-2xl`}
            >
                {todos.map((todo) => {
                    return (
                        <div key={todo.id} className='border-b py-5 border-[#393a4c] justify-between flex text-[#d2d3db] max-w-xl font-normal'>
                            <div className={`cursor-pointer ${todo.completed ? "line-through" : ''}`} onClick={() => completeTodo(todo.id)}>
                                {todo.id} {todo.text}
                            </div>
                            <button
                                onClick={() => deleteTodo(todo.id)}
                                className='ml-5 px-6  text-[#484b6a] text-lg'><AiOutlineClose /></button>
                        </div>
                    )
                })}
            </div>
            <div className='mt-4 max-w-md w-[27em] flex justify-between bg-[#25273c] rounded-md shadow-2xl'>
                <h2 className='text-slate-50'>{todos.length - filteredTodos.length} items left</h2>
                <button className='text-white' onClick={deleteCompletedTodos}>clear completed todos</button>
            </div>
        </div>
    )
}


export default TodoPage