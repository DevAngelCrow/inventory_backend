-- CreateTable
CREATE TABLE "ctl_category_permissions" (
    "name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(0),
    "updated_at" TIMESTAMP(0),
    "deleted_at" TIMESTAMP(0),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "id" UUID NOT NULL,

    CONSTRAINT "ctl_category_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ctl_country" (
    "name" VARCHAR(150) NOT NULL,
    "iso2" VARCHAR(2) NOT NULL,
    "abbreviation" VARCHAR(150) NOT NULL,
    "code" VARCHAR(150) NOT NULL,
    "phone_code" VARCHAR(150) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(0),
    "updated_at" TIMESTAMP(0),
    "deleted_at" TIMESTAMP(0),
    "id" UUID NOT NULL,

    CONSTRAINT "ctl_country_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ctl_document_type" (
    "name" VARCHAR(150) NOT NULL,
    "description" VARCHAR(150) NOT NULL,
    "mask" VARCHAR(150) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(0),
    "updated_at" TIMESTAMP(0),
    "deleted_at" TIMESTAMP(0),
    "id" UUID NOT NULL,

    CONSTRAINT "ctl_document_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ctl_gender" (
    "name" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(0),
    "updated_at" TIMESTAMP(0),
    "deleted_at" TIMESTAMP(0),
    "id" UUID NOT NULL,

    CONSTRAINT "ctl_gender_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ctl_marital_status" (
    "name" VARCHAR(100) NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(0),
    "updated_at" TIMESTAMP(0),
    "deleted_at" TIMESTAMP(0),
    "id" UUID NOT NULL,

    CONSTRAINT "ctl_marital_status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ctl_permissions" (
    "name" VARCHAR(150) NOT NULL,
    "description" VARCHAR(150) NOT NULL,
    "created_at" TIMESTAMP(0),
    "updated_at" TIMESTAMP(0),
    "deleted_at" TIMESTAMP(0),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "id" UUID NOT NULL,
    "id_category_permissions" UUID NOT NULL,

    CONSTRAINT "ctl_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ctl_provider_storage" (
    "name" VARCHAR(150) NOT NULL,
    "code" VARCHAR(6) NOT NULL,
    "description" VARCHAR(150) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "deleted_at" TIMESTAMP(0),
    "created_at" TIMESTAMP(0),
    "updated_at" TIMESTAMP(0),
    "id" UUID NOT NULL,

    CONSTRAINT "ctl_provider_storage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ctl_status" (
    "code" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "deleted_at" TIMESTAMP(0),
    "created_at" TIMESTAMP(0),
    "updated_at" TIMESTAMP(0),
    "state_color" VARCHAR(10) NOT NULL DEFAULT '#9b9b9b',
    "text_color" VARCHAR(10) NOT NULL DEFAULT '#FFFFFF',
    "id" UUID NOT NULL,
    "id_category_status" UUID NOT NULL,

    CONSTRAINT "ctl_status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mnt_address" (
    "street" VARCHAR(150) NOT NULL,
    "street_number" VARCHAR(150) NOT NULL,
    "neighborhood" VARCHAR(150) NOT NULL,
    "house_number" VARCHAR(150) NOT NULL,
    "block" VARCHAR(150) NOT NULL,
    "pathway" VARCHAR(150) NOT NULL,
    "current" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(0),
    "updated_at" TIMESTAMP(0),
    "deleted_at" TIMESTAMP(0),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "id" UUID NOT NULL,
    "id_people" UUID NOT NULL,
    "id_geographic_division" UUID,

    CONSTRAINT "mnt_address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mnt_document" (
    "document_number" VARCHAR(255) NOT NULL,
    "description" VARCHAR(150),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(0),
    "updated_at" TIMESTAMP(0),
    "deleted_at" TIMESTAMP(0),
    "id" UUID NOT NULL,
    "id_document_type" UUID NOT NULL,
    "id_people" UUID NOT NULL,

    CONSTRAINT "mnt_document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mnt_people" (
    "first_name" VARCHAR(150),
    "middle_name" VARCHAR(150),
    "last_name" VARCHAR(150),
    "birthdate" DATE,
    "email" VARCHAR(150) NOT NULL,
    "img_path" VARCHAR(255),
    "phone" VARCHAR(14),
    "created_at" TIMESTAMP(0),
    "updated_at" TIMESTAMP(0),
    "deleted_at" TIMESTAMP(0),
    "id" UUID NOT NULL,
    "id_gender" UUID,
    "id_marital_status" UUID,
    "id_status" UUID NOT NULL,

    CONSTRAINT "mnt_people_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mnt_role" (
    "name" VARCHAR(150) NOT NULL,
    "description" VARCHAR(150) NOT NULL,
    "created_at" TIMESTAMP(0),
    "updated_at" TIMESTAMP(0),
    "deleted_at" TIMESTAMP(0),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "code" VARCHAR(15) NOT NULL,
    "id" UUID NOT NULL,
    "id_status" UUID NOT NULL,

    CONSTRAINT "mnt_role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mnt_route" (
    "name" VARCHAR(150) NOT NULL,
    "description" VARCHAR(255),
    "icon" VARCHAR(150) NOT NULL,
    "uri" VARCHAR(150) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "show" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER,
    "required_auth" BOOLEAN NOT NULL DEFAULT true,
    "title" VARCHAR(150) NOT NULL,
    "created_at" TIMESTAMP(0),
    "updated_at" TIMESTAMP(0),
    "deleted_at" TIMESTAMP(0),
    "id" UUID NOT NULL,
    "id_parent" UUID,

    CONSTRAINT "mnt_route_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mnt_route_permissions" (
    "created_at" TIMESTAMP(0),
    "updated_at" TIMESTAMP(0),
    "deleted_at" TIMESTAMP(0),
    "id" UUID NOT NULL,
    "id_permission" UUID NOT NULL,
    "id_route" UUID NOT NULL,

    CONSTRAINT "mnt_route_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mnt_storage_files" (
    "filename" VARCHAR(150) NOT NULL,
    "path" VARCHAR(500) NOT NULL,
    "size" BIGINT NOT NULL,
    "mime_type" VARCHAR(150) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "deleted_at" TIMESTAMP(0),
    "created_at" TIMESTAMP(0),
    "updated_at" TIMESTAMP(0),
    "id" UUID NOT NULL,
    "id_provider" UUID NOT NULL,
    "id_user" UUID,

    CONSTRAINT "mnt_storage_files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mnt_user" (
    "user_name" VARCHAR(150) NOT NULL,
    "password" VARCHAR(150) NOT NULL,
    "last_access" TIMESTAMPTZ(0) NOT NULL,
    "is_validated" BOOLEAN NOT NULL,
    "email_verified_at" TIMESTAMP(0),
    "created_at" TIMESTAMP(0),
    "updated_at" TIMESTAMP(0),
    "deleted_at" TIMESTAMP(0),
    "id" UUID NOT NULL,
    "id_people" UUID NOT NULL,
    "id_status" UUID NOT NULL,
    "login_attempts" INTEGER NOT NULL DEFAULT 0,
    "locked_until" TIMESTAMP(6),

    CONSTRAINT "mnt_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mnt_user_rol" (
    "created_at" TIMESTAMP(0),
    "updated_at" TIMESTAMP(0),
    "deleted_at" TIMESTAMP(0),
    "id" UUID NOT NULL,
    "id_role" UUID NOT NULL,
    "id_user" UUID NOT NULL,

    CONSTRAINT "mnt_user_rol_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "people_country" (
    "created_at" TIMESTAMP(0),
    "updated_at" TIMESTAMP(0),
    "deleted_at" TIMESTAMP(0),
    "id" UUID NOT NULL,
    "id_people" UUID NOT NULL,
    "id_country" UUID NOT NULL,

    CONSTRAINT "people_country_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rol_permissions" (
    "created_at" TIMESTAMP(0),
    "updated_at" TIMESTAMP(0),
    "deleted_at" TIMESTAMP(0),
    "id" UUID NOT NULL,
    "id_role" UUID NOT NULL,
    "id_permission" UUID NOT NULL,

    CONSTRAINT "rol_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mnt_email_verification_tokens" (
    "token" VARCHAR(255) NOT NULL,
    "used_at" TIMESTAMP(0),
    "expires_at" TIMESTAMP(0) NOT NULL,
    "created_at" TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP,
    "id" UUID NOT NULL,
    "id_user" UUID NOT NULL,
    "is_resset_password" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "mnt_email_verification_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ctl_category_status" (
    "name" VARCHAR(150) NOT NULL,
    "code" VARCHAR(10) NOT NULL,
    "description" VARCHAR(150) NOT NULL,
    "active" BOOLEAN NOT NULL,
    "id" UUID NOT NULL,

    CONSTRAINT "ctl_category_status_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mnt_session_refresh_token" (
    "refresh_token_hashed" VARCHAR NOT NULL,
    "revoked_at" TIMESTAMP(6),
    "expired_at" TIMESTAMP(6) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_used_at" TIMESTAMP(6),
    "id" UUID NOT NULL,
    "id_user" UUID NOT NULL,
    "device_name" VARCHAR(255),
    "user_agent" TEXT,
    "ip_address" VARCHAR(45),

    CONSTRAINT "mnt_session_refresh_token_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mnt_password_history" (
    "id" UUID NOT NULL,
    "id_user" UUID NOT NULL,
    "password_hash" VARCHAR(150) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mnt_password_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mnt_audit_log" (
    "id" UUID NOT NULL,
    "action" VARCHAR(100) NOT NULL,
    "user_name" VARCHAR(255),
    "user_id" UUID,
    "ip_address" VARCHAR(45),
    "user_agent" VARCHAR(512),
    "metadata" JSONB,
    "entity_type" VARCHAR(100),
    "entity_id" VARCHAR(255),
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mnt_audit_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ctl_geographic_division" (
    "id" UUID NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "description" VARCHAR(200),
    "id_parent" UUID,
    "id_country" UUID NOT NULL,
    "id_type" UUID NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "ctl_geographic_division_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ctl_geographic_division_type" (
    "id" UUID NOT NULL,
    "id_country" UUID NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "level" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "ctl_geographic_division_type_pk" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ctl_category_permissions_name_key" ON "ctl_category_permissions"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ctl_country_name_key" ON "ctl_country"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ctl_document_type_name_key" ON "ctl_document_type"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ctl_gender_name_key" ON "ctl_gender"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ctl_marital_status_name_key" ON "ctl_marital_status"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ctl_permissions_name_unique" ON "ctl_permissions"("name");

-- CreateIndex
CREATE INDEX "ctl_permissions_id_category_permissions_idx" ON "ctl_permissions"("id_category_permissions");

-- CreateIndex
CREATE UNIQUE INDEX "ctl_permissions_name_id_category_permissions_key" ON "ctl_permissions"("name", "id_category_permissions");

-- CreateIndex
CREATE UNIQUE INDEX "ctl_provider_storage_name_key" ON "ctl_provider_storage"("name");

-- CreateIndex
CREATE INDEX "ctl_status_id_category_status_idx" ON "ctl_status"("id_category_status");

-- CreateIndex
CREATE INDEX "ctl_status_code_idx" ON "ctl_status"("code");

-- CreateIndex
CREATE UNIQUE INDEX "ctl_status_code_category_unique" ON "ctl_status"("code", "id_category_status");

-- CreateIndex
CREATE INDEX "mnt_address_id_people_idx" ON "mnt_address"("id_people");

-- CreateIndex
CREATE INDEX "mnt_address_id_geographic_division_idx" ON "mnt_address"("id_geographic_division");

-- CreateIndex
CREATE INDEX "mnt_address_id_people_current_idx" ON "mnt_address"("id_people", "current");

-- CreateIndex
CREATE UNIQUE INDEX "mnt_document_document_number_key" ON "mnt_document"("document_number");

-- CreateIndex
CREATE INDEX "mnt_document_id_document_type_idx" ON "mnt_document"("id_document_type");

-- CreateIndex
CREATE INDEX "mnt_document_id_people_idx" ON "mnt_document"("id_people");

-- CreateIndex
CREATE UNIQUE INDEX "mnt_people_email_unique" ON "mnt_people"("email");

-- CreateIndex
CREATE INDEX "mnt_people_id_status_idx" ON "mnt_people"("id_status");

-- CreateIndex
CREATE INDEX "mnt_people_id_gender_idx" ON "mnt_people"("id_gender");

-- CreateIndex
CREATE INDEX "mnt_people_id_marital_status_idx" ON "mnt_people"("id_marital_status");

-- CreateIndex
CREATE INDEX "mnt_people_deleted_at_idx" ON "mnt_people"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "mnt_role_unique" ON "mnt_role"("code");

-- CreateIndex
CREATE INDEX "mnt_role_id_status_idx" ON "mnt_role"("id_status");

-- CreateIndex
CREATE INDEX "mnt_route_id_parent_idx" ON "mnt_route"("id_parent");

-- CreateIndex
CREATE INDEX "mnt_route_active_show_order_idx" ON "mnt_route"("active", "show", "order");

-- CreateIndex
CREATE INDEX "mnt_route_permissions_id_route_idx" ON "mnt_route_permissions"("id_route");

-- CreateIndex
CREATE INDEX "mnt_route_permissions_id_permission_idx" ON "mnt_route_permissions"("id_permission");

-- CreateIndex
CREATE UNIQUE INDEX "mnt_route_permissions_route_permission_unique" ON "mnt_route_permissions"("id_route", "id_permission");

-- CreateIndex
CREATE INDEX "mnt_storage_files_id_provider_idx" ON "mnt_storage_files"("id_provider");

-- CreateIndex
CREATE INDEX "mnt_storage_files_id_user_idx" ON "mnt_storage_files"("id_user");

-- CreateIndex
CREATE UNIQUE INDEX "mnt_user_id_people_unique" ON "mnt_user"("id_people");

-- CreateIndex
CREATE INDEX "mnt_user_id_status_idx" ON "mnt_user"("id_status");

-- CreateIndex
CREATE INDEX "mnt_user_user_name_idx" ON "mnt_user"("user_name");

-- CreateIndex
CREATE INDEX "mnt_user_deleted_at_idx" ON "mnt_user"("deleted_at");

-- CreateIndex
CREATE INDEX "mnt_user_rol_id_user_idx" ON "mnt_user_rol"("id_user");

-- CreateIndex
CREATE INDEX "mnt_user_rol_id_role_idx" ON "mnt_user_rol"("id_role");

-- CreateIndex
CREATE UNIQUE INDEX "mnt_user_rol_user_role_unique" ON "mnt_user_rol"("id_user", "id_role");

-- CreateIndex
CREATE INDEX "people_country_id_people_idx" ON "people_country"("id_people");

-- CreateIndex
CREATE INDEX "people_country_id_country_idx" ON "people_country"("id_country");

-- CreateIndex
CREATE UNIQUE INDEX "people_country_people_country_unique" ON "people_country"("id_people", "id_country");

-- CreateIndex
CREATE INDEX "rol_permissions_id_role_idx" ON "rol_permissions"("id_role");

-- CreateIndex
CREATE INDEX "rol_permissions_id_permission_idx" ON "rol_permissions"("id_permission");

-- CreateIndex
CREATE UNIQUE INDEX "rol_permissions_role_permission_unique" ON "rol_permissions"("id_role", "id_permission");

-- CreateIndex
CREATE UNIQUE INDEX "mnt_email_verification_tokens_token_key" ON "mnt_email_verification_tokens"("token");

-- CreateIndex
CREATE INDEX "mnt_email_verification_tokens_id_user_idx" ON "mnt_email_verification_tokens"("id_user");

-- CreateIndex
CREATE INDEX "mnt_email_verification_tokens_token_idx" ON "mnt_email_verification_tokens"("token");

-- CreateIndex
CREATE INDEX "mnt_email_verification_tokens_id_user_is_resset_password_us_idx" ON "mnt_email_verification_tokens"("id_user", "is_resset_password", "used_at");

-- CreateIndex
CREATE UNIQUE INDEX "ctl_category_status_name_idx" ON "ctl_category_status"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ctl_category_status_code_idx" ON "ctl_category_status"("code");

-- CreateIndex
CREATE INDEX "mnt_session_refresh_token_id_user_idx" ON "mnt_session_refresh_token"("id_user");

-- CreateIndex
CREATE INDEX "mnt_session_refresh_token_id_user_revoked_at_idx" ON "mnt_session_refresh_token"("id_user", "revoked_at");

-- CreateIndex
CREATE INDEX "mnt_session_refresh_token_expired_at_idx" ON "mnt_session_refresh_token"("expired_at");

-- CreateIndex
CREATE INDEX "mnt_password_history_id_user_idx" ON "mnt_password_history"("id_user");

-- CreateIndex
CREATE INDEX "mnt_password_history_id_user_created_at_idx" ON "mnt_password_history"("id_user", "created_at");

-- CreateIndex
CREATE INDEX "mnt_audit_log_action_idx" ON "mnt_audit_log"("action");

-- CreateIndex
CREATE INDEX "mnt_audit_log_user_id_idx" ON "mnt_audit_log"("user_id");

-- CreateIndex
CREATE INDEX "mnt_audit_log_created_at_idx" ON "mnt_audit_log"("created_at");

-- CreateIndex
CREATE INDEX "mnt_audit_log_entity_type_entity_id_idx" ON "mnt_audit_log"("entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "ctl_geographic_division_id_country_idx" ON "ctl_geographic_division"("id_country");

-- CreateIndex
CREATE INDEX "ctl_geographic_division_id_parent_idx" ON "ctl_geographic_division"("id_parent");

-- CreateIndex
CREATE INDEX "ctl_geographic_division_id_type_idx" ON "ctl_geographic_division"("id_type");

-- CreateIndex
CREATE INDEX "ctl_geographic_division_id_country_id_parent_idx" ON "ctl_geographic_division"("id_country", "id_parent");

-- CreateIndex
CREATE INDEX "ctl_geographic_division_id_country_id_type_idx" ON "ctl_geographic_division"("id_country", "id_type");

-- CreateIndex
CREATE INDEX "ctl_geographic_division_id_parent_id_country_idx" ON "ctl_geographic_division"("id_parent", "id_country");

-- CreateIndex
CREATE UNIQUE INDEX "ctl_geographic_division_name_id_parent_id_country_key" ON "ctl_geographic_division"("name", "id_parent", "id_country");

-- CreateIndex
CREATE INDEX "ctl_geographic_division_type_id_country_idx" ON "ctl_geographic_division_type"("id_country");

-- CreateIndex
CREATE UNIQUE INDEX "ctl_geographic_division_type_id_country_level_key" ON "ctl_geographic_division_type"("id_country", "level");

-- AddForeignKey
ALTER TABLE "ctl_permissions" ADD CONSTRAINT "ctl_permissions_id_category_permissions_foreign" FOREIGN KEY ("id_category_permissions") REFERENCES "ctl_category_permissions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ctl_status" ADD CONSTRAINT "ctl_status_ctl_category_status_fk" FOREIGN KEY ("id_category_status") REFERENCES "ctl_category_status"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mnt_address" ADD CONSTRAINT "mnt_address_ctl_geographic_division_fk" FOREIGN KEY ("id_geographic_division") REFERENCES "ctl_geographic_division"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mnt_address" ADD CONSTRAINT "mnt_address_id_people_foreign" FOREIGN KEY ("id_people") REFERENCES "mnt_people"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "mnt_document" ADD CONSTRAINT "mnt_document_id_document_type_foreign" FOREIGN KEY ("id_document_type") REFERENCES "ctl_document_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "mnt_document" ADD CONSTRAINT "mnt_document_id_people_foreign" FOREIGN KEY ("id_people") REFERENCES "mnt_people"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "mnt_people" ADD CONSTRAINT "mnt_people_id_gender_foreign" FOREIGN KEY ("id_gender") REFERENCES "ctl_gender"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "mnt_people" ADD CONSTRAINT "mnt_people_id_marital_status_foreign" FOREIGN KEY ("id_marital_status") REFERENCES "ctl_marital_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "mnt_people" ADD CONSTRAINT "mnt_people_id_status_foreign" FOREIGN KEY ("id_status") REFERENCES "ctl_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "mnt_role" ADD CONSTRAINT "mnt_role_id_status_foreign" FOREIGN KEY ("id_status") REFERENCES "ctl_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "mnt_route" ADD CONSTRAINT "mnt_route_id_parent_foreign" FOREIGN KEY ("id_parent") REFERENCES "mnt_route"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "mnt_route_permissions" ADD CONSTRAINT "mnt_route_permissions_id_permission_foreign" FOREIGN KEY ("id_permission") REFERENCES "ctl_permissions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "mnt_route_permissions" ADD CONSTRAINT "mnt_route_permissions_id_route_foreign" FOREIGN KEY ("id_route") REFERENCES "mnt_route"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "mnt_storage_files" ADD CONSTRAINT "mnt_storage_files_id_provider_foreign" FOREIGN KEY ("id_provider") REFERENCES "ctl_provider_storage"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "mnt_storage_files" ADD CONSTRAINT "mnt_storage_files_id_user_foreign" FOREIGN KEY ("id_user") REFERENCES "mnt_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "mnt_user" ADD CONSTRAINT "mnt_user_id_people_foreign" FOREIGN KEY ("id_people") REFERENCES "mnt_people"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "mnt_user" ADD CONSTRAINT "mnt_user_id_status_foreign" FOREIGN KEY ("id_status") REFERENCES "ctl_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "mnt_user_rol" ADD CONSTRAINT "mnt_user_rol_id_role_foreign" FOREIGN KEY ("id_role") REFERENCES "mnt_role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "mnt_user_rol" ADD CONSTRAINT "mnt_user_rol_id_user_foreign" FOREIGN KEY ("id_user") REFERENCES "mnt_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_country" ADD CONSTRAINT "people_country_id_country_foreign" FOREIGN KEY ("id_country") REFERENCES "ctl_country"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people_country" ADD CONSTRAINT "people_country_id_people_foreign" FOREIGN KEY ("id_people") REFERENCES "mnt_people"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "rol_permissions" ADD CONSTRAINT "rol_permissions_id_permission_foreign" FOREIGN KEY ("id_permission") REFERENCES "ctl_permissions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "rol_permissions" ADD CONSTRAINT "rol_permissions_id_role_foreign" FOREIGN KEY ("id_role") REFERENCES "mnt_role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "mnt_session_refresh_token" ADD CONSTRAINT "mnt_session_refresh_token_mnt_user_fk" FOREIGN KEY ("id_user") REFERENCES "mnt_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "mnt_password_history" ADD CONSTRAINT "mnt_password_history_id_user_fk" FOREIGN KEY ("id_user") REFERENCES "mnt_user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ctl_geographic_division" ADD CONSTRAINT "ctl_geographic_division_ctl_country_fk" FOREIGN KEY ("id_country") REFERENCES "ctl_country"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ctl_geographic_division" ADD CONSTRAINT "ctl_geographic_division_ctl_geographic_division_fk" FOREIGN KEY ("id_parent") REFERENCES "ctl_geographic_division"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ctl_geographic_division" ADD CONSTRAINT "ctl_geographic_division_ctl_geographic_division_type_fk" FOREIGN KEY ("id_type") REFERENCES "ctl_geographic_division_type"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ctl_geographic_division_type" ADD CONSTRAINT "ctl_geographic_division_type_ctl_country_fk" FOREIGN KEY ("id_country") REFERENCES "ctl_country"("id") ON DELETE CASCADE ON UPDATE CASCADE;
