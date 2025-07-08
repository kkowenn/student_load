export type UserRole = "student" | "admin";

export interface User {
  id: string;
  name: string;
  role: UserRole;
}

export interface LoanOffer {
  id: string;
  offer_name: string;
  description: string;
  offer_per_months: number;
  student_required_gpa: number;
  family_required_annual_income: number;
}

export type LoanStatus = "pending" | "approved" | "rejected";

export interface LoanApplication {
  id: string;
  studentId: string;
  offerId: string;
  status: LoanStatus;
  submittedAt: string;
  // Additional fields from the form
  gpa: number;
  familyIncome: number;
}
