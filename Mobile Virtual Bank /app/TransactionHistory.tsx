import { Card } from "@/components/ui/card";

export default function TransactionHistory({
  transactions,
}: {
  transactions: Transaction[];
}) {
  return (
    <Card className="w-full p-4">
      <h3 className="font-bold text-lg mb-3">Transaction History</h3>
      {transactions.length === 0 ? (
        <div className="text-gray-400 text-center py-8">No transactions yet.</div>
      ) : (
        <ul className="flex flex-col gap-3">
          {transactions.map((tx) => (
            <li
              key={tx.id}
              className="flex items-center justify-between border-b last:border-b-0 pb-2"
            >
              <div>
                <div className="font-medium">
                  {tx.type === "deposit" ? (
                    <span className="text-green-600">Deposit</span>
                  ) : (
                    <span className="text-red-600">Withdrawal</span>
                  )}
                </div>
                <div className="text-xs text-gray-400">
                  {new Date(tx.timestamp).toLocaleString()} — {tx.description}
                </div>
              </div>
              <div
                className={
                  tx.type === "deposit"
                    ? "text-green-600 font-bold"
                    : "text-red-600 font-bold"
                }
              >
                {tx.type === "deposit" ? "+" : "-"}${tx.amount.toFixed(2)}
              </div>
            </li>
          ))}
        </ul>
      )}
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
