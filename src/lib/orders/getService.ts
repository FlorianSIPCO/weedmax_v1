import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export const getOrdersByUserId = async (userId: string) => {
  return await prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
};
