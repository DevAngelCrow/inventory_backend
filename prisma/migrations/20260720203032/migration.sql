-- DropIndex
DROP INDEX "mnt_invoice_id_reservation_key";

-- AddForeignKey
ALTER TABLE "mnt_invoice" ADD CONSTRAINT "mnt_invoice_id_reservation_fkey" FOREIGN KEY ("id_reservation") REFERENCES "mnt_reservation"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
