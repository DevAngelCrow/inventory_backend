import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsUUID,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsArray,
  Allow,
  MaxLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

/** Normalizes empty strings from multipart/form-data to undefined so @IsOptional skips them. */
const emptyToUndefined = (): PropertyDecorator =>
  Transform(({ value }: { value: unknown }) =>
    value === '' || value === null ? undefined : value,
  );

/**
 * Fields a user is allowed to send when updating their OWN profile.
 *
 * Intentionally absent (do NOT add without auth review):
 *   - id_people, id_user → derived server-side from the authenticated user
 *   - id_status          → admin-only (would let users self-promote/unblock)
 *   - is_validated       → admin/email-flow only (would bypass email verification)
 *   - last_access        → server-side timestamp only
 *   - img_path           → server sets it from the validated file upload
 *   - password           → use the dedicated password-change endpoint
 *   - active / active_address → admin-only soft-delete reactivation
 */
export class UpdateProfileValidatorDto {
  // People data
  @IsString()
  @IsOptional()
  @MaxLength(150)
  @ApiProperty({ example: 'John', required: false })
  first_name?: string;

  @IsString()
  @IsOptional()
  @MaxLength(150)
  @ApiProperty({ example: 'Doe', required: false })
  middle_name?: string;

  @IsString()
  @IsOptional()
  @MaxLength(150)
  @ApiProperty({ example: 'Smith', required: false })
  last_name?: string;

  @IsDateString()
  @IsOptional()
  @ApiProperty({ example: '1990-01-01', required: false })
  birthdate?: Date;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(150)
  @ApiProperty({ example: 'example@example.com' })
  email!: string;

  @emptyToUndefined()
  @IsUUID(4)
  @IsOptional()
  @ApiProperty({ example: 'uuid', required: false })
  id_gender?: string;

  @emptyToUndefined()
  @IsUUID(4)
  @IsOptional()
  @ApiProperty({ example: 'uuid', required: false })
  id_marital_status?: string;

  @IsString()
  @IsOptional()
  @MaxLength(15)
  @ApiProperty({ example: '1234567890', required: false })
  phone?: string;

  @Transform(({ value }: { value: unknown }) => {
    if (value === undefined || value === null || value === '') return undefined;
    return Array.isArray(value) ? value : [value];
  })
  @IsArray()
  @IsOptional()
  @ApiProperty({ example: ['uuid1', 'uuid2'], required: false })
  nationalities?: string[];

  @Allow()
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  file_img?: any;

  // User data
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  @ApiProperty({ example: 'username123' })
  user_name!: string;

  // Address data
  @IsString()
  @IsOptional()
  @MaxLength(150)
  @ApiProperty({ required: false })
  street?: string;

  @IsString()
  @IsOptional()
  @MaxLength(150)
  @ApiProperty({ required: false })
  street_number?: string;

  @IsString()
  @IsOptional()
  @MaxLength(150)
  @ApiProperty({ required: false })
  neighborhood?: string;

  @emptyToUndefined()
  @IsUUID(4)
  @IsOptional()
  @ApiProperty({ required: false })
  id_geographic_division?: string;

  @IsString()
  @IsOptional()
  @MaxLength(150)
  @ApiProperty({ required: false })
  house_number?: string;

  @IsString()
  @IsOptional()
  @MaxLength(150)
  @ApiProperty({ required: false })
  block?: string;

  @IsString()
  @IsOptional()
  @MaxLength(150)
  @ApiProperty({ required: false })
  pathway?: string;

  @Allow()
  @IsOptional()
  @ApiProperty({ example: 'true', required: false })
  current?: string | boolean;

  @emptyToUndefined()
  @IsUUID(4)
  @IsOptional()
  @ApiProperty({ example: 'uuid', required: false })
  id_address?: string;

  // Document data
  @emptyToUndefined()
  @IsUUID(4)
  @IsOptional()
  @ApiProperty({ required: false })
  id_type_document?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  @ApiProperty({ required: false })
  document_number?: string;

  @emptyToUndefined()
  @IsUUID(4)
  @IsOptional()
  @ApiProperty({ example: 'uuid', required: false })
  id_document?: string;

  // Whitelisted read-only fields to prevent "property ... should not exist" validation errors.
  // These are safely ignored in the controller/service to prevent IDOR and privilege escalation.
  @Allow()
  @IsOptional()
  id_people?: string;

  @Allow()
  @IsOptional()
  id_status?: string;

  @Allow()
  @IsOptional()
  active_address?: string | boolean;

  @Allow()
  @IsOptional()
  active?: string | boolean;

  @Allow()
  @IsOptional()
  id_user?: string;

  @Allow()
  @IsOptional()
  id?: string;
}
