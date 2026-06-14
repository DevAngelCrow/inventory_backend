import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class RouteRequestDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  @ApiProperty({ example: 'Dashboard' })
  name!: string;
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @ApiProperty({ example: 'Main dashboard route' })
  description!: string;
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  @ApiProperty({ example: 'dashboard-icon' })
  icon!: string;
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  @ApiProperty({ example: '/dashboard' })
  uri!: string;
  @IsBoolean()
  @ApiProperty({ example: true })
  active!: boolean;
  @IsBoolean()
  @ApiProperty({ example: true })
  show!: boolean;
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: 1 })
  order!: number;
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  @ApiProperty({ example: 'Dashboard Title' })
  title!: string;
  @IsBoolean()
  @ApiProperty({ example: true })
  required_auth!: boolean;
  @IsArray()
  @ApiProperty({
    example: [1, 2, 3],
    description: 'Array of permission IDs to assign to the role',
  })
  permissions_id?: string[];
  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '00000000-0000-0000-0000-000000000000',
    description: 'Parent route ID (0 for top-level routes)',
  })
  id_parent!: string | null;
  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    example: false,
  })
  child_route?: boolean;
}
