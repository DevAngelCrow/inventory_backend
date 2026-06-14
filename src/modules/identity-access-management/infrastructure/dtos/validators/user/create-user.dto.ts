import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateUserDto {
  @IsUUID(4)
  @IsNotEmpty()
  @ApiProperty({ example: 123 })
  id_people!: string;
  @IsString()
  @MaxLength(150)
  @IsNotEmpty()
  @ApiProperty({ example: 'johndoe' })
  user_name!: string;
  @IsString()
  @MaxLength(150)
  @IsNotEmpty()
  @ApiProperty({ example: 'securePassword123' })
  password!: string;
  @IsUUID(4)
  @IsNotEmpty()
  @ApiProperty({ example: 1 })
  id_status!: string;
  @IsUUID(4)
  @IsOptional()
  @ApiProperty({ example: 10, required: false })
  id?: string;
}
