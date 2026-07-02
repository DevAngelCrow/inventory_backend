import { GenderDto } from '@/modules/catalogs/application/dtos/gender.dto';
import { GenderQueriesRepository } from '@/modules/catalogs/application/repositories/gender-read.repository';
import { GenderId } from '@/modules/catalogs/domain/value-objects/gender-value-object/gender-id';
import { EntityList } from '@/shared/domain/value-object/entity-list';
import { Pagination } from '@/shared/domain/value-object/pagination';
import { PaginationParams } from '@/shared/domain/value-object/pagination-params';
import { TotalItems } from '@/shared/domain/value-object/total-items';
import { TotalPages } from '@/shared/domain/value-object/total-page';
import { DatabaseException } from '@/shared/infrastructure/exceptions/database.exception';
import { PrismaService } from '@/shared/infrastructure/persistence/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma, ctl_gender } from 'generated/prisma/client';

@Injectable()
export class ImplGenderRepository implements GenderQueriesRepository {
  private genders: GenderDto[] = [];
  constructor(private readonly prisma: PrismaService) {}
  async getAll(
    pagination_params?: PaginationParams,
    filter?: string,
  ): Promise<Pagination<GenderDto> | GenderDto[]> {
    try {
      const where = {
        name: {
          contains: filter,
          mode: Prisma.QueryMode.insensitive,
        },
      };
      const [gendersDb, total] = await Promise.all([
        this.prisma.client.ctl_gender.findMany({
          skip:
            pagination_params?.getPage().value() &&
            pagination_params?.getPerPage().value()
              ? (pagination_params.getPage().value() - 1) *
                pagination_params.getPerPage().value()
              : undefined,
          take: pagination_params?.getPerPage().value(),
          where,
          orderBy: {
            name: 'asc',
          },
        }),
        this.prisma.client.ctl_gender.count({ where }),
      ]);

      const genders = gendersDb.map((genderDb) =>
        this.mapReadModelToDto(genderDb),
      );

      this.genders = genders;

      if (!pagination_params) {
        return genders;
      }

      const entityList: EntityList<GenderDto> =
        genders.length > 0
          ? new EntityList<GenderDto>(genders)
          : new EntityList<GenderDto>([]);

      return new Pagination<GenderDto>(
        entityList,
        pagination_params.getPage(),
        pagination_params.getPerPage(),
        new TotalItems(total),
        new TotalPages(
          Math.ceil(total / pagination_params.getPerPage().value()),
        ),
      );
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error getting genders: ${error.message}`);
      }
      throw new DatabaseException('Error getting genders', 'getAll');
    }
  }
  findById(id: GenderId): Promise<GenderDto | null> {
    console.log('findById called with id:', id.value());
    throw new Error('Method not implemented.');
  }
  private mapReadModelToDto(gender: ctl_gender): GenderDto {
    return new GenderDto(gender.name, gender.id);
  }
}
