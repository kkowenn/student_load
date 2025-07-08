"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BellIcon, PlusIcon, LogOutIcon, BarChartIcon, UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Navbar from "./Navbar";
import AccountCreation from "./AccountCreation";
import AccountOverview from "./AccountOverview";
import TransactionHistory from "./TransactionHistory";
import FinancialInsights from "./FinancialInsights";
import Notifications from "./Notifications";

export default function Page() {
  const [account, setAccount] = useState<Account | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [tab, setTab] = useState("overview");

  // Simulate loading account and transactions from localStorage
  useEffect(() => {
    const acc = localStorage.getItem("account");
    const txs = localStorage.getItem("transactions");
    const notifs = localStorage.getItem("notifications");
    if (acc) setAccount(JSON.parse(acc));
    if (txs) setTransactions(JSON.parse(txs));
    if (notifs) setNotifications(JSON.parse(notifs));
  }, []);

  // Persist data
  useEffect(() => {
    localStorage.setItem("account", JSON.stringify(account));
  }, [account]);
  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);
  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(notifications));
  }, [notifications]);

  // Handle new account creation
  const handleCreateAccount = (acc: Account) => {
    setAccount(acc);
    setNotifications((prev) => [
      {
        id: Date.now(),
        type: "info",
        message: `Welcome, ${acc.name}! Your account has been created.`,
        read: false,
        timestamp: new Date().toISOString(),
      },
      ...prev,
    ]);
  };

  // Handle new transaction
  const handleNewTransaction = (tx: Transaction) => {
    setTransactions((prev) => [tx, ...prev]);
    setAccount((prev) =>
      prev
        ? {
            ...prev,
            balance:
              tx.type === "deposit"
                ? prev.balance + tx.amount
                : prev.balance - tx.amount,
          }
        : prev
    );
    setNotifications((prev) => [
      {
        id: Date.now(),
        type: tx.type === "deposit" ? "success" : "warning",
        message:
          tx.type === "deposit"
            ? `Deposit of $${tx.amount.toFixed(2)} received.`
            : `Withdrawal of $${tx.amount.toFixed(2)} processed.`,
        read: false,
        timestamp: new Date().toISOString(),
      },
      ...prev,
    ]);
  };

  // Mark notification as read
  const markNotificationRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  // Log out (clear data)
  const handleLogout = () => {
    setAccount(null);
    setTransactions([]);
    setNotifications([]);
    localStorage.clear();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
      <Navbar
        account={account}
        onLogout={handleLogout}
        notifications={notifications}
        onTabChange={setTab}
        activeTab={tab}
      />
      <main className="flex-1 flex flex-col items-center px-2 py-4 max-w-md mx-auto w-full">
        {!account ? (
          <AccountCreation onCreate={handleCreateAccount} />
        ) : (
          <Tabs value={tab} onValueChange={setTab} className="w-full">
            <TabsList className="grid grid-cols-4 gap-1 mb-4">
              <TabsTrigger value="overview" className="flex flex-col items-center">
                <UserIcon className="w-5 h-5 mb-1" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="history" className="flex flex-col items-center">
                <BarChartIcon className="w-5 h-5 mb-1" />
                History
              </TabsTrigger>
              <TabsTrigger value="insights" className="flex flex-col items-center">
                <BarChartIcon className="w-5 h-5 mb-1" />
                Insights
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex flex-col items-center">
                <BellIcon className="w-5 h-5 mb-1" />
                Alerts
              </TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <AccountOverview
                account={account}
                onNewTransaction={handleNewTransaction}
              />
            </TabsContent>
            <TabsContent value="history">
              <TransactionHistory transactions={transactions} />
            </TabsContent>
            <TabsContent value="insights">
              <FinancialInsights transactions={transactions} />
            </TabsContent>
            <TabsContent value="notifications">
              <Notifications
                notifications={notifications}
                onMarkRead={markNotificationRead}
              />
            </TabsContent>
          </Tabs>
        )}
      </main>
      <footer className="w-full py-3 text-center text-xs text-gray-400 bg-white border-t">
        Virtual Bank &copy; {new Date().getFullYear()} — Secure. Simple. Smart.
      </footer>
    </div>
  );
}

// Types
type Account = {
  name: string;
  email: string;
  balance: number;
};

type Transaction = {
  id: number;
  type: "deposit" | "withdrawal";
  amount: number;
  description: string;
  timestamp: string;
};

type Notification = {
  id: number;
  type: "info" | "success" | "warning" | "error";
  message: string;
  read: boolean;
  timestamp: string;
};
