import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class VerifyEmailQueryDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({ example: 'id' })
  id!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'token' })
  token!: string;
}
