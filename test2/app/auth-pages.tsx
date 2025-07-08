import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useAuthStore, UserRole } from "./auth-store";
import { useRouter } from "next/navigation";

const usersDB = [
  // Demo admin
  { id: "admin-1", studentId: "admin", name: "Admin", password: "admin123", role: "admin" as UserRole },
];

export function RegisterPage() {
  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (!studentId || !name || !password) {
      setError("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }
    // Simulate registration
    const exists = usersDB.find((u) => u.studentId === studentId);
    if (exists) {
      setError("รหัสนักศึกษานี้ถูกใช้แล้ว");
      return;
    }
    usersDB.push({
      id: `user-${studentId}`,
      studentId,
      name,
      password,
      role: "student",
    });
    router.push("/login");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>ลงทะเบียนนักศึกษา</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <Label htmlFor="studentId">รหัสนักศึกษา</Label>
              <Input id="studentId" value={studentId} onChange={e => setStudentId(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="name">ชื่อ-นามสกุล</Label>
              <Input id="name" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="password">รหัสผ่าน</Label>
              <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <Button type="submit" className="w-full">ลงทะเบียน</Button>
            <div className="text-center text-sm mt-2">
              มีบัญชีแล้ว? <a href="/login" className="text-blue-600 hover:underline">เข้าสู่ระบบ</a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export function LoginPage() {
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const login = useAuthStore((s) => s.login);
  const router = useRouter();

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const found = usersDB.find((u) => u.studentId === studentId && u.password === password);
    if (!found) {
      setError("รหัสนักศึกษาหรือรหัสผ่านไม่ถูกต้อง");
      return;
    }
    login({ id: found.id, studentId: found.studentId, name: found.name, role: found.role });
    if (found.role === "admin") {
      router.push("/admin");
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>เข้าสู่ระบบ</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="studentId">รหัสนักศึกษา</Label>
              <Input id="studentId" value={studentId} onChange={e => setStudentId(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="password">รหัสผ่าน</Label>
              <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <Button type="submit" className="w-full">เข้าสู่ระบบ</Button>
            <div className="text-center text-sm mt-2">
              ยังไม่มีบัญชี? <a href="/register" className="text-blue-600 hover:underline">ลงทะเบียน</a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
