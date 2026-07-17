/*
  Warnings:

  - You are about to drop the column `dimensions` on the `mnt_product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "mnt_product" DROP COLUMN "dimensions",
ADD COLUMN     "dimension_depth" DECIMAL(10,2),
ADD COLUMN     "dimension_height" DECIMAL(10,2),
ADD COLUMN     "dimension_width" DECIMAL(10,2),
ADD COLUMN     "id_measurement_unit" UUID;

-- CreateTable
CREATE TABLE "ctl_measurement_unit" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "abbreviation" VARCHAR(10) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(0),
    "updated_at" TIMESTAMP(0),
    "deleted_at" TIMESTAMP(0),

    CONSTRAINT "ctl_measurement_unit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ctl_measurement_unit_name_key" ON "ctl_measurement_unit"("name");

-- CreateIndex
CREATE INDEX "mnt_product_id_measurement_unit_idx" ON "mnt_product"("id_measurement_unit");

-- AddForeignKey
ALTER TABLE "mnt_product" ADD CONSTRAINT "mnt_product_id_measurement_unit_fkey" FOREIGN KEY ("id_measurement_unit") REFERENCES "ctl_measurement_unit"("id") ON DELETE SET NULL ON UPDATE CASCADE;
