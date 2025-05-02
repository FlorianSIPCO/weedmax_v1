import { PrismaClient } from '@/generated/prisma';
const prisma = new PrismaClient();

export const getAllOptions = async () => {
  return prisma.option.findMany({ orderBy: { name: 'asc' } });
};

export const createOption = async (name: string) => {
  if (!name.trim()) throw new Error('Le nom est requis');

  return prisma.option.create({
    data: { name: name.trim() },
  });
};

export const updateOption = async (id: string, name: string) => {
  if (!name.trim()) throw new Error('Le nom est requis');

  return prisma.option.update({
    where: { id },
    data:  { name: name.trim() },
  });
};

export const deleteOption = async (id: string) => {
  return prisma.option.delete({ where: { id } });
};