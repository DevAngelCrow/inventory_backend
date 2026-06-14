import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class MenuRequestDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Main Menu' })
  name!: string;
  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Description of the main menu' })
  description!: string;
  @IsBoolean()
  @ApiProperty({ example: true })
  active!: boolean;
}
