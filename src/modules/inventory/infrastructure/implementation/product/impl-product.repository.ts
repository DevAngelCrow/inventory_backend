import { Injectable } from '@nestjs/common';
import { ProductRepository } from '@/modules/inventory/domain/repositories/product-repository';
import { ProductQueriesRepository } from '@/modules/inventory/application/repositories/product-read.repository';
import { Product } from '@/modules/inventory/domain/entities/product';
import { ProductId } from '@/modules/inventory/domain/value-objects/product-value-object/product-id';
import { ProductDto } from '@/modules/inventory/application/dtos/product.dto';
import { PrismaService } from '@/shared/infrastructure/persistence/prisma/prisma.service';
import { Pagination } from '@/shared/domain/value-object/pagination';
import { PaginationParams } from '@/shared/domain/value-object/pagination-params';
import { EntityList } from '@/shared/domain/value-object/entity-list';
import { TotalItems } from '@/shared/domain/value-object/total-items';
import { TotalPages } from '@/shared/domain/value-object/total-page';
import { NotFoundException } from '@/shared/domain/exceptions/not-found.exception';
import { DatabaseException } from '@/shared/infrastructure/exceptions/database.exception';
import { mnt_product } from 'generated/prisma/client';
import { BooleanStatusData } from '@/shared/infrastructure/interfaces/boolean-status-data.interface';
import { StatusMapperUtil } from '@/shared/infrastructure/utils/status-mapper.util';
import { GetBooleanStatusCatalogService } from '@/shared/infrastructure/services/get-status-catalog.service';

