import { IsString } from 'class-validator';

export class GetOneByEmailPersonDto {
  @IsString()
  email!: string;
}
