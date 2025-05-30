import { UserRole } from "@/constants";

export type User = {
  userId: string;
  userName: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
};
