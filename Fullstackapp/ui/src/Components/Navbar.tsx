import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="bg-gray-800 text-white px-6 py-4 flex gap-6">
      <Link to="/" className="hover:text-blue-400">Home</Link>
      <Link to="/department" className="hover:text-blue-400">Department</Link>
      <Link to="/employee" className="hover:text-blue-400">Employee</Link>
    </nav>
  )
}

export default Navbar