/*
  Warnings:

  - You are about to drop the column `itemModifierId` on the `ms_product` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ms_product" DROP CONSTRAINT "ms_product_itemModifierId_fkey";

-- AlterTable
ALTER TABLE "ms_product" DROP COLUMN "itemModifierId",
ADD COLUMN     "item_modifier_id" TEXT;

-- AddForeignKey
ALTER TABLE "ms_product" ADD CONSTRAINT "ms_product_item_modifier_id_fkey" FOREIGN KEY ("item_modifier_id") REFERENCES "ms_item_modifier"("id") ON DELETE SET NULL ON UPDATE CASCADE;
