import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function makePrismaClient(): PrismaClient {
  const url = (process.env.TURSO_DATABASE_URL || process.env.DATABASE_URL || "file:./prisma/dev.db").trim().replace(/^["']|["']$/g, "");
  const rawToken = process.env.TURSO_AUTH_TOKEN || process.env.TURSO_TOKEN;
  const authToken = rawToken?.trim().replace(/^["']|["']$/g, "");

  // When using a remote Turso libSQL connection (libsql:// or https://)
  if (url.startsWith("libsql://") || url.startsWith("https://") || url.startsWith("http://")) {
    const adapter = new PrismaLibSQL({
      url,
      authToken,
    });
    return new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
    });
  }

  // Fallback to local SQLite file
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });
}

export const db = globalForPrisma.prisma || makePrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
