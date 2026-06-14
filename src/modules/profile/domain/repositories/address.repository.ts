import { Pagination } from '@/shared/domain/value-object/pagination';
import { Address } from '../entities/address';
import { AddressId } from '../value-objects/address-value-object/address-id';
import { PaginationParams } from '@/shared/domain/value-object/pagination-params';

export abstract class AddressRepository {
  abstract create(address: Address): Promise<Address>;
  abstract update(address: Address): Promise<void>;
  abstract getAll(
    pagination_params?: PaginationParams,
    filter?: string,
  ): Promise<Pagination<Address> | Address[]>;
  abstract getOneById(id: AddressId): Promise<Address | null>;
  abstract delete(id: AddressId): Promise<void>;
}
