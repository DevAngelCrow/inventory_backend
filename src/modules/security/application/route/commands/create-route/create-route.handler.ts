import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RouteRepository } from '@/modules/security/domain/repositories/route-repository';
import { CreateRouteCommand } from './create-route.command';
import { Route } from '@/modules/security/domain/entities/route';

@CommandHandler(CreateRouteCommand)
export class CreateRouteHandler implements ICommandHandler<CreateRouteCommand> {
  constructor(private readonly repository: RouteRepository) {}

  async execute(command: CreateRouteCommand): Promise<void> {
    const route = Route.create({ ...command.route_dto });
    await this.repository.create(route);
  }
}
