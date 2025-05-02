/*
  Warnings:

  - You are about to drop the column `name` on the `ProductOption` table. All the data in the column will be lost.
  - You are about to drop the column `optionId` on the `ProductVariant` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[productId,optionId]` on the table `ProductOption` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ProductOptionId,quantity]` on the table `ProductVariant` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `optionId` to the `ProductOption` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ProductOptionId` to the `ProductVariant` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ProductVariant" DROP CONSTRAINT "ProductVariant_optionId_fkey";

-- DropIndex
DROP INDEX "ProductOption_productId_name_key";

-- DropIndex
DROP INDEX "ProductVariant_optionId_quantity_key";

-- AlterTable
ALTER TABLE "ProductOption" DROP COLUMN "name",
ADD COLUMN     "optionId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ProductVariant" DROP COLUMN "optionId",
ADD COLUMN     "ProductOptionId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Option" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Option_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Option_name_key" ON "Option"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ProductOption_productId_optionId_key" ON "ProductOption"("productId", "optionId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductVariant_ProductOptionId_quantity_key" ON "ProductVariant"("ProductOptionId", "quantity");

-- AddForeignKey
ALTER TABLE "ProductOption" ADD CONSTRAINT "ProductOption_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "Option"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductVariant" ADD CONSTRAINT "ProductVariant_ProductOptionId_fkey" FOREIGN KEY ("ProductOptionId") REFERENCES "ProductOption"("id") ON DELETE CASCADE ON UPDATE CASCADE;
