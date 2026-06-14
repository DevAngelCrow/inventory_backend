import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetRouteByIdQuery } from './get-route-by-id.query';
import { RouteReadRepository } from '../../../repositories/route-read.repository';

@QueryHandler(GetRouteByIdQuery)
export class GetRouteByIdHandler implements IQueryHandler<GetRouteByIdQuery> {
  constructor(private readonly repository: RouteReadRepository) {}

  async execute(query: GetRouteByIdQuery) {
    return await this.repository.getById(query.id);
  }
}
