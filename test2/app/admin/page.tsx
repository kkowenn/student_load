"use client";
import { useAuthStore } from "../auth-store";
import { useLoanStore } from "../loan-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useRouter } from "next/navigation";

function LoanOfferAdminList() {
  const { loanOffers, addLoanOffer, updateLoanOffer, deleteLoanOffer } = useLoanStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    offer_name: "",
    description: "",
    offer_per_months: "",
    student_required_gpa: "",
    family_required_annual_income: "",
  });
  const [error, setError] = useState("");

  function handleEdit(offer: any) {
    setEditingId(offer.id);
    setForm({
      offer_name: offer.offer_name,
      description: offer.description,
      offer_per_months: offer.offer_per_months.toString(),
      student_required_gpa: offer.student_required_gpa.toString(),
      family_required_annual_income: offer.family_required_annual_income.toString(),
    });
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const { offer_name, description, offer_per_months, student_required_gpa, family_required_annual_income } = form;
    if (!offer_name || !description || !offer_per_months || !student_required_gpa || !family_required_annual_income) {
      setError("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }
    if (editingId) {
      updateLoanOffer(editingId, {
        offer_name,
        description,
        offer_per_months: parseInt(offer_per_months),
        student_required_gpa: parseFloat(student_required_gpa),
        family_required_annual_income: parseInt(family_required_annual_income),
      });
      setEditingId(null);
    } else {
      addLoanOffer({
        offer_name,
        description,
        offer_per_months: parseInt(offer_per_months),
        student_required_gpa: parseFloat(student_required_gpa),
        family_required_annual_income: parseInt(family_required_annual_income),
      });
    }
    setForm({
      offer_name: "",
      description: "",
      offer_per_months: "",
      student_required_gpa: "",
      family_required_annual_income: "",
    });
  }

  function handleDelete(id: string) {
    if (window.confirm("ยืนยันลบรายการนี้?")) {
      deleteLoanOffer(id);
    }
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>จัดการประเภทเงินกู้</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-4" onSubmit={handleSave}>
          <Input placeholder="ชื่อเงินกู้" value={form.offer_name} onChange={e => setForm(f => ({ ...f, offer_name: e.target.value }))} />
          <Input placeholder="รายละเอียด" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          <Input placeholder="บาท/เดือน" type="number" value={form.offer_per_months} onChange={e => setForm(f => ({ ...f, offer_per_months: e.target.value }))} />
          <Input placeholder="GPA ขั้นต่ำ" type="number" step="0.01" value={form.student_required_gpa} onChange={e => setForm(f => ({ ...f, student_required_gpa: e.target.value }))} />
          <Input placeholder="รายได้ครอบครัวสูงสุด" type="number" value={form.family_required_annual_income} onChange={e => setForm(f => ({ ...f, family_required_annual_income: e.target.value }))} />
          <Button type="submit" className="col-span-1 md:col-span-5 mt-2">{editingId ? "บันทึกการแก้ไข" : "เพิ่มประเภทเงินกู้"}</Button>
          {error && <div className="col-span-5 text-red-500 text-sm">{error}</div>}
        </form>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">ชื่อเงินกู้</th>
                <th className="p-2 text-left">รายละเอียด</th>
                <th className="p-2 text-left">บาท/เดือน</th>
                <th className="p-2 text-left">GPA ขั้นต่ำ</th>
                <th className="p-2 text-left">รายได้ครอบครัวสูงสุด</th>
                <th className="p-2 text-left">การจัดการ</th>
              </tr>
            </thead>
            <tbody>
              {loanOffers.map((offer) => (
                <tr key={offer.id} className="border-b">
                  <td className="p-2">{offer.offer_name}</td>
                  <td className="p-2">{offer.description}</td>
                  <td className="p-2">{offer.offer_per_months.toLocaleString()}</td>
                  <td className="p-2">{offer.student_required_gpa}</td>
                  <td className="p-2">{offer.family_required_annual_income.toLocaleString()}</td>
                  <td className="p-2 flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(offer)}>แก้ไข</Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(offer.id)}>ลบ</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function LoanApplicationsOverview({ onSelectApplicant }: { onSelectApplicant: (id: string) => void }) {
  const { applications, loanOffers } = useLoanStore();
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>รายการคำขอกู้ทั้งหมด</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">รหัสนักศึกษา</th>
                <th className="p-2 text-left">ประเภทเงินกู้</th>
                <th className="p-2 text-left">GPA</th>
                <th className="p-2 text-left">รายได้ครอบครัว</th>
                <th className="p-2 text-left">สถานะ</th>
                <th className="p-2 text-left">วันที่สมัคร</th>
                <th className="p-2 text-left">รายละเอียด</th>
              </tr>
            </thead>
            <tbody>
              {applications.length === 0 && (
                <tr><td colSpan={7} className="text-center py-4 text-gray-400">ยังไม่มีคำขอกู้ยืม</td></tr>
              )}
              {applications.map((a) => {
                const offer = loanOffers.find((o) => o.id === a.offerId);
                return (
                  <tr key={a.id} className="border-b">
                    <td className="p-2">{a.studentId}</td>
                    <td className="p-2">{offer?.offer_name}</td>
                    <td className="p-2">{a.gpa}</td>
                    <td className="p-2">{a.familyIncome.toLocaleString()}</td>
                    <td className="p-2">
                      {a.status === "Pending" && <span className="text-yellow-600">รอดำเนินการ</span>}
                      {a.status === "Approved" && <span className="text-green-600">อนุมัติ</span>}
                      {a.status === "Rejected" && <span className="text-red-600">ไม่อนุมัติ</span>}
                    </td>
                    <td className="p-2">{new Date(a.submittedAt).toLocaleDateString()}</td>
                    <td className="p-2">
                      <Button variant="outline" size="sm" onClick={() => onSelectApplicant(a.id)}>ดูรายละเอียด</Button>
                    </td>
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

function ApplicantDetails({ applicationId, onBack }: { applicationId: string; onBack: () => void }) {
  const { applications, loanOffers, updateApplicationStatus } = useLoanStore();
  const app = applications.find((a) => a.id === applicationId);
  const [reason, setReason] = useState(app?.reason || "");
  const [error, setError] = useState("");
  if (!app) return null;
  const offer = loanOffers.find((o) => o.id === app.offerId);

  function handleApprove() {
    updateApplicationStatus(app.id, "Approved");
    onBack();
  }
  function handleReject() {
    if (!reason) {
      setError("กรุณาระบุเหตุผลการไม่อนุมัติ");
      return;
    }
    updateApplicationStatus(app.id, "Rejected", reason);
    onBack();
  }

  return (
    <Card className="max-w-lg mx-auto mt-6">
      <CardHeader>
        <CardTitle>รายละเอียดผู้สมัคร</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-2">รหัสนักศึกษา: <span className="font-semibold">{app.studentId}</span></div>
        <div className="mb-2">ประเภทเงินกู้: <span className="font-semibold">{offer?.offer_name}</span></div>
        <div className="mb-2">GPA: <span className="font-semibold">{app.gpa}</span></div>
        <div className="mb-2">รายได้ครอบครัว: <span className="font-semibold">{app.familyIncome.toLocaleString()}</span> บาท/ปี</div>
        <div className="mb-2">เอกสารแนบ: {app.documents.length > 0 ? app.documents.map((d, i) => <span key={i} className="inline-block bg-gray-200 rounded px-2 py-1 mr-1 text-xs">{d}</span>) : "-"}</div>
        <div className="mb-2">สถานะ: {app.status === "Pending" && <span className="text-yellow-600">รอดำเนินการ</span>}{app.status === "Approved" && <span className="text-green-600">อนุมัติ</span>}{app.status === "Rejected" && <span className="text-red-600">ไม่อนุมัติ</span>}</div>
        <div className="mb-2">เหตุผล: {app.reason || "-"}</div>
        {app.status === "Pending" && (
          <div className="mt-4 space-y-2">
            <Label htmlFor="reason">เหตุผล (ถ้าปฏิเสธ)</Label>
            <Input id="reason" value={reason} onChange={e => setReason(e.target.value)} />
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <div className="flex gap-2 mt-2">
              <Button variant="outline" onClick={onBack}>ย้อนกลับ</Button>
              <Button variant="destructive" onClick={handleReject}>ไม่อนุมัติ</Button>
              <Button variant="default" onClick={handleApprove}>อนุมัติ</Button>
            </div>
          </div>
        )}
        {app.status !== "Pending" && (
          <Button variant="outline" className="mt-4" onClick={onBack}>ย้อนกลับ</Button>
        )}
      </CardContent>
    </Card>
  );
}

export default function AdminDashboard() {
  const auth = useAuthStore();
  const router = useRouter();
  const [selectedApplicant, setSelectedApplicant] = useState<string | null>(null);

  if (!auth.user) {
    router.replace("/login");
    return null;
  }
  if (auth.user.role !== "admin") {
    router.replace("/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <header className="bg-white shadow flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🛠️</span>
          <span className="font-bold text-lg">Admin Dashboard</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-700">{auth.user.name}</span>
          <Button variant="outline" onClick={() => { useAuthStore.getState().logout(); router.push("/login"); }}>ออกจากระบบ</Button>
        </div>
      </header>
      <main className="max-w-5xl mx-auto mt-8 px-4">
        <LoanOfferAdminList />
        {selectedApplicant ? (
          <ApplicantDetails applicationId={selectedApplicant} onBack={() => setSelectedApplicant(null)} />
        ) : (
          <LoanApplicationsOverview onSelectApplicant={setSelectedApplicant} />
        )}
      </main>
      <footer className="mt-12 text-center text-xs text-gray-400">Student Loan Registration Platform © 2024</footer>
    </div>
  );
}
