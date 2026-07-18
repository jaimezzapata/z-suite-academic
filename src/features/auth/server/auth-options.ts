import { PrismaAdapter } from "@auth/prisma-adapter";
import type { Adapter } from "next-auth/adapters";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { loginSchema } from "@/features/auth/validations/login-schema";
import { verifyPassword } from "@/features/auth/server/password-hasher";
import { encryptToken } from "@/features/auth/server/token-crypto";
import { prisma } from "@/shared/libs/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  pages: {
    signIn: "/login",
  },
  providers: [
    GoogleProvider({
      authorization: {
        params: {
          access_type: "offline",
          prompt: "consent",
          response_type: "code",
        },
      },
      clientId: process.env.AUTH_GOOGLE_ID ?? "",
      clientSecret: process.env.AUTH_GOOGLE_SECRET ?? "",
    }),
    CredentialsProvider({
      name: "Credenciales",
      credentials: {
        email: { label: "Correo", type: "email" },
        password: { label: "Contrasena", type: "password" },
      },
      async authorize(credentials) {
        const parsedCredentials = loginSchema.safeParse(credentials);
        if (!parsedCredentials.success) {
          return null;
        }

        const email = parsedCredentials.data.email.trim().toLowerCase();
        const user = await prisma.user.findUnique({
          where: { email },
          include: {
            credential: true,
          },
        });

        if (!user?.credential) {
          return null;
        }

        const isPasswordValid = verifyPassword(
          parsedCredentials.data.password,
          user.credential.passwordHash,
        );

        if (!isPasswordValid || !user.email) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }

      return session;
    },
  },
  events: {
    async signIn({ account }) {
      if (
        !account ||
        account.provider !== "google" ||
        typeof account.refresh_token !== "string" ||
        !account.refresh_token
      ) {
        return;
      }

      await prisma.account.updateMany({
        data: {
          refreshTokenEncrypted: encryptToken(account.refresh_token),
          refresh_token: null,
        },
        where: {
          provider: account.provider,
          providerAccountId: account.providerAccountId,
        },
      });
    },
  },
  session: {
    strategy: "database",
  },
  secret: process.env.AUTH_SECRET,
};
