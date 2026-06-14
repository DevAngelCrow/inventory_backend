import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RouteRepository } from '@/modules/security/domain/repositories/route-repository';
import { DeleteRouteCommand } from './delete-route.command';
import { RoutesId } from '@/modules/security/domain/value-objects/routes-value-object/routes-id';
import { RouteDto } from '../../../dtos/route.dto';

@CommandHandler(DeleteRouteCommand)
export class DeleteRouteHandler implements ICommandHandler<DeleteRouteCommand> {
  constructor(private readonly repository: RouteRepository) {}

  async execute(command: DeleteRouteCommand): Promise<RouteDto> {
    const routeEntity = await this.repository.toggleStatus(
      new RoutesId(command.id),
    );
    const routeDto = RouteDto.fromEntity(routeEntity);
    return routeDto;
  }
}
