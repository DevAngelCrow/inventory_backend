import { RegisterDto } from '../../dtos/register.dto';

export class RegisterCommand {
  constructor(public readonly register_dto: RegisterDto) {}
}
