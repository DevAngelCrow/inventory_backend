import { RouteDto } from '../../../dtos/route.dto';

export class UpdateRouteCommand {
  constructor(public readonly route_dto: RouteDto & { id: string }) {}
}
