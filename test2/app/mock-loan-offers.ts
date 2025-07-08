import { LoanOffer } from "./types";

export const mockLoanOffers: LoanOffer[] = [
  {
    id: "offer1",
    offer_name: "New Student Support Loan",
    description: "Financial support for new students",
    offer_per_months: 8000,
    student_required_gpa: 2.5,
    family_required_annual_income: 300000,
  },
  {
    id: "offer2",
    offer_name: "Continuing Student Loan",
    description: "Support for continuing students",
    offer_per_months: 6000,
    student_required_gpa: 2.0,
    family_required_annual_income: 250000,
  },
];
