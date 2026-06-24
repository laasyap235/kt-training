import React from 'react';
import AddTodo from './components/AddTodo';
import Todo from './components/Todo';
function App() {
  return (
    <div className="min-h-screen flex flex-col items-center">
      <h1 className="text-3xl font-bold mt-5">
        Learn more about redux!
      </h1>

      <AddTodo />
      <Todo />
    </div>
  );
}
export default App;
