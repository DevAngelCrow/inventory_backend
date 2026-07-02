-- CreateTable
CREATE TABLE "ctl_product_category" (
    "id" UUID NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "description" VARCHAR(255),
    "icon" VARCHAR(100),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(0),
    "updated_at" TIMESTAMP(0),
    "deleted_at" TIMESTAMP(0),

    CONSTRAINT "ctl_product_category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ctl_product_condition" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" VARCHAR(255),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(0),
    "updated_at" TIMESTAMP(0),
    "deleted_at" TIMESTAMP(0),

    CONSTRAINT "ctl_product_condition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ctl_currency" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "code" VARCHAR(3) NOT NULL,
    "symbol" VARCHAR(5) NOT NULL,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(0),
    "updated_at" TIMESTAMP(0),
    "deleted_at" TIMESTAMP(0),

    CONSTRAINT "ctl_currency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mnt_product" (
    "id" UUID NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "description" VARCHAR(500),
    "sku" VARCHAR(50) NOT NULL,
    "rental_price" DECIMAL(10,2) NOT NULL,
    "replacement_cost" DECIMAL(10,2),
    "total_stock" INTEGER NOT NULL,
    "min_stock_alert" INTEGER NOT NULL DEFAULT 0,
    "color" VARCHAR(50),
    "dimensions" VARCHAR(100),
    "weight_lbs" DECIMAL(8,2),
    "image_url" VARCHAR(500),
    "notes" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(0),
    "updated_at" TIMESTAMP(0),
    "deleted_at" TIMESTAMP(0),
    "id_category" UUID NOT NULL,

    CONSTRAINT "mnt_product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mnt_product_maintenance" (
    "id" UUID NOT NULL,
    "description" VARCHAR(500) NOT NULL,
    "cost" DECIMAL(10,2),
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "date_start" DATE NOT NULL,
    "date_end" DATE,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(0),
    "updated_at" TIMESTAMP(0),
    "id_product" UUID NOT NULL,

    CONSTRAINT "mnt_product_maintenance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mnt_customer" (
    "id" UUID NOT NULL,
    "first_name" VARCHAR(150) NOT NULL,
    "last_name" VARCHAR(150) NOT NULL,
    "email" VARCHAR(150),
    "phone" VARCHAR(20) NOT NULL,
    "phone_secondary" VARCHAR(20),
    "company_name" VARCHAR(200),
    "tax_id" VARCHAR(50),
    "address_line1" VARCHAR(255),
    "address_line2" VARCHAR(255),
    "city" VARCHAR(100),
    "state" VARCHAR(100),
    "zip_code" VARCHAR(20),
    "notes" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(0),
    "updated_at" TIMESTAMP(0),
    "deleted_at" TIMESTAMP(0),
    "id_user" UUID,

    CONSTRAINT "mnt_customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mnt_reservation" (
    "id" UUID NOT NULL,
    "reservation_number" VARCHAR(20) NOT NULL,
    "event_start" TIMESTAMPTZ(0) NOT NULL,
    "event_end" TIMESTAMPTZ(0) NOT NULL,
    "delivery_datetime" TIMESTAMPTZ(0),
    "pickup_datetime" TIMESTAMPTZ(0),
    "transit_time_minutes" INTEGER NOT NULL DEFAULT 0,
    "delivery_address" VARCHAR(500),
    "delivery_city" VARCHAR(100),
    "delivery_state" VARCHAR(100),
    "delivery_zip" VARCHAR(20),
    "delivery_notes" TEXT,
    "delivery_contact_name" VARCHAR(200),
    "delivery_contact_phone" VARCHAR(20),
    "event_type" VARCHAR(100),
    "venue_name" VARCHAR(200),
    "subtotal" DECIMAL(10,2) NOT NULL,
    "tax_rate" DECIMAL(5,4) NOT NULL DEFAULT 0,
    "tax_amount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "discount_amount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "discount_reason" VARCHAR(255),
    "delivery_fee" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "total" DECIMAL(10,2) NOT NULL,
    "deposit_amount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "balance_due" DECIMAL(10,2) NOT NULL,
    "notes" TEXT,
    "internal_notes" TEXT,
    "status" VARCHAR(30) NOT NULL,
    "created_at" TIMESTAMP(0),
    "updated_at" TIMESTAMP(0),
    "deleted_at" TIMESTAMP(0),
    "confirmed_at" TIMESTAMP(0),
    "cancelled_at" TIMESTAMP(0),
    "cancellation_reason" VARCHAR(500),
    "id_customer" UUID NOT NULL,
    "id_currency" UUID NOT NULL,
    "id_created_by" UUID,

    CONSTRAINT "mnt_reservation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mnt_reservation_item" (
    "id" UUID NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit_price" DECIMAL(10,2) NOT NULL,
    "subtotal" DECIMAL(10,2) NOT NULL,
    "notes" VARCHAR(255),
    "created_at" TIMESTAMP(0),
    "updated_at" TIMESTAMP(0),
    "id_reservation" UUID NOT NULL,
    "id_product" UUID NOT NULL,

    CONSTRAINT "mnt_reservation_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ctl_payment_method" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "code" VARCHAR(20) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(0),
    "updated_at" TIMESTAMP(0),
    "deleted_at" TIMESTAMP(0),

    CONSTRAINT "ctl_payment_method_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mnt_payment" (
    "id" UUID NOT NULL,
    "payment_number" VARCHAR(20) NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "payment_date" TIMESTAMPTZ(0) NOT NULL,
    "reference_number" VARCHAR(100),
    "notes" VARCHAR(500),
    "status" VARCHAR(20) NOT NULL,
    "gateway_provider" VARCHAR(50),
    "gateway_tx_id" VARCHAR(200),
    "gateway_response" JSONB,
    "created_at" TIMESTAMP(0),
    "updated_at" TIMESTAMP(0),
    "id_reservation" UUID NOT NULL,
    "id_payment_method" UUID NOT NULL,
    "id_received_by" UUID,

    CONSTRAINT "mnt_payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mnt_reservation_inspection" (
    "id" UUID NOT NULL,
    "inspection_date" TIMESTAMPTZ(0) NOT NULL,
    "general_notes" TEXT,
    "overall_condition" VARCHAR(50) NOT NULL,
    "total_charges" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "status" VARCHAR(20) NOT NULL,
    "created_at" TIMESTAMP(0),
    "updated_at" TIMESTAMP(0),
    "id_reservation" UUID NOT NULL,
    "id_inspected_by" UUID,

    CONSTRAINT "mnt_reservation_inspection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mnt_damage_item" (
    "id" UUID NOT NULL,
    "damage_type" VARCHAR(50) NOT NULL,
    "description" VARCHAR(500) NOT NULL,
    "quantity_affected" INTEGER NOT NULL DEFAULT 1,
    "charge_amount" DECIMAL(10,2) NOT NULL,
    "photo_url" VARCHAR(500),
    "created_at" TIMESTAMP(0),
    "id_inspection" UUID NOT NULL,
    "id_product" UUID NOT NULL,

    CONSTRAINT "mnt_damage_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mnt_invoice" (
    "id" UUID NOT NULL,
    "invoice_number" VARCHAR(20) NOT NULL,
    "issue_date" DATE NOT NULL,
    "due_date" DATE,
    "subtotal" DECIMAL(10,2) NOT NULL,
    "tax_rate" DECIMAL(5,4) NOT NULL,
    "tax_amount" DECIMAL(10,2) NOT NULL,
    "discount_amount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "delivery_fee" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "damage_charges" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "total" DECIMAL(10,2) NOT NULL,
    "status" VARCHAR(20) NOT NULL,
    "notes" TEXT,
    "fiscal_provider" VARCHAR(50),
    "fiscal_id" VARCHAR(100),
    "fiscal_status" VARCHAR(50),
    "fiscal_response" JSONB,
    "pdf_path" VARCHAR(500),
    "created_at" TIMESTAMP(0),
    "updated_at" TIMESTAMP(0),
    "id_reservation" UUID NOT NULL,
    "id_customer" UUID NOT NULL,
    "id_currency" UUID NOT NULL,
    "id_created_by" UUID,

    CONSTRAINT "mnt_invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mnt_invoice_line" (
    "id" UUID NOT NULL,
    "description" VARCHAR(300) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit_price" DECIMAL(10,2) NOT NULL,
    "subtotal" DECIMAL(10,2) NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "id_invoice" UUID NOT NULL,
    "id_product" UUID,

    CONSTRAINT "mnt_invoice_line_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ctl_product_category_name_key" ON "ctl_product_category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ctl_product_condition_name_key" ON "ctl_product_condition"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ctl_currency_name_key" ON "ctl_currency"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ctl_currency_code_key" ON "ctl_currency"("code");

-- CreateIndex
CREATE UNIQUE INDEX "mnt_product_sku_key" ON "mnt_product"("sku");

-- CreateIndex
CREATE INDEX "mnt_product_id_category_idx" ON "mnt_product"("id_category");

-- CreateIndex
CREATE INDEX "mnt_product_sku_idx" ON "mnt_product"("sku");

-- CreateIndex
CREATE INDEX "mnt_product_active_idx" ON "mnt_product"("active");

-- CreateIndex
CREATE INDEX "mnt_product_maintenance_id_product_idx" ON "mnt_product_maintenance"("id_product");

-- CreateIndex
CREATE INDEX "mnt_product_maintenance_resolved_idx" ON "mnt_product_maintenance"("resolved");

-- CreateIndex
CREATE INDEX "mnt_product_maintenance_id_product_resolved_idx" ON "mnt_product_maintenance"("id_product", "resolved");

-- CreateIndex
CREATE UNIQUE INDEX "mnt_customer_id_user_key" ON "mnt_customer"("id_user");

-- CreateIndex
CREATE INDEX "mnt_customer_phone_idx" ON "mnt_customer"("phone");

-- CreateIndex
CREATE INDEX "mnt_customer_email_idx" ON "mnt_customer"("email");

-- CreateIndex
CREATE INDEX "mnt_customer_last_name_idx" ON "mnt_customer"("last_name");

-- CreateIndex
CREATE INDEX "mnt_customer_active_idx" ON "mnt_customer"("active");

-- CreateIndex
CREATE UNIQUE INDEX "mnt_reservation_reservation_number_key" ON "mnt_reservation"("reservation_number");

-- CreateIndex
CREATE INDEX "mnt_reservation_id_customer_idx" ON "mnt_reservation"("id_customer");

-- CreateIndex
CREATE INDEX "mnt_reservation_event_start_idx" ON "mnt_reservation"("event_start");

-- CreateIndex
CREATE INDEX "mnt_reservation_event_end_idx" ON "mnt_reservation"("event_end");

-- CreateIndex
CREATE INDEX "mnt_reservation_status_idx" ON "mnt_reservation"("status");

-- CreateIndex
CREATE INDEX "mnt_reservation_reservation_number_idx" ON "mnt_reservation"("reservation_number");

-- CreateIndex
CREATE INDEX "mnt_reservation_event_start_event_end_status_idx" ON "mnt_reservation"("event_start", "event_end", "status");

-- CreateIndex
CREATE INDEX "mnt_reservation_delivery_datetime_idx" ON "mnt_reservation"("delivery_datetime");

-- CreateIndex
CREATE INDEX "mnt_reservation_pickup_datetime_idx" ON "mnt_reservation"("pickup_datetime");

-- CreateIndex
CREATE INDEX "mnt_reservation_item_id_reservation_idx" ON "mnt_reservation_item"("id_reservation");

-- CreateIndex
CREATE INDEX "mnt_reservation_item_id_product_idx" ON "mnt_reservation_item"("id_product");

-- CreateIndex
CREATE UNIQUE INDEX "mnt_reservation_item_id_reservation_id_product_key" ON "mnt_reservation_item"("id_reservation", "id_product");

-- CreateIndex
CREATE UNIQUE INDEX "ctl_payment_method_name_key" ON "ctl_payment_method"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ctl_payment_method_code_key" ON "ctl_payment_method"("code");

-- CreateIndex
CREATE UNIQUE INDEX "mnt_payment_payment_number_key" ON "mnt_payment"("payment_number");

-- CreateIndex
CREATE INDEX "mnt_payment_id_reservation_idx" ON "mnt_payment"("id_reservation");

-- CreateIndex
CREATE INDEX "mnt_payment_payment_date_idx" ON "mnt_payment"("payment_date");

-- CreateIndex
CREATE INDEX "mnt_payment_status_idx" ON "mnt_payment"("status");

-- CreateIndex
CREATE INDEX "mnt_reservation_inspection_id_reservation_idx" ON "mnt_reservation_inspection"("id_reservation");

-- CreateIndex
CREATE INDEX "mnt_reservation_inspection_status_idx" ON "mnt_reservation_inspection"("status");

-- CreateIndex
CREATE INDEX "mnt_damage_item_id_inspection_idx" ON "mnt_damage_item"("id_inspection");

-- CreateIndex
CREATE INDEX "mnt_damage_item_id_product_idx" ON "mnt_damage_item"("id_product");

-- CreateIndex
CREATE UNIQUE INDEX "mnt_invoice_invoice_number_key" ON "mnt_invoice"("invoice_number");

-- CreateIndex
CREATE UNIQUE INDEX "mnt_invoice_id_reservation_key" ON "mnt_invoice"("id_reservation");

-- CreateIndex
CREATE INDEX "mnt_invoice_invoice_number_idx" ON "mnt_invoice"("invoice_number");

-- CreateIndex
CREATE INDEX "mnt_invoice_id_reservation_idx" ON "mnt_invoice"("id_reservation");

-- CreateIndex
CREATE INDEX "mnt_invoice_id_customer_idx" ON "mnt_invoice"("id_customer");

-- CreateIndex
CREATE INDEX "mnt_invoice_issue_date_idx" ON "mnt_invoice"("issue_date");

-- CreateIndex
CREATE INDEX "mnt_invoice_status_idx" ON "mnt_invoice"("status");

-- CreateIndex
CREATE INDEX "mnt_invoice_line_id_invoice_idx" ON "mnt_invoice_line"("id_invoice");

-- AddForeignKey
ALTER TABLE "mnt_product" ADD CONSTRAINT "mnt_product_id_category_fkey" FOREIGN KEY ("id_category") REFERENCES "ctl_product_category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mnt_product_maintenance" ADD CONSTRAINT "mnt_product_maintenance_id_product_fkey" FOREIGN KEY ("id_product") REFERENCES "mnt_product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mnt_reservation" ADD CONSTRAINT "mnt_reservation_id_customer_fkey" FOREIGN KEY ("id_customer") REFERENCES "mnt_customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mnt_reservation" ADD CONSTRAINT "mnt_reservation_id_currency_fkey" FOREIGN KEY ("id_currency") REFERENCES "ctl_currency"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mnt_reservation_item" ADD CONSTRAINT "mnt_reservation_item_id_reservation_fkey" FOREIGN KEY ("id_reservation") REFERENCES "mnt_reservation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mnt_reservation_item" ADD CONSTRAINT "mnt_reservation_item_id_product_fkey" FOREIGN KEY ("id_product") REFERENCES "mnt_product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mnt_payment" ADD CONSTRAINT "mnt_payment_id_reservation_fkey" FOREIGN KEY ("id_reservation") REFERENCES "mnt_reservation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mnt_payment" ADD CONSTRAINT "mnt_payment_id_payment_method_fkey" FOREIGN KEY ("id_payment_method") REFERENCES "ctl_payment_method"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mnt_reservation_inspection" ADD CONSTRAINT "mnt_reservation_inspection_id_reservation_fkey" FOREIGN KEY ("id_reservation") REFERENCES "mnt_reservation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mnt_damage_item" ADD CONSTRAINT "mnt_damage_item_id_inspection_fkey" FOREIGN KEY ("id_inspection") REFERENCES "mnt_reservation_inspection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mnt_invoice" ADD CONSTRAINT "mnt_invoice_id_customer_fkey" FOREIGN KEY ("id_customer") REFERENCES "mnt_customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mnt_invoice" ADD CONSTRAINT "mnt_invoice_id_currency_fkey" FOREIGN KEY ("id_currency") REFERENCES "ctl_currency"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mnt_invoice_line" ADD CONSTRAINT "mnt_invoice_line_id_invoice_fkey" FOREIGN KEY ("id_invoice") REFERENCES "mnt_invoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;
