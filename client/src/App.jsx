import { Navigate, Route, Routes } from 'react-router-dom';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Home from './components/Dashboard';
import TodoDashboard from './components/TodoDashboard';

const App = () => {
  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />

        <Route
          path="/todos"
          element={
              <TodoDashboard/>}
        />
      </Routes>
    </div>
  )
}

export default App
