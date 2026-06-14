import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GeographicDivisionRepository } from '@/modules/catalogs/domain/repositories/geographic-division-repository';
import { GeographicDivisionId } from '@/modules/catalogs/domain/value-objects/geographic-division-value-object/geographic-division-id';
import { NotFoundException } from '@/shared/domain/exceptions/not-found.exception';
import { GeographicDivisionQueriesRepository } from '../../../repositories/geographic-division-read.repository';
import { GeographicDivisionDto } from '../../../dtos/geographic-division.dto';
import { DeleteGeographicDivisionCommand } from './delete-geographic-division.command';

@CommandHandler(DeleteGeographicDivisionCommand)
export class DeleteGeographicDivisionHandler implements ICommandHandler<DeleteGeographicDivisionCommand> {
  constructor(
    private readonly repository: GeographicDivisionRepository,
    private readonly readRepository: GeographicDivisionQueriesRepository,
  ) {}

  async execute(
    command: DeleteGeographicDivisionCommand,
  ): Promise<GeographicDivisionDto> {
    const found = await this.readRepository.getOneById(command.id);
    if (!found) throw new NotFoundException('GeographicDivision', command.id);

    const entity = await this.repository.toggleStatus(
      new GeographicDivisionId(command.id),
    );
    return GeographicDivisionDto.fromEntity(entity);
  }
}
