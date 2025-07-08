import { Card } from "@/components/ui/card";
import { BellIcon, CheckCircle2Icon, AlertTriangleIcon, XCircleIcon, InfoIcon } from "lucide-react";

const iconMap = {
  info: InfoIcon,
  success: CheckCircle2Icon,
  warning: AlertTriangleIcon,
  error: XCircleIcon,
};

const colorMap = {
  info: "text-blue-500",
  success: "text-green-600",
  warning: "text-yellow-600",
  error: "text-red-600",
};

export default function Notifications({
  notifications,
  onMarkRead,
}: {
  notifications: Notification[];
  onMarkRead: (id: number) => void;
}) {
  return (
    <Card className="w-full p-4">
      <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
        <BellIcon className="w-5 h-5" /> Notifications
      </h3>
      {notifications.length === 0 ? (
        <div className="text-gray-400 text-center py-8">No notifications.</div>
      ) : (
        <ul className="flex flex-col gap-3">
          {notifications.map((n) => {
            const Icon = iconMap[n.type];
            return (
              <li
                key={n.id}
                className="flex items-center gap-3 border-b last:border-b-0 pb-2"
              >
                <Icon className={`w-5 h-5 ${colorMap[n.type]}`} />
                <div className="flex-1">
                  <div className="font-medium">{n.message}</div>
                  <div className="text-xs text-gray-400">
                    {new Date(n.timestamp).toLocaleString()}
                  </div>
                </div>
                {!n.read && (
                  <button
                    className="text-xs text-blue-600 underline"
                    onClick={() => onMarkRead(n.id)}
                  >
                    Mark as read
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}

type Notification = {
  id: number;
  type: "info" | "success" | "warning" | "error";
  message: string;
  read: boolean;
  timestamp: string;
};
