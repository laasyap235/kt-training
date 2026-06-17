import { useEffect, useState } from 'react'
import api from '../api/axios'
import type { Department } from '../types'

function DepartmentPage() {
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [toast, setToast] = useState('')

  const [name, setName] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)

  const showToast = (message: string) => {
    setToast(message)
    setTimeout(() => setToast(''), 3000)
  }

  const loadDepartments = () => {
    setLoading(true)
    api.get<Department[]>('/Department')
      .then(res => setDepartments(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadDepartments()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    if (editingId === null) {
      await api.post('/Department', { departmentName: name })
      showToast('Department added successfully!')
    } else {
      await api.put('/Department', { departmentId: editingId, departmentName: name })
      showToast('Department updated successfully!')
    }

    setName('')
    setEditingId(null)
    loadDepartments()
  }

  const handleEdit = (dept: Department) => {
    setEditingId(dept.departmentId)
    setName(dept.departmentName)
  }

  const handleCancel = () => {
    setEditingId(null)
    setName('')
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this department?')) return
    await api.delete(`/Department/${id}`)
    showToast('Department deleted successfully!')
    loadDepartments()
  }

  if (loading) return <p className="p-6">Loading...</p>
  if (error) return <p className="p-6 text-red-600">Error: {error}</p>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Departments</h1>

      {/* Toast notification */}
      {toast && (
        <div className="mb-4 px-4 py-3 bg-green-100 text-green-800 border border-green-300 rounded">
          {toast}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Department name"
          className="border border-gray-300 rounded px-3 py-2 flex-1"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {editingId === null ? 'Add' : 'Update'}
        </button>
        {editingId !== null && (
          <button
            type="button"
            onClick={handleCancel}
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        )}
      </form>

      <table className="w-full border border-gray-300 rounded overflow-hidden table-fixed">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left p-3 border-b w-16">#</th>
            <th className="text-left p-3 border-b">Name</th>
            <th className="text-right p-3 border-b w-32">Actions</th>
          </tr>
        </thead>
        <tbody>
          {departments.map((dept, index) => (
            <tr key={dept.departmentId} className="hover:bg-gray-50">
              <td className="p-3 border-b">{index + 1}</td>
              <td className="p-3 border-b">{dept.departmentName}</td>
              <td className="p-3 border-b text-right whitespace-nowrap">
                <button
                  onClick={() => handleEdit(dept)}
                  className="text-blue-600 hover:underline mr-3"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(dept.departmentId)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default DepartmentPage