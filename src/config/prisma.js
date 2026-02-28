import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis;

const prisma = globalForPrisma.prisma ?? new PrismaClient({ log: ["error"] });

if(process.env.environtment !== "production") {
    globalForPrisma.prisma = prisma;
}

export default prisma;