import { create } from "zustand";
import { LoanOffer, LoanApplication, initialLoanOffers } from "./loan-types";
import { v4 as uuidv4 } from "uuid";

interface LoanStoreState {
  loanOffers: LoanOffer[];
  applications: LoanApplication[];
  addLoanOffer: (offer: Omit<LoanOffer, "id">) => void;
  updateLoanOffer: (id: string, offer: Partial<LoanOffer>) => void;
  deleteLoanOffer: (id: string) => void;
  applyLoan: (application: Omit<LoanApplication, "id" | "status" | "submittedAt">) => void;
  updateApplicationStatus: (id: string, status: "Approved" | "Rejected", reason?: string) => void;
}

export const useLoanStore = create<LoanStoreState>((set) => ({
  loanOffers: initialLoanOffers,
  applications: [],
  addLoanOffer: (offer) => set((state) => ({
    loanOffers: [...state.loanOffers, { ...offer, id: uuidv4() }],
  })),
  updateLoanOffer: (id, offer) => set((state) => ({
    loanOffers: state.loanOffers.map((o) => (o.id === id ? { ...o, ...offer } : o)),
  })),
  deleteLoanOffer: (id) => set((state) => ({
    loanOffers: state.loanOffers.filter((o) => o.id !== id),
    applications: state.applications.filter((a) => a.offerId !== id),
  })),
  applyLoan: (application) => set((state) => ({
    applications: [
      ...state.applications,
      {
        ...application,
        id: uuidv4(),
        status: "Pending",
        submittedAt: new Date().toISOString(),
      },
    ],
  })),
  updateApplicationStatus: (id, status, reason) => set((state) => ({
    applications: state.applications.map((a) =>
      a.id === id ? { ...a, status, reason } : a
    ),
  })),
}));
