import { useEffect, useState, useRef } from 'react'
import api from '../api/axios'
import type { Employee, Department } from '../types'

function EmployeePage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [toast, setToast] = useState({ message: '', type: '' })

  const [employeeName, setEmployeeName] = useState('')
  const [department, setDepartment] = useState('')
  const [dateOfJoining, setDateOfJoining] = useState('')
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [existingPhoto, setExistingPhoto] = useState('')
  const [removePhoto, setRemovePhoto] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLDivElement>(null)

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast({ message: '', type: '' }), 3000)
  }

  const loadEmployees = () => {
    setLoading(true)
    api.get<Employee[]>('/Employee')
      .then(res => setEmployees([...res.data].reverse()))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }

  const loadDepartments = () => {
    api.get<Department[]>('/Department')
      .then(res => setDepartments(res.data))
      .catch(err => console.error(err))
  }

  useEffect(() => {
    loadEmployees()
    loadDepartments()
  }, [])

  const resetForm = () => {
    setEmployeeName('')
    setDepartment('')
    setDateOfJoining('')
    setPhotoFile(null)
    setExistingPhoto('')
    setRemovePhoto(false)
    setEditingId(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!employeeName.trim() || !department || !dateOfJoining) return

    let photoFileName = existingPhoto
    if (removePhoto) photoFileName = ''

    if (photoFile) {
      const formData = new FormData()
      formData.append('file', photoFile)
      const res = await api.post<string>('/Employee/SaveFile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      photoFileName = res.data
    }

    const payload = {
      employeeId: editingId ?? 0,
      employeeName,
      department,
      dateOfJoining,
      photoFileName,
    }

    if (editingId === null) {
      await api.post('/Employee', payload)
      showToast('Employee added successfully!')
    } else {
      await api.put('/Employee', payload)
      showToast('Employee updated successfully!')
    }

    resetForm()
    loadEmployees()
  }

  const handleEdit = (emp: Employee) => {
    setEditingId(emp.employeeId)
    setEmployeeName(emp.employeeName)
    setDepartment(emp.department)
    setDateOfJoining(emp.dateOfJoining.split('T')[0])
    setExistingPhoto(emp.photoFileName)
    setPhotoFile(null)
    setRemovePhoto(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
  }

  const handleCancel = () => resetForm()

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this employee?')) return
    await api.delete(`/Employee/${id}`)
    showToast('Employee deleted successfully!')
    loadEmployees()
  }

  if (loading) return <p className="p-6">Loading...</p>
  if (error) return <p className="p-6 text-red-600">Error: {error}</p>

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Employees</h1>

      {/* Toast */}
      {toast.message && (
        <div className={`mb-4 px-4 py-3 rounded border ${
          toast.type === 'error'
            ? 'bg-red-100 text-red-800 border-red-300'
            : 'bg-green-100 text-green-800 border-green-300'
        }`}>
          {toast.message}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto mb-8">
        <table className="w-full border border-gray-300 rounded overflow-hidden table-fixed">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-3 border-b w-12">#</th>
              <th className="text-left p-3 border-b">Name</th>
              <th className="text-left p-3 border-b">Department</th>
              <th className="text-left p-3 border-b w-32">Date of Joining</th>
              <th className="text-left p-3 border-b w-24">Photo</th>
              <th className="text-right p-3 border-b w-32">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-4 text-center text-gray-400">No employees found.</td>
              </tr>
            ) : (
              employees.map((emp, index) => (
                <tr key={emp.employeeId} className="hover:bg-gray-50">
                  <td className="p-3 border-b">{index + 1}</td>
                  <td className="p-3 border-b">{emp.employeeName}</td>
                  <td className="p-3 border-b">{emp.department}</td>
                  <td className="p-3 border-b">{new Date(emp.dateOfJoining).toLocaleDateString()}</td>
                  <td className="p-3 border-b">
                    {emp.photoFileName && (
                      <img
                        src={`http://localhost:5000/Photos/${emp.photoFileName}`}
                        alt={emp.employeeName}
                        className="w-14 h-14 rounded-lg object-cover"
                      />
                    )}
                  </td>
                  <td className="p-3 border-b text-right whitespace-nowrap">
                    <button onClick={() => handleEdit(emp)} className="text-blue-600 hover:underline mr-3">Edit</button>
                    <button onClick={() => handleDelete(emp.employeeId)} className="text-red-600 hover:underline">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Form */}
      <div ref={formRef} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4">
          {editingId === null ? 'Add Employee' : 'Edit Employee'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={employeeName}
                onChange={e => setEmployeeName(e.target.value)}
                placeholder="Employee name"
                className="border border-gray-300 rounded px-3 py-2"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Department</label>
              <select
                value={department}
                onChange={e => setDepartment(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 bg-white"
              >
                <option value="">Select department</option>
                {departments.map(dept => (
                  <option key={dept.departmentId} value={dept.departmentName}>
                    {dept.departmentName}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Date of Joining</label>
              <input
                type="date"
                value={dateOfJoining}
                onChange={e => setDateOfJoining(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Photo</label>

              {editingId !== null && existingPhoto && !removePhoto && (
                <div className="flex items-center gap-2 mb-1">
                  <img
                    src={`http://localhost:5000/Photos/${existingPhoto}`}
                    alt="Current"
                    className="w-8 h-8 rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setRemovePhoto(true)}
                    className="text-red-600 hover:underline text-xs"
                  >
                    Remove
                  </button>
                </div>
              )}

              {editingId !== null && removePhoto && (
                <p className="text-xs text-gray-500 mb-1">
                  Photo removed —{' '}
                  <button
                    type="button"
                    onClick={() => setRemovePhoto(false)}
                    className="text-blue-600 hover:underline"
                  >
                    Undo
                  </button>
                </p>
              )}

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 border border-dashed border-blue-400 rounded px-3 py-2 hover:bg-blue-50 text-sm text-blue-600 w-full"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                <span className="truncate">
                  {photoFile ? photoFile.name : 'Upload photo'}
                </span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={e => setPhotoFile(e.target.files?.[0] ?? null)}
                className="hidden"
              />
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
            >
              {editingId === null ? 'Add Employee' : 'Update Employee'}
            </button>
            {editingId !== null && (
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-300 px-5 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default EmployeePage