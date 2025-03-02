/**
 * Initializes and exports a Prisma client instance.
 * 
 * The Prisma client is created and assigned to a global variable to ensure
 * that the same instance is reused across hot reloads during development.
 * This prevents the creation of multiple instances which could lead to
 * connection issues.
 * 
 * In production, a new instance is created each time.
 *
 */
import { PrismaClient } from "@prisma/client";

export const db =globalThis.prisma || new PrismaClient();

if(process.env.NODE_ENV !== "producction"){
    globalThis.prisma = db;
}

