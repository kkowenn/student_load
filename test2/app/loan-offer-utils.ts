import { LoanOffer } from "./types";
import { mockLoanOffers } from "./mock-loan-offers";

export function getLoanOfferById(id: string): LoanOffer | undefined {
  return mockLoanOffers.find((o) => o.id === id);
}

export function getAllLoanOffers(): LoanOffer[] {
  return mockLoanOffers;
}
