import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty } from 'class-validator';

export class UserRolRequestDto {
  @IsArray()
  @IsNotEmpty()
  @ApiProperty({ example: [1, 2, 3] })
  id_role!: string[];
}
