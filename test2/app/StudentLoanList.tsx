import { LoanApplication } from "./types";
import { getAllLoanOffers } from "./loan-offer-utils";

interface StudentLoanListProps {
  applications: LoanApplication[];
}

export function StudentLoanList({ applications }: StudentLoanListProps) {
  const offers = getAllLoanOffers();
  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4">รายการคำขอกู้ยืมของฉัน</h2>
      {applications.length === 0 ? (
        <div className="text-gray-500">ยังไม่มีคำขอกู้ยืม</div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => {
            const offer = offers.find((o) => o.id === app.offerId);
            return (
              <div key={app.id} className="border rounded p-4 bg-white shadow-sm flex flex-col gap-2">
                <div className="font-semibold">{offer?.offer_name || "-"}</div>
                <div className="text-sm text-gray-600">สถานะ: {renderStatus(app.status)}</div>
                <div className="text-sm">GPA: {app.gpa}</div>
                <div className="text-sm">รายได้ครอบครัว: {app.familyIncome.toLocaleString()} บาท/ปี</div>
                <div className="text-xs text-gray-400">ส่งเมื่อ: {new Date(app.submittedAt).toLocaleString()}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function renderStatus(status: string) {
  switch (status) {
    case "pending":
      return <span className="text-yellow-600">รอการอนุมัติ</span>;
    case "approved":
      return <span className="text-green-600">อนุมัติแล้ว</span>;
    case "rejected":
      return <span className="text-red-600">ไม่อนุมัติ</span>;
    default:
      return status;
  }
}
