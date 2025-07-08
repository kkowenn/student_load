import { BellIcon, LogOutIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type NavbarProps = {
  account: Account | null;
  onLogout: () => void;
  notifications: Notification[];
  onTabChange: (tab: string) => void;
  activeTab: string;
};

export default function Navbar({
  account,
  onLogout,
  notifications,
  onTabChange,
  activeTab,
}: NavbarProps) {
  const unreadCount = notifications.filter((n) => !n.read).length;
  return (
    <nav className="w-full bg-white border-b shadow-sm flex items-center px-4 py-2 justify-between sticky top-0 z-10">
      <div className="flex items-center gap-2">
        <span className="font-bold text-lg text-blue-600">Virtual Bank</span>
      </div>
      {account && (
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            className={cn(
              "relative p-2",
              activeTab === "notifications" && "bg-blue-50"
            )}
            onClick={() => onTabChange("notifications")}
            aria-label="Notifications"
          >
            <BellIcon className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs px-1.5 py-0.5">
                {unreadCount}
              </span>
            )}
          </Button>
          <Button
            variant="ghost"
            className="p-2"
            onClick={onLogout}
            aria-label="Log out"
          >
            <LogOutIcon className="w-5 h-5" />
          </Button>
        </div>
      )}
    </nav>
  );
}

type Account = {
  name: string;
  email: string;
  balance: number;
};

type Notification = {
  id: number;
  type: "info" | "success" | "warning" | "error";
  message: string;
  read: boolean;
  timestamp: string;
};
