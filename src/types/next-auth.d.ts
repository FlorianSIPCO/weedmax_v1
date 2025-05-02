import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    role: "ADMIN" | "CLIENT";
  }

  interface Session extends DefaultSession {
    user: User;
  }

  interface JWT {
    id: string;
    email: string;
    name?: string;
    role: "ADMIN" | "CLIENT";
  }
}
