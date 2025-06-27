import React from 'react'
import { useState,useEffect } from 'react'


import axios from 'axios'

const App = () => {
  const [newTodo, setNewTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [editingTodo, setEditingTodo] = useState(null);
  const [editedText, setEditedText] = useState("");

  const addTodo = async (e)=>{
    e.preventDefault();
    if(!newTodo.trim()) return;
    try {
      const response = await axios.post('/api/todos', {text : newTodo})
      setTodos([...todos, response.data]);
      console.log(todos.length, todos);
      setNewTodo('');
    } catch (error) {
      console.log(error);
    }
  }
  const fetchTodos = async()=>{
    try {
      const response = await axios.get('/api/todos');
      setTodos(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(()=>{
    fetchTodos();
  },[]);


  const edited = async (todo)=>{
    try {
      const id = todo._id;
      console.log(editedText);
      const response = await axios.patch(`/api/todos/${todo._id}`, {
        text: editedText,
      });
         setTodos((prev) =>
          prev.map((t) => (t._id === todo._id ? response.data : t))
        );
      setEditedText('');
      setEditingTodo(null);
    } catch (error) {
        console.log(error);
    }
  }

  const deleteTodo = async (id)=>{
    try {
      await axios.delete(`/api/todos/${id}`)
      setTodos(todos.filter((todo)=> todo._id != id))
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className='h-screen  w-full px-15 py-2 bg-zinc-900'>
      <div className='p-10 w-full bg-zinc-950 shadow-lg shadow-zinc-400 rounded-lg'>
        <div className='m-2'>
          <h1 className='text-3xl font-bold text-white'>Task Manager</h1>
        </div>
        <form onSubmit={addTodo} className='m-2 flex gap-3 border-1 rounded-lg py-2 px-2 border-zinc-400' >
          <input className='outline-none px-2 flex-1 rounded-md text-zinc-200' type="text" value={newTodo} onChange={(e)=> setNewTodo(e.target.value)} placeholder='Enter your task' required/>
          <button type="submit" className='p-2 rounded-lg bg-green-300 font-bold text-white'>Add Task</button>
        </form>
        
        <div className='flex flex-col gap-2 text-xl text-zinc-300 m-3'>
          {todos.length == 0 ? (
            <div>No tasks to do</div>
          ): (
            <div className=''>
              {todos.map((todo)=>{
                return <div className='m-1 p-2' key={todo._id}>
                  {editingTodo === todo._id ? (
                    
                    <div className='flex justify-between m-1 p-2 outline-1 outline-zinc-500 rounded-md'>
                      <input className='outline-none text-white px-2 flex-1' required type="text" value={editedText} onChange={(e)=>{setEditedText(e.target.value)}}/>
                      <button className='bg-green-300 rounded-md text-zinc-700 font-bold p-2' onClick={()=>edited(todo)}>Done</button>
                    </div>
                  ): (
                    <div className='flex justify-between m-1 p-2'>
                      <div className='overflow-x-hidden text-wrap'>{todo.text}</div>
                      <div>
                        <button 
                            className='bg-green-300 mx-1 rounded-md text-zinc-700 font-bold p-2' 
                            onClick={()=>{setEditingTodo(todo._id); setEditedText(todo.text)}}>
                          Edit
                        </button>
                        <button 
                            className='bg-red-300 mx-1 rounded-md text-zinc-700 font-bold p-2' 
                            onClick={()=> deleteTodo(todo._id)}>
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
