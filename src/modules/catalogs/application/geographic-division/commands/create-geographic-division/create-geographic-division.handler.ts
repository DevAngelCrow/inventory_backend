import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GeographicDivision } from '@/modules/catalogs/domain/entities/geographic-division';
import { GeographicDivisionRepository } from '@/modules/catalogs/domain/repositories/geographic-division-repository';
import { CreateGeographicDivisionCommand } from './create-geographic-division.command';

@CommandHandler(CreateGeographicDivisionCommand)
export class CreateGeographicDivisionHandler implements ICommandHandler<CreateGeographicDivisionCommand> {
  constructor(private readonly repository: GeographicDivisionRepository) {}

  async execute(command: CreateGeographicDivisionCommand): Promise<void> {
    const entity = GeographicDivision.create({ ...command.dto });
    await this.repository.create(entity);
  }
}
