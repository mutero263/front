import axios from "axios"
import { get } from "http"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token")
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token")
        localStorage.removeItem("userType")
        localStorage.removeItem("username")
        window.location.href = "/"
      }
    }
    return Promise.reject(error)
  },
)

export default api

// Auth API
export const authAPI = {
  login: (credentials: { username: string; password: string; userType: string }) =>
    api.post("/auth/signin", credentials),
  register: (userData: any) => api.post("/auth/signup", userData),
}

// Student API
export const studentAPI = {
  register: (studentData: any) => api.post("/students/register", studentData),
  getAll: () => api.get("/students/all"),
  getById: (id: number) => api.get(`/students/${id}`),
  getByEntryNumber: (entryNumber: string) => api.get(`/students/entry-number/${entryNumber}`),
  getByClass: (className: string) => api.get(`/students/class/${className}`),
  search: (name: string) => api.get(`/students/search?name=${name}`),
  update: (id: number, data: any) => api.put(`/students/${id}`, data),
  deactivate: (id: number) => api.delete(`/students/${id}`),
  uploadDocument: (formData: FormData) =>
    api.post("/students/upload-document", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
}

// Hostel API
export const hostelAPI = {
getRooms: () => api.get("/hostel/rooms"),
}
export const teacherAPI ={
  register: (teacherData: any) => api.post("/teachers/register", teacherData),

}
// Transport API
export const transportAPI = {
  getRoutes: () => api.get("/transport/routes"),
}

// Dashboard API
export const dashboardAPI = {
  getStats: () => api.get("/dashboard/stats"),
  getRecentActivities: () => api.get("/dashboard/recent-activities"),
}
