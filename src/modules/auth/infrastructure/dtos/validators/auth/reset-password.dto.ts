import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  Matches,
} from 'class-validator';

export class ResetPasswordDto {
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

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Reset token received via email' })
  token!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Token identifier received via email' })
  id!: string;
}
