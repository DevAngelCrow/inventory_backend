import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateMaritalStatusDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @ApiProperty({ example: 'Single' })
  name!: string;
  @IsString()
  @MaxLength(255)
  @ApiProperty({ example: 'Indicates if the person is single' })
  description!: string;
}
