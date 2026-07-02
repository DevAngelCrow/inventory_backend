/*
  Warnings:

  - You are about to drop the column `delivery_city` on the `mnt_reservation` table. All the data in the column will be lost.
  - You are about to drop the column `delivery_state` on the `mnt_reservation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "mnt_reservation" DROP COLUMN "delivery_city",
DROP COLUMN "delivery_state",
ADD COLUMN     "delivery_address_line2" VARCHAR(255),
ADD COLUMN     "id_customer_address" UUID,
ADD COLUMN     "id_geographic_division" UUID;

-- AddForeignKey
ALTER TABLE "mnt_reservation" ADD CONSTRAINT "mnt_reservation_id_customer_address_fkey" FOREIGN KEY ("id_customer_address") REFERENCES "mnt_customer_address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mnt_reservation" ADD CONSTRAINT "mnt_reservation_id_geographic_division_fkey" FOREIGN KEY ("id_geographic_division") REFERENCES "ctl_geographic_division"("id") ON DELETE SET NULL ON UPDATE CASCADE;
