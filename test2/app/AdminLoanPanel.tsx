import { LoanApplication } from "./types";
import { getAllLoanOffers } from "./loan-offer-utils";
import { getAllUsers } from "./user-utils";
import { Button } from "@/components/ui/button";

interface AdminLoanPanelProps {
  applications: LoanApplication[];
  onApprove: (appId: string) => void;
  onReject: (appId: string) => void;
}

export function AdminLoanPanel({ applications, onApprove, onReject }: AdminLoanPanelProps) {
  const offers = getAllLoanOffers();
  const users = getAllUsers();

  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4">รายการคำขอกู้ยืมทั้งหมด</h2>
      {applications.length === 0 ? (
        <div className="text-gray-500">ยังไม่มีคำขอกู้ยืม</div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => {
            const offer = offers.find((o) => o.id === app.offerId);
            const student = users.find((u) => u.id === app.studentId);
            return (
              <div key={app.id} className="border rounded p-4 bg-white shadow-sm flex flex-col gap-2">
                <div className="font-semibold">{offer?.offer_name || "-"}</div>
                <div className="text-sm">ผู้ขอ: {student?.name || app.studentId}</div>
                <div className="text-sm">GPA: {app.gpa}</div>
                <div className="text-sm">รายได้ครอบครัว: {app.familyIncome.toLocaleString()} บาท/ปี</div>
                <div className="text-xs text-gray-400">ส่งเมื่อ: {new Date(app.submittedAt).toLocaleString()}</div>
                <div className="flex gap-2 items-center">
                  <span className="text-sm">สถานะ: {renderStatus(app.status)}</span>
                  {app.status === "pending" && (
                    <>
                      <Button size="sm" variant="outline" onClick={() => onApprove(app.id)}>
                        อนุมัติ
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => onReject(app.id)}>
                        ไม่อนุมัติ
                      </Button>
                    </>
                  )}
                </div>
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
