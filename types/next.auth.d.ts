import NextAuth, { DefaultSession } from "next-auth/next";
import { JWT } from "next-auth/jwt";

// this will allow us to override some types.

declare module "next-auth" {
  interface Session {
    user: {
      username: String;
      role: string;
    } & DefaultSession["user"];
  }
  interface User {
    id: number;
    name: string;
    username: string;
    role: Role;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
  }
}
