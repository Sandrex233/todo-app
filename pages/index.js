import React, { useEffect, useState } from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import { BsSun, BsMoon } from 'react-icons/bs'
import checkIcon from '../assets/images/icon-check.svg'
import Image from 'next/image'


const TodoPage = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [todos, setTodos] = useState([])
    const [todo, setTodo] = useState('');
    const [scrollbar, setScrollbar] = useState(false)
    const [currentIndex, setCurrentIndex] = useState(0);
    const [theme, setTheme] = useState(false);

    const [draggedIndex, setDraggedIndex] = useState(null);
    const [hoverIndex, setHoverIndex] = useState(null);


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

    const handleTheme = () => {
        setTheme(!theme)
    }

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

    const handleDragStart = (e, index) => {
        // Set the data being dragged and the index of the item being dragged
        e.dataTransfer.setData("index", index);
        setDraggedIndex(index);
    };

    const handleDragOver = (e, index) => {
        e.preventDefault();
        setHoverIndex(index);
    };

    const handleDrop = (e, index) => {
        const oldIndex = e.dataTransfer.getData("index");
        const newTodos = [...todos];
        const [draggedItem] = newTodos.splice(oldIndex, 1);
        newTodos.splice(index, 0, draggedItem);
        setTodos(newTodos);
        setHoverIndex(-1);
    };

    const handleDragEnd = () => {
        setHoverIndex(-1);
    };


    return (
        <div className={`${theme ? 'bg-white' : 'bg-[#161722]'} min-h-screen bg-contain flex justify-center items-center flex-col`}>
            <div className='mb-5' onClick={handleTheme} >{theme ? <BsMoon size={50} color='black' /> : <BsSun size={50} color='white' />}</div>
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
                scrollbar-thumb-[#4d5066] px-4 bg-[#25273c] rounded-sm shadow-2xl`}
            >
                {handlefitlerTodos().map((todo, index) => {
                    return (
                        <div
                            key={todo.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDragOver={(e) => handleDragOver(e, index)}
                            onDrop={(e) => handleDrop(e, index)}
                            onDragEnd={handleDragEnd}
                            className={`border-b py-5 border-[#393a4c] justify-between flex text-[#d2d3db] max-w-xl font-normal ${index === hoverIndex ? "bg-gray-600" : ""}`}
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
                                <div className={`cursor-pointer select-none ${todo.completed ? "line-through" : ''}`} onClick={() => completeTodo(todo.id)}>
                                    {todo.text}
                                </div>
                            </div>
                            <button
                                onClick={() => deleteTodo(todo.id)}
                                className='ml-5 px-6 text-[#484b6a] text-lg'
                            >
                                <AiOutlineClose />
                            </button>
                        </div>
                    )
                })}
            </div>
            <div className='mt-4 max-w-md w-[27em] flex justify-between bg-[#25273c] rounded-md shadow-2xl'>
                <h2 className='text-slate-50'>{todos.length - filteredTodos.length} items left</h2>
                <button className='text-white' onClick={deleteCompletedTodos}>clear completed todos</button>
            </div>
            <div className='space-x-5 text-white'>
                <button onClick={() => handleButtonIndex(0)} className={currentIndex === 0 ? "text-blue-600" : ''}>all</button>
                <button onClick={() => handleButtonIndex(1)} className={currentIndex === 1 ? "text-blue-600" : ''}>active</button>
                <button onClick={() => handleButtonIndex(2)} className={currentIndex === 2 ? "text-blue-600" : ''}>completed</button>
            </div>
        </div>
    )
}


export default TodoPage