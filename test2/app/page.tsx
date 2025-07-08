"use client";
import { useState } from "react";
import { User, LoanApplication } from "./types";
import { Login } from "./Login";
import { StudentLoanForm } from "./StudentLoanForm";
import { StudentLoanList } from "./StudentLoanList";
import { AdminLoanPanel } from "./AdminLoanPanel";
import { addLoanApplication, getLoanApplicationsByStudent, getAllLoanApplications, updateLoanApplicationStatus } from "./loan-application-utils";
import { cn } from "@/lib/utils";
import { LogOutIcon } from "lucide-react";

export default function Page() {
  const [user, setUser] = useState<User | null>(null);
  const [refresh, setRefresh] = useState(0);

  function handleLogin(u: User) {
    setUser(u);
  }

  function handleLogout() {
    setUser(null);
  }

  function handleSubmitLoan(app: LoanApplication) {
    addLoanApplication(app);
    setRefresh((r) => r + 1);
  }

  function handleApprove(appId: string) {
    updateLoanApplicationStatus(appId, "approved");
    setRefresh((r) => r + 1);
  }

  function handleReject(appId: string) {
    updateLoanApplicationStatus(appId, "rejected");
    setRefresh((r) => r + 1);
  }

  // Navbar
  function Navbar() {
    return (
      <nav className="w-full bg-blue-700 text-white py-3 px-6 flex items-center justify-between shadow">
        <div className="font-bold text-lg">ระบบลงทะเบียนกู้ยืมการศึกษา</div>
        {user && (
          <div className="flex items-center gap-3">
            <span className="font-medium">{user.name} ({user.role === "student" ? "นักศึกษา" : "แอดมิน"})</span>
            <button
              className="ml-2 p-2 rounded hover:bg-blue-800 transition"
              onClick={handleLogout}
              aria-label="ออกจากระบบ"
            >
              <LogOutIcon size={20} />
            </button>
          </div>
        )}
      </nav>
    );
  }

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className={cn("flex-1", user.role === "student" ? "bg-gradient-to-b from-blue-50 to-white" : "bg-gradient-to-b from-gray-100 to-white")}> 
        {user.role === "student" ? (
          <>
            <StudentLoanForm user={user} onSubmit={handleSubmitLoan} />
            <StudentLoanList applications={getLoanApplicationsByStudent(user.id)} />
          </>
        ) : (
          <AdminLoanPanel
            applications={getAllLoanApplications()}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        )}
      </main>
      <footer className="w-full bg-blue-700 text-white text-center py-4 mt-8">
        &copy; {new Date().getFullYear()} ระบบลงทะเบียนกู้ยืมการศึกษา
      </footer>
    </div>
  );
}
