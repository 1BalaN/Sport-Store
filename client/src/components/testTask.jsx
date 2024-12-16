import React, { useEffect, useState } from "react";

const Todos = () => {
  const [todos, setTodos] = useState([]);
  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/todos')
      .then(response => response.json())
      .then(newTodos => setTodos(...todos, newTodos))
  }, [])
  return (
  <ul>
            {todos && todos.map(todo => (
                <li>{todo.title}</li>
            ))}
 </ul>
  )
};

export default Todos