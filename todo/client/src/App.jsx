import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Dashboard from './components/Dashboard'
import Register from './components/auth/Register'
import Login from './components/auth/Login';
import TodoDashboard from './components/TodoDashboard';
import Todo from './components/card/Todo';

const App = () => {
  return (
    <>
        <div className="min-h-screen max-h-fit bg-zinc-700">
                <BrowserRouter>
                      <Routes>
                          <Route path="/" element={<Dashboard/>} />
                          <Route path="/login" element={<Login/>} />
                          <Route path="/register" element={<Register/>} />

                          <Route path="/todos" element={<TodoDashboard/>} >
                                <Route path="todo" element={<Todo/>} />
                          </Route>

                    </Routes>
              </BrowserRouter>
        </div>
    </>
  )
}

export default App
