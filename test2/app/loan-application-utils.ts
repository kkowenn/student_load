import { LoanApplication } from "./types";

// This will be kept in-memory for the session
let loanApplications: LoanApplication[] = [];

export function getAllLoanApplications(): LoanApplication[] {
  return loanApplications;
}

export function getLoanApplicationsByStudent(studentId: string): LoanApplication[] {
  return loanApplications.filter((a) => a.studentId === studentId);
}

export function getLoanApplicationsByOffer(offerId: string): LoanApplication[] {
  return loanApplications.filter((a) => a.offerId === offerId);
}

export function addLoanApplication(app: LoanApplication) {
  loanApplications.push(app);
}

export function updateLoanApplicationStatus(appId: string, status: LoanApplication["status"]) {
  const idx = loanApplications.findIndex((a) => a.id === appId);
  if (idx !== -1) {
    loanApplications[idx].status = status;
  }
}

export function resetLoanApplications() {
  loanApplications = [];
}
