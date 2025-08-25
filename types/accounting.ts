// Accounting Module Types
export interface ChartOfAccount {
  id: number
  accountCode: string
  accountName: string
  accountType: "ASSET" | "LIABILITY" | "INCOME" | "EXPENSE"
  parentAccountId?: number
  isActive: boolean
  balance: number
  createdAt: string
  updatedAt: string
}

export interface FeeStructure {
  id: number
  grade: string
  academicYear: string
  tuitionFee: number
  admissionFee: number
  examFee: number
  libraryFee: number
  sportsFee: number
  transportFee: number
  hostelFee: number
  totalFee: number
  isActive: boolean
}

export interface Invoice {
  id: number
  invoiceNumber: string
  studentId: number
  studentName: string
  grade: string
  academicYear: string
  issueDate: string
  dueDate: string
  totalAmount: number
  paidAmount: number
  outstandingAmount: number
  status: "PENDING" | "PARTIALLY_PAID" | "PAID" | "OVERDUE"
  items: InvoiceItem[]
}

export interface InvoiceItem {
  id: number
  description: string
  amount: number
  accountId: number
}

export interface Payment {
  id: number
  paymentNumber: string
  invoiceId: number
  studentId: number
  amount: number
  paymentDate: string
  paymentMethod: "CASH" | "BANK_TRANSFER" | "ECOCASH" | "ONEMONEY" | "ONLINE" | "CHEQUE"
  referenceNumber?: string
  currency: "USD" | "ZWL"
  exchangeRate?: number
  status: "PENDING" | "CONFIRMED" | "FAILED"
  receiptGenerated: boolean
}

export interface Expense {
  id: number
  expenseNumber: string
  description: string
  category: "UTILITIES" | "REPAIRS" | "ACADEMIC_MATERIALS" | "ADMINISTRATIVE" | "TRANSPORT" | "OTHER"
  amount: number
  expenseDate: string
  paymentMethod: "CASH" | "BANK_TRANSFER" | "CHEQUE"
  accountId: number
  approvedBy?: string
  receiptAttached: boolean
  vatAmount?: number
  currency: "USD" | "ZWL"
}

export interface Employee {
  id: number
  employeeNumber: string
  fullName: string
  position: string
  department: string
  basicSalary: number
  allowances: Allowance[]
  deductions: Deduction[]
  bankAccount: string
  taxNumber: string
  nssaNumber: string
  isActive: boolean
}

export interface Allowance {
  id: number
  name: string
  amount: number
  isTaxable: boolean
}

export interface Deduction {
  id: number
  name: string
  amount: number
  isStatutory: boolean
}

export interface Payroll {
  id: number
  payrollNumber: string
  month: string
  year: number
  employeeId: number
  basicSalary: number
  totalAllowances: number
  grossSalary: number
  payeTax: number
  nssaContribution: number
  aidsLevy: number
  otherDeductions: number
  totalDeductions: number
  netSalary: number
  status: "DRAFT" | "APPROVED" | "PAID"
  payslipGenerated: boolean
}

export interface Budget {
  id: number
  budgetName: string
  academicYear: string
  term?: string
  accountId: number
  budgetedAmount: number
  actualAmount: number
  variance: number
  variancePercentage: number
  status: "DRAFT" | "APPROVED" | "ACTIVE"
}

export interface BankAccount {
  id: number
  accountName: string
  accountNumber: string
  bankName: string
  currency: "USD" | "ZWL"
  currentBalance: number
  isActive: boolean
}

export interface Transaction {
  id: number
  transactionNumber: string
  date: string
  description: string
  debitAccountId: number
  creditAccountId: number
  amount: number
  currency: "USD" | "ZWL"
  exchangeRate?: number
  reference?: string
  createdBy: string
  approvedBy?: string
  status: "PENDING" | "APPROVED" | "REJECTED"
}

export interface AuditLog {
  id: number
  tableName: string
  recordId: number
  action: "CREATE" | "UPDATE" | "DELETE"
  oldValues?: any
  newValues?: any
  userId: number
  username: string
  timestamp: string
  ipAddress: string
}

export interface FinancialReport {
  reportType: "BALANCE_SHEET" | "PROFIT_LOSS" | "CASH_FLOW" | "BUDGET_ACTUAL" | "OUTSTANDING_FEES"
  dateFrom: string
  dateTo: string
  data: any
  generatedAt: string
  generatedBy: string
}
