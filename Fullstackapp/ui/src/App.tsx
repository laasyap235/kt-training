import { Routes, Route } from 'react-router-dom'
import Navbar from './Components/Navbar'
import Home from './Pages/Home'
import Department from './Pages/Department'
import Employee from './Pages/Employee'
import './App.css'

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Department" element={<Department />} />
        <Route path="/Employee" element={<Employee />} />
      </Routes>
    </div>
  )
}

export default App