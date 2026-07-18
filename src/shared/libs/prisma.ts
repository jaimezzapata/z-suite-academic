import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PrismaClient } from "@/generated/prisma/client";

declare global {
  // Reuse Prisma in development to avoid exhausting DB connections on hot reload.
  var __zSuitePrisma__: PrismaClient | undefined;
  var __zSuitePgPool__: Pool | undefined;
}

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL no esta configurada.");
}

const pool =
  globalThis.__zSuitePgPool__ ??
  new Pool({
    connectionString,
  });

const adapter = new PrismaPg(pool);

export const prisma =
  globalThis.__zSuitePrisma__ ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.__zSuitePgPool__ = pool;
  globalThis.__zSuitePrisma__ = prisma;
}
