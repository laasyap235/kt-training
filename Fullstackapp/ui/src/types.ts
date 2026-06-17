export interface Department {
  departmentId: number
  departmentName: string
}

export interface Employee {
  employeeId: number
  employeeName: string
  department: string
  dateOfJoining: string
  photoFileName: string
}