import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GeographicDivisionTypeRepository } from '@/modules/catalogs/domain/repositories/geographic-division-type-repository';
import { GeographicDivisionTypeId } from '@/modules/catalogs/domain/value-objects/geographic-division-type-value-object/geographic-division-type-id';
import { NotFoundException } from '@/shared/domain/exceptions/not-found.exception';
import { GeographicDivisionTypeQueriesRepository } from '../../../repositories/geographic-division-type-read.repository';
import { GeographicDivisionTypeDto } from '../../../dtos/geographic-division-type.dto';
import { DeleteGeographicDivisionTypeCommand } from './delete-geographic-division-type.command';

@CommandHandler(DeleteGeographicDivisionTypeCommand)
export class DeleteGeographicDivisionTypeHandler implements ICommandHandler<DeleteGeographicDivisionTypeCommand> {
  constructor(
    private readonly repository: GeographicDivisionTypeRepository,
    private readonly readRepository: GeographicDivisionTypeQueriesRepository,
  ) {}

  async execute(
    command: DeleteGeographicDivisionTypeCommand,
  ): Promise<GeographicDivisionTypeDto> {
    const found = await this.readRepository.getOneById(command.id);
    if (!found)
      throw new NotFoundException('GeographicDivisionType', command.id);

    const entity = await this.repository.toggleStatus(
      new GeographicDivisionTypeId(command.id),
    );
    return GeographicDivisionTypeDto.fromEntity(entity);
  }
}
