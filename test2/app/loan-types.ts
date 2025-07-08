import { v4 as uuidv4 } from "uuid";

export interface LoanOffer {
  id: string;
  offer_name: string;
  description: string;
  offer_per_months: number;
  student_required_gpa: number;
  family_required_annual_income: number;
}

export interface LoanApplication {
  id: string;
  studentId: string;
  offerId: string;
  gpa: number;
  familyIncome: number;
  documents: string[];
  status: "Pending" | "Approved" | "Rejected";
  reason?: string;
  submittedAt: string;
}

export const initialLoanOffers: LoanOffer[] = [
  {
    id: uuidv4(),
    offer_name: "New Student Support Loan",
    description: "Financial support for new students",
    offer_per_months: 8000,
    student_required_gpa: 2.5,
    family_required_annual_income: 300000,
  },
  {
    id: uuidv4(),
    offer_name: "Continuing Student Loan",
    description: "Support for continuing students",
    offer_per_months: 6000,
    student_required_gpa: 2.0,
    family_required_annual_income: 350000,
  },
];
