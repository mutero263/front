import api from "./api"

// Chart of Accounts API
export const chartOfAccountsAPI = {
  getAll: () => api.get("/accounting/chart-of-accounts"),
  getById: (id: number) => api.get(`/accounting/chart-of-accounts/${id}`),
  create: (data: any) => api.post("/accounting/chart-of-accounts", data),
  update: (id: number, data: any) => api.put(`/accounting/chart-of-accounts/${id}`, data),
  delete: (id: number) => api.delete(`/accounting/chart-of-accounts/${id}`),
  getByType: (type: string) => api.get(`/accounting/chart-of-accounts/type/${type}`),
}

// Fee Management API
export const feeManagementAPI = {
  // Fee Structures
  getFeeStructures: () => api.get("/accounting/fee-structures"),
  createFeeStructure: (data: any) => api.post("/accounting/fee-structures", data),
  updateFeeStructure: (id: number, data: any) => api.put(`/accounting/fee-structures/${id}`, data),

  // Invoices
  getInvoices: () => api.get("/accounting/invoices"),
  getInvoiceById: (id: number) => api.get(`/accounting/invoices/${id}`),
  createInvoice: (data: any) => api.post("/accounting/invoices", data),
  generateBulkInvoices: (data: any) => api.post("/accounting/invoices/bulk", data),

  // Payments
  getPayments: () => api.get("/accounting/payments"),
  recordPayment: (data: any) => api.post("/accounting/payments", data),
  generateReceipt: (paymentId: number) => api.get(`/accounting/payments/${paymentId}/receipt`),

  // Student Ledger
  getStudentLedger: (studentId: number) => api.get(`/accounting/students/${studentId}/ledger`),
  getOutstandingFees: () => api.get("/accounting/fees/outstanding"),
}

