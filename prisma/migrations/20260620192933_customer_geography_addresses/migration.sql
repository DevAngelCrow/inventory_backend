/*
  Warnings:

  - You are about to drop the column `address_line1` on the `mnt_customer` table. All the data in the column will be lost.
  - You are about to drop the column `address_line2` on the `mnt_customer` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `mnt_customer` table. All the data in the column will be lost.
  - You are about to drop the column `id_user` on the `mnt_customer` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `mnt_customer` table. All the data in the column will be lost.
  - You are about to drop the column `zip_code` on the `mnt_customer` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `mnt_invoice` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `mnt_payment` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `mnt_reservation` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `mnt_reservation_inspection` table. All the data in the column will be lost.
  - Added the required column `id_country` to the `mnt_customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_status` to the `mnt_invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_status` to the `mnt_payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_status` to the `mnt_reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_status` to the `mnt_reservation_inspection` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "mnt_payment" DROP CONSTRAINT "mnt_payment_id_payment_method_fkey";

-- DropForeignKey
ALTER TABLE "mnt_payment" DROP CONSTRAINT "mnt_payment_id_reservation_fkey";

-- DropIndex
DROP INDEX "mnt_customer_id_user_key";

-- DropIndex
DROP INDEX "mnt_invoice_status_idx";

-- DropIndex
DROP INDEX "mnt_payment_status_idx";

-- DropIndex
DROP INDEX "mnt_reservation_event_start_event_end_status_idx";

-- DropIndex
DROP INDEX "mnt_reservation_status_idx";

-- DropIndex
DROP INDEX "mnt_reservation_inspection_status_idx";

-- AlterTable
ALTER TABLE "mnt_customer" DROP COLUMN "address_line1",
DROP COLUMN "address_line2",
DROP COLUMN "city",
DROP COLUMN "id_user",
DROP COLUMN "state",
DROP COLUMN "zip_code",
ADD COLUMN     "id_country" UUID NOT NULL,
ADD COLUMN     "middle_name" VARCHAR(150);

-- AlterTable
ALTER TABLE "mnt_invoice" DROP COLUMN "status",
ADD COLUMN     "id_status" UUID NOT NULL;

-- AlterTable
ALTER TABLE "mnt_payment" DROP COLUMN "status",
ADD COLUMN     "id_status" UUID NOT NULL;

-- AlterTable
ALTER TABLE "mnt_reservation" DROP COLUMN "status",
ADD COLUMN     "id_status" UUID NOT NULL;

-- AlterTable
ALTER TABLE "mnt_reservation_inspection" DROP COLUMN "status",
ADD COLUMN     "id_status" UUID NOT NULL;

-- CreateTable
CREATE TABLE "mnt_customer_address" (
    "id" UUID NOT NULL,
    "label" VARCHAR(50) NOT NULL DEFAULT 'Principal',
    "address_line1" VARCHAR(255) NOT NULL,
    "address_line2" VARCHAR(255),
    "zip_code" VARCHAR(20),
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(0),
    "updated_at" TIMESTAMP(0),
    "deleted_at" TIMESTAMP(0),
    "id_customer" UUID NOT NULL,
    "id_geographic_division" UUID,

    CONSTRAINT "mnt_customer_address_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "mnt_customer_address_id_customer_idx" ON "mnt_customer_address"("id_customer");

-- CreateIndex
CREATE INDEX "mnt_customer_address_id_geographic_division_idx" ON "mnt_customer_address"("id_geographic_division");

-- CreateIndex
CREATE INDEX "mnt_customer_address_id_customer_is_primary_idx" ON "mnt_customer_address"("id_customer", "is_primary");

-- CreateIndex
CREATE INDEX "mnt_customer_id_country_idx" ON "mnt_customer"("id_country");

-- CreateIndex
CREATE INDEX "mnt_invoice_id_status_idx" ON "mnt_invoice"("id_status");

-- CreateIndex
CREATE INDEX "mnt_payment_id_status_idx" ON "mnt_payment"("id_status");

-- CreateIndex
CREATE INDEX "mnt_reservation_id_status_idx" ON "mnt_reservation"("id_status");

-- CreateIndex
CREATE INDEX "mnt_reservation_event_start_event_end_id_status_idx" ON "mnt_reservation"("event_start", "event_end", "id_status");

-- CreateIndex
CREATE INDEX "mnt_reservation_inspection_id_status_idx" ON "mnt_reservation_inspection"("id_status");

-- AddForeignKey
ALTER TABLE "mnt_customer" ADD CONSTRAINT "mnt_customer_id_country_fkey" FOREIGN KEY ("id_country") REFERENCES "ctl_country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mnt_customer_address" ADD CONSTRAINT "mnt_customer_address_id_customer_fkey" FOREIGN KEY ("id_customer") REFERENCES "mnt_customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mnt_customer_address" ADD CONSTRAINT "mnt_customer_address_id_geographic_division_fkey" FOREIGN KEY ("id_geographic_division") REFERENCES "ctl_geographic_division"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mnt_reservation" ADD CONSTRAINT "mnt_reservation_id_status_fkey" FOREIGN KEY ("id_status") REFERENCES "ctl_status"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mnt_payment" ADD CONSTRAINT "mnt_payment_id_payment_method_fkey" FOREIGN KEY ("id_payment_method") REFERENCES "ctl_payment_method"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mnt_payment" ADD CONSTRAINT "mnt_payment_id_reservation_fkey" FOREIGN KEY ("id_reservation") REFERENCES "mnt_reservation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mnt_payment" ADD CONSTRAINT "mnt_payment_id_status_fkey" FOREIGN KEY ("id_status") REFERENCES "ctl_status"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mnt_reservation_inspection" ADD CONSTRAINT "mnt_reservation_inspection_id_status_fkey" FOREIGN KEY ("id_status") REFERENCES "ctl_status"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mnt_invoice" ADD CONSTRAINT "mnt_invoice_id_status_fkey" FOREIGN KEY ("id_status") REFERENCES "ctl_status"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
