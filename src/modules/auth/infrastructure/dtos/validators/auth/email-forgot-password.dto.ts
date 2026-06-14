import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class EmailForgotPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'jhon_doe@mail.com' })
  email!: string;
}
