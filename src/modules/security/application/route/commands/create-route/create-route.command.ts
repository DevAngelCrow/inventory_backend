import { RouteDto } from '../../../dtos/route.dto';

export class CreateRouteCommand {
  constructor(public readonly route_dto: RouteDto) {}
}
