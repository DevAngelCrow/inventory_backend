import { IsNotEmpty, IsString } from 'class-validator';

export class DocsAccessDto {
  @IsString()
  @IsNotEmpty()
  access_token!: string;
}
