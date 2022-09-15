import React, { useState, useEffect } from 'react'

import { AiOutlinePlus } from 'react-icons/ai';
import bgDark from './assets/bg-desktop-dark.jpg'

import Todo from './Todo';
import { db } from './firebase'
import { query, collection, onSnapshot, updateDoc, doc, addDoc, deleteDoc } from 'firebase/firestore';



const style = {
  bg: `h-screen w-screen bg-[#161722]`,
  container: `bg-[#25273C] max-w-[450px]  w-full m-auto rounded-md shadow-xl p-4`,
  heading: `text-3xl font-bold text-center  text-gray-800 p-2`,
  form: `flex justify-between`,
  input: `border p-2 w-full text-xl`,
  button: `border rounded-full p-2 ml-2 text-white`,
  count: `text-center p-2`
}


function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('')

  /* Create todo */
  const createTodo = async (e) => {
    e.preventDefault(e)
    if (input === '') {
      alert('Please enter a valid todo')
      return
    }
    await addDoc(collection(db, 'todos'), {
      text: input,
      completed: false,
    })
    setInput('')
  }



  /* Read todo from firebase */
  useEffect(() => {
    const q = query(collection(db, 'todos'))
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let todosArr = []
      querySnapshot.forEach((doc) => {
        todosArr.push({ ...doc.data(), id: doc.id })
      })
      setTodos(todosArr)
    })
    return () => unsubscribe
  }, [])



  /* Update todo in firebase */
  const toggleComplete = async (todo) => {
    await updateDoc(doc(db, 'todos', todo.id), {
      completed: !todo.completed
    })
  }



  /* Delete todo */
  const deleteTodo = async (id) => {
    await deleteDoc(doc(db, 'todos', id))
  }


  return (
    <div className={style.bg}>
      <div>
        <img src={bgDark} alt="" className='w-screen h-70' />
      </div>
      <div className={style.container}>
        <h3 className={style.heading}>Todo App</h3>
        <form onSubmit={createTodo} className={style.form}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className={style.input}
            type="text"
            placeholder='Create a new todo...'
          />
          <button className={style.button}><AiOutlinePlus size={30} /></button>
        </form>
        <ul>
          {todos.map((todo, index) => (
            <Todo
              key={index}
              todo={todo}
              toggleComplete={toggleComplete}
              deleteTodo={deleteTodo}
            />
          ))}
        </ul>
        {todos.length < 1 ? null : <p className={style.count}>{`You have ${todos.length} todos`}</p>}

      </div>
    </div>
  );
}

export default App;
