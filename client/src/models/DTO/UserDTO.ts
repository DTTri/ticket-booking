import { UserRole } from "@/constants";

export type UserSignupDTO = {
  email: string;
  password: string;
  username: string;
  role: UserRole;
};
