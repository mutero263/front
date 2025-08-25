export interface LoginCredentials {
  username: string
  password: string
  userType: "STUDENT" | "TEACHER" | "ADMINISTRATOR" | "GUARDIAN"
}

export interface AuthUser {
  username: string
  email: string
  userType: string
  token: string
}

export const defaultCredentials = {
  admin: {
    username: "admin",
    password: "password123",
    userType: "ADMINISTRATOR" as const,
    description: "Full system access",
  },
  accountant: {
    username: "accountant",
    password: "password123",
    userType: "ADMINISTRATOR" as const,
    description: "Accounting and financial management",
  },
  teacher: {
    username: "teacher1",
    password: "password123",
    userType: "TEACHER" as const,
    description: "Student management and academics",
  },
  student: {
    username: "student1",
    password: "password123",
    userType: "STUDENT" as const,
    description: "View own records and fees",
  },
  parent: {
    username: "parent1",
    password: "password123",
    userType: "GUARDIAN" as const,
    description: "View child records and pay fees",
  },
}

export const getStoredAuth = (): AuthUser | null => {
  if (typeof window === "undefined") return null

  try {
    const stored = localStorage.getItem("auth")
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

export const setStoredAuth = (auth: AuthUser): void => {
  if (typeof window === "undefined") return
  localStorage.setItem("auth", JSON.stringify(auth))
}

export const clearStoredAuth = (): void => {
  if (typeof window === "undefined") return
  localStorage.removeItem("auth")
}

export const isAuthenticated = (): boolean => {
  return getStoredAuth() !== null
}

export const hasRole = (requiredRole: string): boolean => {
  const auth = getStoredAuth()
  if (!auth) return false

  // Administrator has access to everything
  if (auth.userType === "ADMINISTRATOR") return true

  return auth.userType === requiredRole
}

export const canAccessAccounting = (): boolean => {
  const auth = getStoredAuth()
  if (!auth) return false

  return auth.userType === "ADMINISTRATOR"
}

export const canAccessStudentManagement = (): boolean => {
  const auth = getStoredAuth()
  if (!auth) return false

  return ["ADMINISTRATOR", "TEACHER"].includes(auth.userType)
}

export const canViewFinancialReports = (): boolean => {
  const auth = getStoredAuth()
  if (!auth) return false

  return auth.userType === "ADMINISTRATOR"
}
