export interface User {
  id: number
  username: string
  email: string
  userType: "STUDENT" | "TEACHER" | "ADMINISTRATOR" | "GUARDIAN"
  isActive: boolean
}

export interface Student {
  id: number
  surname: string
  firstName: string
  middleName?: string
  email?: string
  phoneNumber?: string
  entryNumber: string
  address?: string
  city?: string
  country?: string
  dateOfBirth: string
  gender: "MALE" | "FEMALE" | "OTHER"
  assignedClass: string
  assignedSubjects: string[]

  // Guardian Information
  guardianSurname: string
  guardianFirstName: string
  guardianMiddleName?: string
  guardianEmail: string
  guardianPhone: string
  guardianNationalId: string
  relationship: "FATHER" | "MOTHER" | "GUARDIAN" | "UNCLE" | "AUNT" | "GRANDPARENT" | "OTHER"
  employer?: string
  guardianAddress?: string
  guardianCity?: string
  guardianDateOfBirth?: string
  guardianGender?: "MALE" | "FEMALE" | "OTHER"

  // History
  previousSchool?: string
  medicalConditions?: string

  // Documents
  transferDocuments?: string
  doctorLetter?: string
  birthCertificate?: string
  guardianIdDocument?: string
  proofOfResidence?: string
  previousResults?: string
  proofOfPayment?: string

  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Teacher {
  id: number
  fullName: string
  email: string
  phone?: string
  qualifications?: string
  certifications?: string
  areaOfExpertise?: string
  assignedClasses: string[]
  assignedSubjects: string[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Class {
  id: number
  name: string
  grade: string
  section: string
  capacity: number
  currentStrength: number
  classTeacher?: string
  subjects: string[]
  isActive: boolean
}

export interface Subject {
  id: number
  name: string
  code: string
  description?: string
  credits: number
  grade: string
  isActive: boolean
}

export interface Exam {
  id: number
  title: string
  subject: string
  class: string
  date: string
  startTime: string
  endTime: string
  totalMarks: number
  passingMarks: number
  examType: "UNIT_TEST" | "MIDTERM" | "FINAL" | "PRACTICAL"
  status: "SCHEDULED" | "ONGOING" | "COMPLETED" | "CANCELLED"
}

export interface TransportRoute {
  id: number
  routeName: string
  routeNumber: string
  startPoint: string
  endPoint: string
  stops: string[]
  distance: number
  estimatedTime: number
  isActive: boolean
}

export interface Vehicle {
  id: number
  vehicleNumber: string
  vehicleType: "BUS" | "VAN" | "CAR"
  capacity: number
  driverName?: string
  routeId?: number
  isActive: boolean
}

export interface FeeStructure {
  id: number
  grade: string
  tuitionFee: number
  admissionFee: number
  examFee: number
  libraryFee: number
  sportsFee: number
  transportFee: number
  hostelFee: number
  totalFee: number
  academicYear: string
}

export interface Payment {
  id: number
  studentId: number
  studentName: string
  amount: number
  paymentDate: string
  paymentMethod: "CASH" | "BANK_TRANSFER" | "CHEQUE" | "ONLINE"
  feeType: string
  receiptNumber: string
  status: "PAID" | "PENDING" | "OVERDUE"
}

export interface HostelRoom {
  id: number
  roomNumber: string
  roomType: "SINGLE" | "DOUBLE" | "TRIPLE" | "DORMITORY"
  capacity: number
  currentOccupancy: number
  floor: number
  building: string
  facilities: string[]
  isActive: boolean
}

export interface Attendance {
  id: number
  studentId: number
  studentName: string
  class: string
  date: string
  status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED"
  markedBy: string
  remarks?: string
}
