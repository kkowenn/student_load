import { Card } from "@/components/ui/card";
import { BarChartIcon } from "lucide-react";

export default function FinancialInsights({
  transactions,
}: {
  transactions: Transaction[];
}) {
  const deposits = transactions.filter((t) => t.type === "deposit");
  const withdrawals = transactions.filter((t) => t.type === "withdrawal");
  const totalDeposits = deposits.reduce((sum, t) => sum + t.amount, 0);
  const totalWithdrawals = withdrawals.reduce((sum, t) => sum + t.amount, 0);
  const net = totalDeposits - totalWithdrawals;

  return (
    <Card className="w-full p-4 flex flex-col gap-4">
      <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
        <BarChartIcon className="w-5 h-5" /> Financial Insights
      </h3>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between">
          <span className="text-gray-500">Total Deposited</span>
          <span className="text-green-600 font-semibold">
            +${totalDeposits.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Total Withdrawn</span>
          <span className="text-red-600 font-semibold">
            -${totalWithdrawals.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        </div>
        <div className="flex justify-between border-t pt-2 mt-2">
          <span className="font-bold">Net</span>
          <span className={net >= 0 ? "text-green-700 font-bold" : "text-red-700 font-bold"}>
            {net >= 0 ? "+" : "-"}${Math.abs(net).toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>
    </Card>
  );
}

type Transaction = {
  id: number;
  type: "deposit" | "withdrawal";
  amount: number;
  description: string;
  timestamp: string;
};
