import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GeographicDivisionType } from '@/modules/catalogs/domain/entities/geographic-division-type';
import { GeographicDivisionTypeRepository } from '@/modules/catalogs/domain/repositories/geographic-division-type-repository';
import { CreateGeographicDivisionTypeCommand } from './create-geographic-division-type.command';

@CommandHandler(CreateGeographicDivisionTypeCommand)
export class CreateGeographicDivisionTypeHandler implements ICommandHandler<CreateGeographicDivisionTypeCommand> {
  constructor(private readonly repository: GeographicDivisionTypeRepository) {}

  async execute(command: CreateGeographicDivisionTypeCommand): Promise<void> {
    const entity = GeographicDivisionType.create({ ...command.dto });
    await this.repository.create(entity);
  }
}
