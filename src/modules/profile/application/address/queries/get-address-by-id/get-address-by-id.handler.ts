import { AddressId } from '@/modules/profile/domain/value-objects/address-value-object/address-id';
import { GetAddressByIdQuery } from './get-address-by-id.query';
import { AddressReadRepository } from '../../../repositories/address-read.repository';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

@QueryHandler(GetAddressByIdQuery)
export class GetAddressByIdHandler implements IQueryHandler<GetAddressByIdQuery> {
  constructor(private readonly repository: AddressReadRepository) {}
  async execute(query: GetAddressByIdQuery) {
    return await this.repository.getOneById(new AddressId(query.id));
  }
}
