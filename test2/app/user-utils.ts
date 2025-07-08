import { User } from "./types";
import { mockUsers } from "./mock-users";

export function getUserById(id: string): User | undefined {
  return mockUsers.find((u) => u.id === id);
}

export function getAllUsers(): User[] {
  return mockUsers;
}
