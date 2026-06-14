import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { PaginationParamsDto } from '@/shared/application/dtos/pagination.dto';

const DEFAULT_PAGE = 1;
const DEFAULT_PER_PAGE = 20;
const MAX_PER_PAGE = 100;

/**
 * Coerces `page` and `per_page` query params into a `PaginationParamsDto`,
 * applying defaults and a hard upper bound. Always returns a value (never
 * undefined) so list endpoints can't accidentally degrade to "return all rows".
 *
 * Usage:
 *   async getAll(
 *     @Query(new PaginationParamsPipe()) pagination: PaginationParamsDto,
 *   ) { ... }
 */
@Injectable()
export class PaginationParamsPipe implements PipeTransform<
  Record<string, unknown>,
  PaginationParamsDto
> {
  transform(value: Record<string, unknown>): PaginationParamsDto {
    const page = this.parsePositiveInt(value.page, DEFAULT_PAGE, 'page');
    const perPage = this.parsePositiveInt(
      value.per_page,
      DEFAULT_PER_PAGE,
      'per_page',
    );
    if (perPage > MAX_PER_PAGE) {
      throw new BadRequestException(
        `per_page cannot exceed ${MAX_PER_PAGE} (received ${perPage})`,
      );
    }
    return new PaginationParamsDto(page, perPage);
  }

  private parsePositiveInt(
    raw: unknown,
    fallback: number,
    name: string,
  ): number {
    if (raw === undefined || raw === null || raw === '') return fallback;
    const parsed = Number(raw);
    if (!Number.isInteger(parsed) || parsed < 1) {
      const rawDisplay =
        raw == null
          ? ''
          : typeof raw !== 'object'
            ? // eslint-disable-next-line @typescript-eslint/no-base-to-string
              String(raw)
            : JSON.stringify(raw);
      throw new BadRequestException(
        `${name} must be a positive integer (received ${rawDisplay})`,
      );
    }
    return parsed;
  }
}
