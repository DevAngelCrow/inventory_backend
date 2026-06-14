import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GeographicDivisionType } from '@/modules/catalogs/domain/entities/geographic-division-type';
import { GeographicDivisionTypeRepository } from '@/modules/catalogs/domain/repositories/geographic-division-type-repository';
import { NotFoundException } from '@/shared/domain/exceptions/not-found.exception';
import { GeographicDivisionTypeQueriesRepository } from '../../../repositories/geographic-division-type-read.repository';
import { UpdateGeographicDivisionTypeCommand } from './update-geographic-division-type.command';

@CommandHandler(UpdateGeographicDivisionTypeCommand)
export class UpdateGeographicDivisionTypeHandler implements ICommandHandler<UpdateGeographicDivisionTypeCommand> {
  constructor(
    private readonly repository: GeographicDivisionTypeRepository,
    private readonly readRepository: GeographicDivisionTypeQueriesRepository,
  ) {}

  async execute(command: UpdateGeographicDivisionTypeCommand): Promise<void> {
    const entity = GeographicDivisionType.create({ ...command.dto });
    const id = entity.getId();
    if (!id) throw new Error('GeographicDivisionType id is undefined');

    const found = await this.readRepository.getOneById(id.value());
    if (!found)
      throw new NotFoundException('GeographicDivisionType', id.value());

    await this.repository.update(entity);
  }
}
