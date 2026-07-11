import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsUUID,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsArray,
  MaxLength,
  MinLength,
  Matches,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class RegisterValidatorDto {
  // Person data
  @IsString()
  @IsOptional()
  @MaxLength(150)
  @ApiProperty({ example: 'first name', required: false })
  first_name?: string;

  @IsString()
  @IsOptional()
  @MaxLength(150)
  @ApiProperty({ example: 'middle name', required: false })
  middle_name?: string;

  @IsString()
  @IsOptional()
  @MaxLength(150)
  @ApiProperty({ example: 'last name', required: false })
  last_name?: string;

  @IsDateString()
  @IsOptional()
  @ApiProperty({ example: '1990-01-01', required: false })
  birthdate?: Date;

  @IsUUID(4)
  @IsOptional()
  @ApiProperty({ example: 'uuid', required: false })
  id_gender?: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(150)
  @ApiProperty({ example: 'example@example.com' })
  email!: string;

  @IsUUID(4)
  @IsOptional()
  @ApiProperty({ example: 'uuid', required: false })
  id_marital_status?: string;

  @IsString()
  @IsOptional()
  @MaxLength(14)
  @ApiProperty({ example: '2222-2222', required: false })
  phone?: string;

  @Transform(({ value }: { value: unknown }) => {
    if (value === undefined || value === null || value === '') return undefined;
    return Array.isArray(value) ? value : [value];
  })
  @IsArray()
  @IsOptional()
  @ApiProperty({ example: ['uuid1', 'uuid2'], required: false })
  nationalities?: string[];

  // User data
  // @IsString()
  // @IsNotEmpty()
  // @MaxLength(150)
  // @ApiProperty({ example: 'user name' })
  // user_name!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(150)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, {
    message:
      'Password must include at least one uppercase letter, one lowercase letter, one number and one special character',
  })
  @ApiProperty({ example: 'P@ssword1' })
  password!: string;

  // @IsUUID(4)
  // @IsOptional()
  // @ApiProperty({ example: 1 })
  // id_status_user?: string;

  // @Type(() => Date)
  // @IsDate()
  // @IsOptional()
  // @ApiProperty({ example: '2024-01-01T00:00:00Z' })
  // last_access!: Date;

  // @Type(() => Boolean)
  // @IsBoolean()
  // @IsOptional()
  // @ApiProperty({ example: true })
  // is_validated?: boolean;

  // Address data
  // @IsString()
  // @IsNotEmpty()
  // @MaxLength(150)
  // @ApiProperty({ example: 'Main St' })
  // street!: string;

  // @IsString()
  // @MaxLength(150)
  // @IsNotEmpty()
  // @ApiProperty({ example: '123' })
  // street_number!: string;

  // @IsString()
  // @MaxLength(150)
  // @IsNotEmpty()
  // @ApiProperty({ example: 'Downtown' })
  // neighborhood!: string;

  // @IsUUID(4)
  // @IsNotEmpty()
  // @ApiProperty({ example: '00000' })
  // id_geographic_division!: string;

  // @IsString()
  // @MaxLength(150)
  // @IsNotEmpty()
  // @ApiProperty({ example: '456' })
  // house_number!: string;

  // @IsString()
  // @MaxLength(150)
  // @IsNotEmpty()
  // @ApiProperty({ example: 'Apt 7B' })
  // block!: string;

  // @IsString()
  // @MaxLength(150)
  // @IsNotEmpty()
  // @ApiProperty({ example: 'Near the park' })
  // pathway!: string;

  // @Type(() => Boolean)
  // @IsBoolean()
  // @IsOptional()
  // @ApiProperty({ example: true, required: false })
  // current?: boolean;

  // Document data
  // @IsUUID(4)
  // @IsNotEmpty()
  // @ApiProperty({ example: 1 })
  // id_type_document!: string;

  // @IsString()
  // @IsNotEmpty()
  // @MaxLength(255)
  // @ApiProperty({ example: 'A12345678' })
  // document_number!: string;

  // @IsString()
  // @IsOptional()
  // @MaxLength(150)
  // @ApiProperty({ example: 'Description about the document', required: false })
  // description?: string;

  // @Type(() => Boolean)
  // @IsBoolean()
  // @IsOptional()
  // @ApiProperty({ example: true })
  // active?: boolean;

  // @Allow()
  // @ApiProperty({ type: 'string', format: 'binary', required: false })
  // file_img?: BinaryType;
}
