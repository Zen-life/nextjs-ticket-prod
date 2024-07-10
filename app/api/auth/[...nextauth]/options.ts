import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/prisma/db";
import bcrypt from "bcryptjs";

const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "password",
      name: "username and password",
      credentials: {
        username: {
          label: "Username",
          typr: "text",
          placeholder: "Username...",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      // authorise the user. must check if valid user or not
      // by looking into the db, hash the psw and compare
      // before authorising the user or not
      // the exclamation mark in 'credentials!.username' informs typescripot that we expect the
      // username and password to be there. Therefore, we are over riding the typescript warning
      authorize: async (credentials) => {
        const user = await prisma.user.findUnique({
          where: { username: credentials!.username },
        });

        if (!user) {
          return null;
        }

        const match = await bcrypt.compare(
          credentials!.password,
          user.password
        );

        if (match) {
          return user;
        }

        // if we get to this point, it means the user does not exist in
        // our db, so we will not return any data, hence, null.
        return null;
      },
    }),
  ],
  callbacks: {
    // to enable us to use roles in our session data, e.g. have control so admin can access but not user etc.
    async jwt({ token, account, user }) {
      if (account) {
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        // if they don't have a role, we assign them the minimum role as a user
        session.user.role = token.role || "USER";
      }
      return session;
    },
  },
};

export default options;
