import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusIcon, MinusIcon } from "lucide-react";

export default function AccountOverview({
  account,
  onNewTransaction,
}: {
  account: Account;
  onNewTransaction: (tx: Transaction) => void;
}) {
  const [amount, setAmount] = useState("");
  const [desc, setDesc] = useState("");
  const [type, setType] = useState<"deposit" | "withdrawal">("deposit");
  const [error, setError] = useState("");

  const handleTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) {
      setError("Enter a valid amount.");
      return;
    }
    if (type === "withdrawal" && amt > account.balance) {
      setError("Insufficient funds.");
      return;
    }
    onNewTransaction({
      id: Date.now(),
      type,
      amount: amt,
      description: desc || (type === "deposit" ? "Deposit" : "Withdrawal"),
      timestamp: new Date().toISOString(),
    });
    setAmount("");
    setDesc("");
    setError("");
  };

  return (
    <Card className="w-full p-6 flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2">
        <div className="text-3xl">🏦</div>
        <div className="text-lg font-semibold">{account.name}</div>
        <div className="text-gray-500 text-sm">{account.email}</div>
        <div className="mt-2 text-2xl font-bold text-blue-600">
          ${account.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </div>
        <div className="text-xs text-gray-400">Current Balance</div>
      </div>
      <form onSubmit={handleTransaction} className="flex flex-col gap-3">
        <div className="flex gap-2">
          <Button
            type="button"
            variant={type === "deposit" ? "default" : "outline"}
            onClick={() => setType("deposit")}
            className="flex-1 flex items-center gap-1"
          >
            <PlusIcon className="w-4 h-4" /> Deposit
          </Button>
          <Button
            type="button"
            variant={type === "withdrawal" ? "default" : "outline"}
            onClick={() => setType("withdrawal")}
            className="flex-1 flex items-center gap-1"
          >
            <MinusIcon className="w-4 h-4" /> Withdraw
          </Button>
        </div>
        <Input
          type="number"
          min="0"
          step="0.01"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <Input
          placeholder="Description (optional)"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <Button type="submit" className="mt-2 w-full">
          {type === "deposit" ? "Deposit" : "Withdraw"}
        </Button>
      </form>
    </Card>
  );
}

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
