"use client";
import { useAuthStore } from "../auth-store";
import { useLoanStore } from "../loan-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useRouter } from "next/navigation";

function LoanOfferSelection({ onSelect }: { onSelect: (id: string) => void }) {
  const loanOffers = useLoanStore((s) => s.loanOffers);
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {loanOffers.map((offer) => (
        <Card key={offer.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onSelect(offer.id)}>
          <CardHeader>
            <CardTitle>{offer.offer_name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-gray-700 mb-2">{offer.description}</div>
            <div className="text-sm text-gray-500">สูงสุด {offer.offer_per_months.toLocaleString()} บาท/เดือน</div>
            <div className="text-xs mt-2">GPA ≥ {offer.student_required_gpa} | รายได้ครอบครัว ≤ {offer.family_required_annual_income.toLocaleString()} บาท/ปี</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function LoanApplicationForm({ offerId, onBack }: { offerId: string; onBack: () => void }) {
  const { loanOffers, applyLoan, applications } = useLoanStore();
  const auth = useAuthStore();
  const offer = loanOffers.find((o) => o.id === offerId);
  const [gpa, setGpa] = useState("");
  const [income, setIncome] = useState("");
  const [documents, setDocuments] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const alreadyApplied = applications.some(
    (a) => a.offerId === offerId && a.studentId === auth.user?.studentId
  );

  if (!offer) return null;

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setDocuments(Array.from(e.target.files).map((f) => f.name));
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    const gpaNum = parseFloat(gpa);
    const incomeNum = parseInt(income);
    if (isNaN(gpaNum) || isNaN(incomeNum)) {
      setError("กรุณากรอกข้อมูลให้ถูกต้อง");
      return;
    }
    if (gpaNum < offer.student_required_gpa) {
      setError(`GPA ต้องมากกว่าหรือเท่ากับ ${offer.student_required_gpa}`);
      return;
    }
    if (incomeNum > offer.family_required_annual_income) {
      setError(`รายได้ครอบครัวต้องไม่เกิน ${offer.family_required_annual_income.toLocaleString()} บาท/ปี`);
      return;
    }
    if (documents.length === 0) {
      setError("กรุณาแนบเอกสารประกอบ");
      return;
    }
    if (!auth.user) {
      setError("กรุณาเข้าสู่ระบบใหม่");
      return;
    }
    if (alreadyApplied) {
      setError("คุณสมัครขอสินเชื่อนี้แล้ว");
      return;
    }
    applyLoan({
      studentId: auth.user.studentId,
      offerId: offer.id,
      gpa: gpaNum,
      familyIncome: incomeNum,
      documents,
    });
    setSuccess("ส่งคำขอกู้ยืมสำเร็จ");
  }

  return (
    <Card className="max-w-lg mx-auto mt-6">
      <CardHeader>
        <CardTitle>สมัครขอสินเชื่อ: {offer.offer_name}</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="gpa">GPA ปัจจุบัน</Label>
            <Input id="gpa" value={gpa} onChange={e => setGpa(e.target.value)} type="number" step="0.01" min="0" max="4" />
          </div>
          <div>
            <Label htmlFor="income">รายได้ครอบครัวต่อปี (บาท)</Label>
            <Input id="income" value={income} onChange={e => setIncome(e.target.value)} type="number" min="0" />
          </div>
          <div>
            <Label htmlFor="documents">แนบเอกสารประกอบ (.pdf, .jpg, .png)</Label>
            <Input id="documents" type="file" multiple accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} />
            <div className="text-xs text-gray-500 mt-1">{documents.length > 0 && `ไฟล์: ${documents.join(", ")}`}</div>
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          {success && <div className="text-green-600 text-sm">{success}</div>}
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onBack}>ย้อนกลับ</Button>
            <Button type="submit" disabled={alreadyApplied}>ยืนยันสมัคร</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function LoanStatus() {
  const auth = useAuthStore();
  const { applications, loanOffers } = useLoanStore();
  const myApps = applications.filter((a) => a.studentId === auth.user?.studentId);
  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>สถานะคำขอกู้ยืมของฉัน</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">ประเภทเงินกู้</th>
                <th className="p-2 text-left">GPA</th>
                <th className="p-2 text-left">รายได้ครอบครัว</th>
                <th className="p-2 text-left">สถานะ</th>
                <th className="p-2 text-left">เหตุผล (ถ้ามี)</th>
                <th className="p-2 text-left">วันที่สมัคร</th>
              </tr>
            </thead>
            <tbody>
              {myApps.length === 0 && (
                <tr><td colSpan={6} className="text-center py-4 text-gray-400">ยังไม่มีคำขอกู้ยืม</td></tr>
              )}
              {myApps.map((a) => {
                const offer = loanOffers.find((o) => o.id === a.offerId);
                return (
                  <tr key={a.id} className="border-b">
                    <td className="p-2">{offer?.offer_name}</td>
                    <td className="p-2">{a.gpa}</td>
                    <td className="p-2">{a.familyIncome.toLocaleString()}</td>
                    <td className="p-2">
                      {a.status === "Pending" && <span className="text-yellow-600">รอดำเนินการ</span>}
                      {a.status === "Approved" && <span className="text-green-600">อนุมัติ</span>}
                      {a.status === "Rejected" && <span className="text-red-600">ไม่อนุมัติ</span>}
                    </td>
                    <td className="p-2">{a.reason || "-"}</td>
                    <td className="p-2">{new Date(a.submittedAt).toLocaleDateString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

export default function StudentDashboard() {
  const auth = useAuthStore();
  const router = useRouter();
  const [selectedOffer, setSelectedOffer] = useState<string | null>(null);

  if (!auth.user) {
    router.replace("/login");
    return null;
  }
  if (auth.user.role !== "student") {
    router.replace("/admin");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <header className="bg-white shadow flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">👨‍🎓</span>
          <span className="font-bold text-lg">Student Loan Dashboard</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-700">{auth.user.name}</span>
          <Button variant="outline" onClick={() => { useAuthStore.getState().logout(); router.push("/login"); }}>ออกจากระบบ</Button>
        </div>
      </header>
      <main className="max-w-4xl mx-auto mt-8 px-4">
        {!selectedOffer ? (
          <>
            <h2 className="font-semibold text-xl mb-4">เลือกประเภทเงินกู้</h2>
            <LoanOfferSelection onSelect={setSelectedOffer} />
          </>
        ) : (
          <LoanApplicationForm offerId={selectedOffer} onBack={() => setSelectedOffer(null)} />
        )}
        <LoanStatus />
      </main>
      <footer className="mt-12 text-center text-xs text-gray-400">Student Loan Registration Platform © 2024</footer>
    </div>
  );
}
