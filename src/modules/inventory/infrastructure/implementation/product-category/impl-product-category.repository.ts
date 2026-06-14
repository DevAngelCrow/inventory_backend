import { Injectable } from '@nestjs/common';
import { ProductCategoryRepository } from '@/modules/inventory/domain/repositories/product-category-repository';
import { ProductCategoryQueriesRepository } from '@/modules/inventory/application/repositories/product-category-read.repository';
import { ProductCategory } from '@/modules/inventory/domain/entities/product-category';
import { ProductCategoryId } from '@/modules/inventory/domain/value-objects/product-category-value-object/product-category-id';
import { ProductCategoryDto } from '@/modules/inventory/application/dtos/product-category.dto';
import { PrismaService } from '@/shared/infrastructure/persistence/prisma/prisma.service';
import { Pagination } from '@/shared/domain/value-object/pagination';
import { PaginationParams } from '@/shared/domain/value-object/pagination-params';
import { EntityList } from '@/shared/domain/value-object/entity-list';
import { TotalItems } from '@/shared/domain/value-object/total-items';
import { TotalPages } from '@/shared/domain/value-object/total-page';
import { NotFoundException } from '@/shared/domain/exceptions/not-found.exception';
import { DatabaseException } from '@/shared/infrastructure/exceptions/database.exception';
import { ctl_product_category } from 'generated/prisma/client';

@Injectable()
export class ImplProductCategoryRepository
  implements ProductCategoryRepository, ProductCategoryQueriesRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async create(productCategory: ProductCategory): Promise<void> {
    try {
      await this.prisma.ctl_product_category.create({
        data: {
          name: productCategory.getName().value(),
          description: productCategory.getDescription().value() ?? null,
          icon: productCategory.getIcon() ?? null,
          active: productCategory.getActive(),
          created_at: new Date(),
        },
      });
    } catch (error: any) {
      if (error?.code === 'P2002') {
        throw new DatabaseException(
          'Ya existe una categoría de producto con ese nombre.',
          'create',
        );
      }
      throw new DatabaseException('Error creating product category', 'create');
    }
  }

  async update(productCategory: ProductCategory): Promise<void> {
    try {
      await this.prisma.ctl_product_category.update({
        where: { id: productCategory.getId()?.value() },
        data: {
          name: productCategory.getName().value(),
          description: productCategory.getDescription().value() ?? null,
          icon: productCategory.getIcon() ?? null,
          updated_at: new Date(),
        },
      });
    } catch (error: any) {
      if (error?.code === 'P2002') {
        throw new DatabaseException(
          'Ya existe una categoría de producto con ese nombre.',
          'update',
        );
      }
      throw new DatabaseException('Error updating product category', 'update');
    }
  }

  async toggleStatus(id: ProductCategoryId): Promise<ProductCategory> {
    try {
      const existing = await this.prisma.ctl_product_category.findUnique({
        where: { id: id.value() },
      });
      if (!existing) {
        throw new NotFoundException('ProductCategory', id.value());
      }
      const updated = await this.prisma.ctl_product_category.update({
        where: { id: id.value() },
        data: {
          active: !existing.active,
          updated_at: new Date(),
        },
      });
      return this.mapToDomain(updated);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new DatabaseException('Error toggling product category status', 'toggleStatus');
    }
  }

  async getAll(
    pagination_params?: PaginationParams,
    filter?: string,
    active?: boolean,
  ): Promise<Pagination<ProductCategoryDto> | ProductCategoryDto[]> {
    try {
      const where = {
        name: {
          contains: filter,
          mode: 'insensitive' as const,
        },
        ...(active !== undefined ? { active } : {}),
        deleted_at: null,
      };
      const [categoriesDb, total] = await Promise.all([
        this.prisma.ctl_product_category.findMany({
          skip:
            pagination_params?.getPage().value() &&
            pagination_params?.getPerPage().value()
              ? (pagination_params.getPage().value() - 1) *
                pagination_params.getPerPage().value()
              : undefined,
          take: pagination_params?.getPerPage().value(),
          where,
          orderBy: { name: 'asc' },
        }),
        this.prisma.ctl_product_category.count({ where }),
      ]);

      const categories = categoriesDb.map((cat) => this.mapToDto(cat));

      if (!pagination_params) return categories;

      const entityList =
        categories.length > 0
          ? new EntityList<ProductCategoryDto>(categories)
          : new EntityList<ProductCategoryDto>([]);

      return new Pagination<ProductCategoryDto>(
        entityList,
        pagination_params.getPage(),
        pagination_params.getPerPage(),
        new TotalItems(total),
        new TotalPages(Math.ceil(total / pagination_params.getPerPage().value())),
      );
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error getting product categories: ${error.message}`);
      }
      throw new DatabaseException('Error getting product categories', 'getAll');
    }
  }

  async findById(id: string): Promise<ProductCategoryDto | null> {
    try {
      const cat = await this.prisma.ctl_product_category.findUnique({
        where: { id },
      });
      if (!cat) return null;
      return this.mapToDto(cat);
    } catch (error) {
      throw new DatabaseException('Error finding product category', 'findById');
    }
  }

  private mapToDomain(cat: ctl_product_category): ProductCategory {
    return ProductCategory.create({
      id: cat.id,
      name: cat.name,
      description: cat.description ?? undefined,
      icon: cat.icon ?? undefined,
      active: cat.active,
    });
  }

  private mapToDto(cat: ctl_product_category): ProductCategoryDto {
    return new ProductCategoryDto(
      cat.name,
      cat.description ?? undefined,
      cat.icon ?? undefined,
      cat.active,
      cat.id,
      cat.created_at,
      cat.updated_at,
    );
  }
}
