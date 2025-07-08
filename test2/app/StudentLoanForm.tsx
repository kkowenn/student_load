"use client";
import { useState } from "react";
import { User, LoanOffer, LoanApplication } from "./types";
import { getAllLoanOffers } from "./loan-offer-utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { v4 as uuidv4 } from "uuid";

interface StudentLoanFormProps {
  user: User;
  onSubmit: (app: LoanApplication) => void;
}

export function StudentLoanForm({ user, onSubmit }: StudentLoanFormProps) {
  const offers = getAllLoanOffers();
  const [selectedOfferId, setSelectedOfferId] = useState<string>("");
  const [gpa, setGpa] = useState<string>("");
  const [familyIncome, setFamilyIncome] = useState<string>("");
  const [error, setError] = useState<string>("");

  const selectedOffer = offers.find((o) => o.id === selectedOfferId);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!selectedOfferId || !gpa || !familyIncome) {
      setError("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }
    const gpaNum = parseFloat(gpa);
    const incomeNum = parseInt(familyIncome, 10);
    if (isNaN(gpaNum) || isNaN(incomeNum)) {
      setError("กรุณากรอกข้อมูลตัวเลขให้ถูกต้อง");
      return;
    }
    const app: LoanApplication = {
      id: uuidv4(),
      studentId: user.id,
      offerId: selectedOfferId,
      status: "pending",
      submittedAt: new Date().toISOString(),
      gpa: gpaNum,
      familyIncome: incomeNum,
    };
    onSubmit(app);
    setSelectedOfferId("");
    setGpa("");
    setFamilyIncome("");
  }

  return (
    <Card className="w-full max-w-xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>สมัครกู้ยืมการศึกษา</CardTitle>
        <CardDescription>เลือกทุนและกรอกข้อมูลของคุณ</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <Label htmlFor="offer">เลือกทุน</Label>
          <select
            id="offer"
            className="border rounded px-3 py-2"
            value={selectedOfferId}
            onChange={(e) => setSelectedOfferId(e.target.value)}
          >
            <option value="">เลือก...</option>
            {offers.map((offer) => (
              <option key={offer.id} value={offer.id}>
                {offer.offer_name} ({offer.offer_per_months.toLocaleString()} บาท/เดือน)
              </option>
            ))}
          </select>
          {selectedOffer && (
            <div className="text-sm text-gray-600 bg-gray-100 rounded p-2">
              <div>รายละเอียด: {selectedOffer.description}</div>
              <div>GPA ขั้นต่ำ: {selectedOffer.student_required_gpa}</div>
              <div>รายได้ครอบครัวไม่เกิน: {selectedOffer.family_required_annual_income.toLocaleString()} บาท/ปี</div>
            </div>
          )}
          <Label htmlFor="gpa">GPA ของคุณ</Label>
          <Input
            id="gpa"
            type="number"
            step="0.01"
            min="0"
            max="4"
            value={gpa}
            onChange={(e) => setGpa(e.target.value)}
            required
          />
          <Label htmlFor="familyIncome">รายได้ครอบครัวต่อปี (บาท)</Label>
          <Input
            id="familyIncome"
            type="number"
            min="0"
            value={familyIncome}
            onChange={(e) => setFamilyIncome(e.target.value)}
            required
          />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <Button type="submit" className="w-full">ส่งคำขอกู้ยืม</Button>
        </form>
      </CardContent>
    </Card>
  );
}
