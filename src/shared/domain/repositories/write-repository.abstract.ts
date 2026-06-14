/**
 * Base abstract class for write repositories.
 *
 * Provides a common contract for creating and updating domain entities.
 * Specific repositories may add extra mutation methods (e.g. `delete`,
 * `toggleStatus`, `softDelete`) alongside these base operations.
 *
 * Extend this class in every domain-layer write repository to reduce
 * boilerplate and keep mutation signatures consistent across all modules.
 *
 * @template TEntity  - Domain entity managed by the repository.
 *
 * @example
 * export abstract class PersonRepository
 *   extends WriteRepository<Person> { ... }
 */
export abstract class WriteRepository<TEntity> {
  abstract create(entity: TEntity): Promise<TEntity | void>;
  abstract update(entity: TEntity): Promise<void>;
}
