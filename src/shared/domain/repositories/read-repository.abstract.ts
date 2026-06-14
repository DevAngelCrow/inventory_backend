import { PaginationParams } from '../value-object/pagination-params';
import { Pagination } from '../value-object/pagination';

/**
 * Base abstract class for read repositories.
 *
 * Provides a common contract for listing entities with optional pagination
 * and free-text filter, and for fetching a single entity by its ID.
 *
 * Extend this class in every application-layer read repository to reduce
 * boilerplate and make the fetch signature predictable across all modules.
 *
 * @template TEntity  - Domain entity or DTO returned by the repository.
 * @template TId      - Typed value object that represents the entity's ID.
 *
 * @example
 * export abstract class PersonReadRepository
 *   extends ReadRepository<Person, PersonId> { ... }
 */
export abstract class ReadRepository<TEntity, TId> {
  abstract getAll(
    pagination?: PaginationParams,
    filter?: string,
  ): Promise<Pagination<TEntity> | TEntity[]>;

  abstract getOneById(id: TId): Promise<TEntity | null>;
}
