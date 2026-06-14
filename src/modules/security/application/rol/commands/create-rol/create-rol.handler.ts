import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RolRepository } from '@/modules/security/domain/repositories/rol-repository';
import { CreateRolCommand } from './create-rol.command';
import { Rol } from '@/modules/security/domain/entities/rol';

@CommandHandler(CreateRolCommand)
export class CreateRolHandler implements ICommandHandler<CreateRolCommand> {
  constructor(private readonly repository: RolRepository) {}

  async execute(command: CreateRolCommand): Promise<void> {
    const rol = Rol.create({
      ...command.rol_dto,
      id_permissions: command.rol_dto.permissions_id,
    });
    await this.repository.create(rol);
  }
}