// Expense Management API
export const expenseAPI = {
  getAll: () => api.get("/accounting/expenses"),
  getById: (id: number) => api.get(`/accounting/expenses/${id}`),
  create: (data: any) => api.post("/accounting/expenses", data),
  update: (id: number, data: any) => api.put(`/accounting/expenses/${id}`, data),
  approve: (id: number) => api.post(`/accounting/expenses/${id}/approve`),
  getByCategory: (category: string) => api.get(`/accounting/expenses/category/${category}`),
  uploadReceipt: (id: number, file: FormData) =>
    api.post(`/accounting/expenses/${id}/receipt`, file, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
}

// Payroll API
export const payrollAPI = {
  // Employees
  getEmployees: () => api.get("/accounting/employees"),
  createEmployee: (data: any) => api.post("/accounting/employees", data),
  updateEmployee: (id: number, data: any) => api.put(`/accounting/employees/${id}`, data),

  // Payroll Processing
  getPayrolls: () => api.get("/accounting/payrolls"),
  createPayroll: (data: any) => api.post("/accounting/payrolls", data),
  processPayroll: (month: string, year: number) => api.post("/accounting/payrolls/process", { month, year }),
  approvePayroll: (id: number) => api.post(`/accounting/payrolls/${id}/approve`),
  generatePayslip: (id: number) => api.get(`/accounting/payrolls/${id}/payslip`),

  // Tax Calculations
  calculatePAYE: (grossSalary: number) => api.post("/accounting/tax/paye", { grossSalary }),
  calculateNSSA: (grossSalary: number) => api.post("/accounting/tax/nssa", { grossSalary }),
}

// Budget API
export const budgetAPI = {
  getAll: () => api.get("/accounting/budgets"),
  getById: (id: number) => api.get(`/accounting/budgets/${id}`),
  create: (data: any) => api.post("/accounting/budgets", data),
  update: (id: number, data: any) => api.put(`/accounting/budgets/${id}`, data),
  approve: (id: number) => api.post(`/accounting/budgets/${id}/approve`),
  getBudgetVsActual: (budgetId: number) => api.get(`/accounting/budgets/${budgetId}/vs-actual`),
  getAllBudgetVsActual: () => api.get("/accounting/budgets/vs-actual"),
}

// Bank & Cash API
export const bankAPI = {
  // Bank Accounts
  getAccounts: () => api.get("/accounting/bank-accounts"),
  createAccount: (data: any) => api.post("/accounting/bank-accounts", data),
  updateAccount: (id: number, data: any) => api.put(`/accounting/bank-accounts/${id}`, data),

  // Transactions
  getTransactions: () => api.get("/accounting/transactions"),
  createTransaction: (data: any) => api.post("/accounting/transactions", data),
  approveTransaction: (id: number) => api.post(`/accounting/transactions/${id}/approve`),

  // Reconciliation
  importStatement: (accountId: number, file: FormData) =>
    api.post(`/accounting/bank-accounts/${accountId}/import-statement`, file, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  reconcile: (accountId: number, data: any) => api.post(`/accounting/bank-accounts/${accountId}/reconcile`, data),
  getCashbook: () => api.get("/accounting/cashbook"),
}

// Reports API
export const reportsAPI = {
  getBalanceSheet: (date: string) => api.get(`/accounting/reports/balance-sheet?date=${date}`),
  getProfitLoss: (dateFrom: string, dateTo: string) =>
    api.get(`/accounting/reports/profit-loss?from=${dateFrom}&to=${dateTo}`),
  getCashFlow: (dateFrom: string, dateTo: string) =>
    api.get(`/accounting/reports/cash-flow?from=${dateFrom}&to=${dateTo}`),
  getBudgetVsActual: (budgetId?: number) =>
    api.get(`/accounting/reports/budget-vs-actual${budgetId ? `?budgetId=${budgetId}` : ""}`),
  getOutstandingFees: () => api.get("/accounting/reports/outstanding-fees"),
  getAgedDebtors: () => api.get("/accounting/reports/aged-debtors"),

  // Export functions
  exportToExcel: (reportType: string, params: any) =>
    api.post(`/accounting/reports/${reportType}/export/excel`, params, { responseType: "blob" }),
  exportToPDF: (reportType: string, params: any) =>
    api.post(`/accounting/reports/${reportType}/export/pdf`, params, { responseType: "blob" }),
}

// Audit API
export const auditAPI = {
  getLogs: (params?: any) => api.get("/accounting/audit-logs", { params }),
  getLogsByTable: (tableName: string) => api.get(`/accounting/audit-logs/table/${tableName}`),
  getLogsByUser: (userId: number) => api.get(`/accounting/audit-logs/user/${userId}`),
}

// Dashboard API
export const accountingDashboardAPI = {
  getOverview: () => api.get("/accounting/dashboard/overview"),
  getCashPosition: () => api.get("/accounting/dashboard/cash-position"),
  getFeeCollection: () => api.get("/accounting/dashboard/fee-collection"),
  getExpenseSummary: () => api.get("/accounting/dashboard/expense-summary"),
  getBudgetStatus: () => api.get("/accounting/dashboard/budget-status"),
}

// Mobile Money API
export const mobileMoneyAPI = {
  initiateEcoCashPayment: (data: any) => api.post("/accounting/mobile-money/ecocash/initiate", data),
  initiateOneMoneyPayment: (data: any) => api.post("/accounting/mobile-money/onemoney/initiate", data),
  checkPaymentStatus: (transactionId: string) => api.get(`/accounting/mobile-money/status/${transactionId}`),
  processCallback: (data: any) => api.post("/accounting/mobile-money/callback", data),
}

// ZIMRA Integration API
export const zimraAPI = {
  submitVATReturn: (data: any) => api.post("/accounting/zimra/vat-return", data),
  submitPAYEReturn: (data: any) => api.post("/accounting/zimra/paye-return", data),
  getFiscalDeviceStatus: () => api.get("/accounting/zimra/fiscal-device/status"),
  printFiscalReceipt: (data: any) => api.post("/accounting/zimra/fiscal-device/print", data),
}
