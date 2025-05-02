-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "isNew" BOOLEAN,
ADD COLUMN     "isPromo" BOOLEAN,
ADD COLUMN     "rating" DOUBLE PRECISION,
ADD COLUMN     "reviewCount" INTEGER;
