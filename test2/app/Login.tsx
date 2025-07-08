"use client";
import { useState } from "react";
import { User } from "./types";
import { mockUsers } from "./mock-users";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface LoginProps {
  onLogin: (user: User) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [selectedId, setSelectedId] = useState<string>("");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>เข้าสู่ระบบ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <select
              className="border rounded px-3 py-2"
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
            >
              <option value="">เลือกผู้ใช้...</option>
              {mockUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.role === "student" ? "นักศึกษา" : "แอดมิน"})
                </option>
              ))}
            </select>
            <Button
              disabled={!selectedId}
              onClick={() => {
                const user = mockUsers.find((u) => u.id === selectedId);
                if (user) onLogin(user);
              }}
              className="w-full"
            >
              เข้าสู่ระบบ
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
