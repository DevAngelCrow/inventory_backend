import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class PersonDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  @ApiProperty({ example: 'John' })
  first_name!: string;
  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({ example: '1990-01-01' })
  birthdate!: Date;
  @IsUUID(4)
  @IsNotEmpty()
  @ApiProperty({ example: 1 })
  id_gender!: string;
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(150)
  @ApiProperty({ example: 'john.doe@example.com' })
  email!: string;
  @IsUUID(4)
  @IsNotEmpty()
  @ApiProperty({ example: 2 })
  id_marital_status!: string;
  @IsString()
  @IsNotEmpty()
  @MaxLength(14)
  @ApiProperty({ example: '2222-2222' })
  phone!: string;
  @IsUUID(4)
  @IsNotEmpty()
  @ApiProperty({ example: 1 })
  id_status!: string;
  @IsString()
  @IsOptional()
  @MaxLength(150)
  @ApiProperty({ example: 'Michael', required: false })
  middle_name!: string;
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  @ApiProperty({ example: 'Doe' })
  last_name!: string;
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @ApiProperty({ example: 'http://example.com/image.jpg' })
  img_path!: string;
  @IsArray()
  @IsOptional()
  @ApiProperty({ example: ['uuid1', 'uuid2'], required: false })
  nationalities: string[] = [];
}
