import React, { useEffect, useState } from 'react'
import { Reorder } from "framer-motion"
import { AiOutlineClose } from 'react-icons/ai'
import checkIcon from '../assets/images/icon-check.svg'
import Image from 'next/image'
import bgDesktop from '../assets/images/bg-desktop-dark.jpg'


const TodoPage = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [todos, setTodos] = useState([])
    const [todo, setTodo] = useState('');
    const [scrollbar, setScrollbar] = useState(false)
    const [currentIndex, setCurrentIndex] = useState(0);

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

        // make another request after new Todo is submitted
        makeRequest()
    }

    const completeTodo = async (todoId) => {
        const response = await fetch(`/api/todos/${todoId}`, {
            method: "PUT",
        })
        const data = await response.json()

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

    const handleButtonIndex = index => {
        setCurrentIndex(index)
    }

    const handlefitlerTodos = () => {
        if (currentIndex === 1) {
            return todos.filter(val => val.completed !== true)
        } else if (currentIndex === 2) {
            return todos.filter(val => val.completed === true)
        } else {
            return todos
        }
    }

    return (
        <div className={`bg-[#161722] min-h-screen bg-contain flex justify-center items-center flex-col`}
        >
            <div className='relative flex flex-row space-x-2 justify-center items-center'>
                <input
                    type="text"
                    value={todo}
                    placeholder="Create a new todo..."
                    onChange={(e) => setTodo(e.target.value)}
                    className='block px-1 md:px-3 py-3 max-w-md w-[18em] md:w-[24.8em] text-base font-normal text-[#cacdec] bg-clip-padding
          bg-[#25273c] rounded-md transition ease-in-out m-0 '
                />
                <button
                    onClick={submitTodo}
                    className="border w-7 h-7 rounded-full"
                >
                </button>

            </div>
            <div
                onMouseDown={handleScrollbarDown}
                onMouseUp={handleScrollbarUp}
                className={`mt-4 max-w-md w-[20em] md:w-[27em] max-h-[600px] 
                ${todos.length >= 8 ? 'overflow-y-scroll scrollbar scrollbar-thumb-rounded-md scrollbar-track-[#393a4c]' : ''}
                scrollbar-thumb-[#4d5066] px-4 bg-[#25273c] rounded-lg shadow-2xl`}
            >
                <Reorder.Group axis="y" values={todos} onReorder={setTodos}>
                    {handlefitlerTodos().map((todo) => {
                        return (
                            <Reorder.Item
                                key={todo.id}
                                value={todo}
                                className={`border-b py-5 border-[#393a4c] justify-between flex text-[#d2d3db] max-w-xl font-normal`}
                            >
                                <div className="flex items-center">
                                    <div
                                        className={`w-5 h-5 mr-4 rounded-full select-none flex-shrink-0 cursor-pointer ${todo.completed ? 'bg-gradient-to-br from-blue-400 to-purple-500 border-0' : 'border-[#393a4c] border-2'}`}
                                        onClick={() => completeTodo(todo.id)}
                                    >
                                        {todo.completed && (
                                            <div className="flex justify-center items-center w-full h-full">
                                                <Image
                                                    src={checkIcon}
                                                    alt="checkIcon"
                                                    className="w-3 h-3"
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <div className={`cursor-pointer  select-none ${todo.completed ? "line-through text-[#545672]" : 'text-[#cacdec]'}`} onClick={() => completeTodo(todo.id)}>
                                        {todo.text}
                                    </div>
                                </div>
                                <button
                                    onClick={() => deleteTodo(todo.id)}
                                    className='ml-5 px-6 text-[#484b6a] text-lg'
                                >
                                    <AiOutlineClose />
                                </button>
                            </Reorder.Item>
                        )
                    })}
                </Reorder.Group>
                <div className='text-base py-5 flex justify-between bg-[#25273c] rounded-md shadow-2xl'>
                    <h2 className='text-[#484b6a]'>{todos.length - filteredTodos.length} items left</h2>
                    <button className='text-[#484b6a]' onClick={deleteCompletedTodos}>Clear Completed</button>
                </div>
            </div>
            <div className='text-base text-[#5e606e] mt-6 py-3 flex items-center justify-center space-x-5 bg-[#25273c] rounded-lg shadow-2xl max-w-md w-[20em] md:w-[27em]'>
                <button onClick={() => handleButtonIndex(0)} className={`${currentIndex === 0 ? "text-blue-600" : ''} capitalize`}>all</button>
                <button onClick={() => handleButtonIndex(1)} className={`${currentIndex === 1 ? "text-blue-600" : ''} capitalize`}>active</button>
                <button onClick={() => handleButtonIndex(2)} className={`${currentIndex === 2 ? "text-blue-600" : ''} capitalize`}>completed</button>
            </div>
            <p className="text-[#5e606e] text-xs md:text-base mt-8">Drag and drop to reorder list</p>
        </div>
    )
}


export default TodoPage