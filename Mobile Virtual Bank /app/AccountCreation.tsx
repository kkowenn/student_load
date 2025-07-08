import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function AccountCreation({ onCreate }: { onCreate: (acc: Account) => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError("Please enter your name and email.");
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    onCreate({ name, email, balance: 1000 });
  };

  return (
    <Card className="w-full max-w-sm mx-auto p-6 mt-8">
      <h2 className="text-xl font-bold mb-4 text-center">Create Your Account</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />
        <Input
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <Button type="submit" className="mt-2">Create Account</Button>
      </form>
    </Card>
  );
}

type Account = {
  name: string;
  email: string;
  balance: number;
};
