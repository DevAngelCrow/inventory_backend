import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdateMaritalStatusDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @ApiProperty({ example: 'Married' })
  name!: string;
  @IsString()
  @MaxLength(255)
  @ApiProperty({ example: 'Indicates if the person is married' })
  description!: string;
}