@Injectable()
export class ImplProductRepository
  implements ProductRepository, ProductQueriesRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async create(product: Product): Promise<void> {
    try {
      await this.prisma.client.mnt_product.create({
        data: {
          sku: product.getSku().value(),
          name: product.getName().value(),
          description: product.getDescription().value() ?? null,
          rental_price: product.getRentalPrice().value(),
          replacement_cost: product.getReplacementCost()?.value() ?? null,
          total_stock: product.getTotalStock().value(),
          min_stock_alert: product.getMinStockAlert().value(),
          id_category: product.getCategoryId().value(),
          color: product.getColor().value() ?? null,
          dimensions: product.getDimensions().value() ?? null,
          weight_lbs: product.getWeightLbs().value() ?? null,
          image_url: product.getImageUrl().value() ?? null,
          notes: product.getNotes().value() ?? null,
          active: product.getActive().value(),
          created_at: new Date(),
        },
      });
    } catch (error: any) {
      if (error?.code === 'P2002') {
        throw new DatabaseException(
          'Ya existe un producto con ese SKU.',
          'create',
        );
      }
      throw new DatabaseException('Error creating product', 'create');
    }
  }

  async update(product: Product): Promise<void> {
    try {
      await this.prisma.client.mnt_product.update({
        where: { id: product.getId()?.value() },
        data: {
          sku: product.getSku().value(),
          name: product.getName().value(),
          description: product.getDescription().value() ?? null,
          rental_price: product.getRentalPrice().value(),
          replacement_cost: product.getReplacementCost()?.value() ?? null,
          total_stock: product.getTotalStock().value(),
          min_stock_alert: product.getMinStockAlert().value(),
          id_category: product.getCategoryId().value(),
          color: product.getColor().value() ?? null,
          dimensions: product.getDimensions().value() ?? null,
          weight_lbs: product.getWeightLbs().value() ?? null,
          image_url: product.getImageUrl().value() ?? null,
          notes: product.getNotes().value() ?? null,
          updated_at: new Date(),
        },
      });
    } catch (error: any) {
      if (error?.code === 'P2002') {
        throw new DatabaseException(
          'Ya existe un producto con ese SKU.',
          'update',
        );
      }
      throw new DatabaseException('Error updating product', 'update');
    }
  }

  async toggleStatus(id: ProductId): Promise<Product> {
    try {
      const existing = await this.prisma.client.mnt_product.findUnique({
        where: { id: id.value() },
      });
      if (!existing) {
        throw new NotFoundException('Product', id.value());
      }
      const updated = await this.prisma.client.mnt_product.update({
        where: { id: id.value() },
        data: {
          active: !existing.active,
          updated_at: new Date(),
        },
      });
      return this.mapToDomain(updated);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new DatabaseException('Error toggling product status', 'toggleStatus');
    }
  }

  async getAll(
    pagination_params?: PaginationParams,
    filter_name?: string,
    filter_sku?: string,
    filter_category?: string,
    active?: boolean,
  ): Promise<Pagination<ProductDto> | ProductDto[]> {
    try {
      const where: any = {
        deleted_at: null,
      };
      
      if (filter_name) {
        where.name = { contains: filter_name, mode: 'insensitive' };
      }
      if (filter_sku) {
        where.sku = { contains: filter_sku, mode: 'insensitive' };
      }
      if (filter_category) {
        where.id_category = filter_category;
      }
      if (active !== undefined) {
        where.active = active;
      }

      const [productsDb, total, catalog_status] = await Promise.all([
        this.prisma.client.mnt_product.findMany({
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
        this.prisma.client.mnt_product.count({ where }),
        GetBooleanStatusCatalogService.getStatus(this.prisma),
      ]);

      const products = productsDb.map((p: any) => this.mapToDto(p, catalog_status));

      if (!pagination_params) return products;

      const entityList =
        products.length > 0
          ? new EntityList<ProductDto>(products)
          : new EntityList<ProductDto>([]);

      return new Pagination<ProductDto>(
        entityList,
        pagination_params.getPage(),
        pagination_params.getPerPage(),
        new TotalItems(total),
        new TotalPages(Math.ceil(total / pagination_params.getPerPage().value())),
      );
    } catch (error) {
      console.error('Prisma Error in Products:', error);
      throw new DatabaseException('Error getting products', 'getAll');
    }
  }

  async findById(id: string): Promise<ProductDto | null> {
    try {
      const product = await this.prisma.client.mnt_product.findUnique({
        where: { id },
      });
      if (!product) return null;
      return this.mapToDto(product as any);
    } catch (error) {
      throw new DatabaseException('Error finding product', 'findById');
    }
  }

  async findBySku(sku: string): Promise<ProductDto | null> {
    try {
      const product = await this.prisma.client.mnt_product.findUnique({
        where: { sku },
      });
      if (!product) return null;
      return this.mapToDto(product as any);
    } catch (error) {
      throw new DatabaseException('Error finding product by sku', 'findBySku');
    }
  }

  private mapToDomain(p: any): Product {
    return Product.create({
      id: p.id,
      sku: p.sku,
      name: p.name,
      description: p.description ?? undefined,
      rental_price: Number(p.rental_price),
      replacement_cost: p.replacement_cost ? Number(p.replacement_cost) : undefined,
      total_stock: p.total_stock,
      min_stock_alert: p.min_stock_alert,
      category_id: p.id_category,
      color: p.color ?? undefined,
      dimensions: p.dimensions ?? undefined,
      weight_lbs: p.weight_lbs ? Number(p.weight_lbs) : undefined,
      image_url: p.image_url ?? undefined,
      notes: p.notes ?? undefined,
      active: p.active,
    });
  }

  private mapToDto(
    p: any,
    catalog_status?: Map<string, BooleanStatusData>,
  ): ProductDto {
    const status = StatusMapperUtil.getStatusFromBoolean(
      p.active,
      catalog_status,
      'mapToDto',
    );
    return new ProductDto(
      p.sku,
      p.name,
      p.description ?? undefined,
      Number(p.rental_price),
      p.replacement_cost ? Number(p.replacement_cost) : undefined,
      p.total_stock,
      p.min_stock_alert,
      p.id_category,
      p.color ?? undefined,
      p.dimensions ?? undefined,
      p.weight_lbs ? Number(p.weight_lbs) : undefined,
      p.image_url ?? undefined,
      p.notes ?? undefined,
      p.active,
      p.id,
      p.created_at,
      p.updated_at,
      status,
    );
  }
}
