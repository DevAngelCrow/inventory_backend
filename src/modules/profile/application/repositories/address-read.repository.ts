import { Pagination } from '@/shared/domain/value-object/pagination';
import { PaginationParams } from '@/shared/domain/value-object/pagination-params';
import { Address } from '../../domain/entities/address';
import { AddressId } from '../../domain/value-objects/address-value-object/address-id';

export abstract class AddressReadRepository {
  abstract getAll(
    pagination_params?: PaginationParams,
    filter?: string,
  ): Promise<Pagination<Address> | Address[]>;
  abstract getOneById(id: AddressId): Promise<Address | null>;
}
