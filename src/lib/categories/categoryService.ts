import { PrismaClient } from "@/generated/prisma";
import slugify from "slugify"

const prisma = new PrismaClient();

export const getAllCategories = async () => {
  const categories = await prisma.category.findMany();

  // 1. On sépare "promos" des autres
  const promos = categories.find((cat) => cat.slug === "promos");
  const others = categories
    .filter((cat) => cat.slug !== "promos")
    .sort((a, b) => a.name.localeCompare(b.name));

  // 2. On place "promos" à la fin si elle existe
  return promos ? [...others, promos] : others;
};

export const getCategoryById = async (id: string) => {
  return await prisma.category.findUnique({
    where: { id },
  });
};

export const createCategory = async (name: string) => {
  const slug = slugify(name, { lower: true, strict: true })
  return await prisma.category.create({
    data: { name, slug },
  });
};

export const updateCategory = async (id: string, name: string) => {
  const slug = slugify(name, { lower: true, strict: true });
  return await prisma.category.update({
    where: { id },
    data: { name, slug },
  });
};

export const deleteCategory = async (id: string) => {
  return await prisma.category.delete({
    where: { id },
  });
};
