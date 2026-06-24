import { Injectable } from '@nestjs/common';
import { CustomerRepository } from '@/modules/customers/domain/repositories/customer-repository';
import { CustomerQueriesRepository } from '@/modules/customers/application/repositories/customer-read.repository';
import { Customer } from '@/modules/customers/domain/entities/customer';
import { CustomerId } from '@/modules/customers/domain/value-objects/customer-id';
import { CustomerDto } from '@/modules/customers/application/dtos/customer.dto';
import { PrismaService } from '@/shared/infrastructure/persistence/prisma/prisma.service';
import { Pagination } from '@/shared/domain/value-object/pagination';
import { PaginationParams } from '@/shared/domain/value-object/pagination-params';
import { EntityList } from '@/shared/domain/value-object/entity-list';
import { TotalItems } from '@/shared/domain/value-object/total-items';
import { TotalPages } from '@/shared/domain/value-object/total-page';
import { NotFoundException } from '@/shared/domain/exceptions/not-found.exception';
import { DatabaseException } from '@/shared/infrastructure/exceptions/database.exception';
import { BooleanStatusData } from '@/shared/infrastructure/interfaces/boolean-status-data.interface';
import { StatusMapperUtil } from '@/shared/infrastructure/utils/status-mapper.util';
import { GetBooleanStatusCatalogService } from '@/shared/infrastructure/services/get-status-catalog.service';

@Injectable()
export class ImplCustomerRepository
  implements CustomerRepository, CustomerQueriesRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async create(customer: Customer): Promise<void> {
    try {
      await this.prisma.client.mnt_customer.create({
        data: {
          first_name: customer.getName().firstName,
          middle_name: customer.getName().middleName ?? null,
          last_name: customer.getName().lastName,
          email: customer.getContact().email ?? null,
          phone: customer.getContact().phone,
          phone_secondary: customer.getContact().phoneSecondary ?? null,
          company_name: customer.getCompanyName()?.value() ?? null,
          tax_id: customer.getTaxId()?.value() ?? null,
          notes: customer.getNotes()?.value() ?? null,
          active: customer.getActive().value(),
          id_country: customer.getIdCountry().value(),
          mnt_customer_address: {
            create: customer.getAddresses().map(a => ({
              label: a.label,
              address_line1: a.addressLine1,
              address_line2: a.addressLine2 ?? null,
              zip_code: a.zipCode ?? null,
              is_primary: a.isPrimary,
              id_geographic_division: a.idGeographicDivision ?? null,
              active: a.active,
            }))
          },
          created_at: new Date(),
        },
      });
    } catch (error: any) {
      if (error?.code === 'P2002') {
        throw new DatabaseException(
          'Ya existe un cliente con esos datos únicos.',
          'create',
        );
      }
      throw new DatabaseException('Error creating customer', 'create');
    }
  }

  async update(customer: Customer): Promise<void> {
    try {
      await this.prisma.client.mnt_customer.update({
        where: { id: customer.getId()?.value() },
        data: {
          first_name: customer.getName().firstName,
          middle_name: customer.getName().middleName ?? null,
          last_name: customer.getName().lastName,
          email: customer.getContact().email ?? null,
          phone: customer.getContact().phone,
          phone_secondary: customer.getContact().phoneSecondary ?? null,
          company_name: customer.getCompanyName()?.value() ?? null,
          tax_id: customer.getTaxId()?.value() ?? null,
          notes: customer.getNotes()?.value() ?? null,
          id_country: customer.getIdCountry().value(),
          updated_at: new Date(),
        },
      });
    } catch (error: any) {
      if (error?.code === 'P2002') {
        throw new DatabaseException(
          'Conflicto de datos únicos.',
          'update',
        );
      }
      throw new DatabaseException('Error updating customer', 'update');
    }
  }

  async toggleStatus(id: CustomerId): Promise<Customer> {
    try {
      const existing = await this.prisma.client.mnt_customer.findUnique({
        where: { id: id.value() },
      });
      if (!existing) {
        throw new NotFoundException('Customer', id.value());
      }
      const updated = await this.prisma.client.mnt_customer.update({
        where: { id: id.value() },
        data: {
          active: !existing.active,
          updated_at: new Date(),
        },
      });
      return this.mapToDomain(updated);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new DatabaseException('Error toggling customer status', 'toggleStatus');
    }
  }

  async getAll(
    pagination_params?: PaginationParams,
    filter_name?: string,
    filter_email?: string,
    active?: boolean,
  ): Promise<Pagination<CustomerDto> | CustomerDto[]> {
    try {
      const where: any = {
        deleted_at: null,
      };

      if (filter_name) {
        where.OR = [
          { first_name: { contains: filter_name, mode: 'insensitive' } },
          { last_name: { contains: filter_name, mode: 'insensitive' } },
          { email: { contains: filter_name, mode: 'insensitive' } },
          { phone: { contains: filter_name, mode: 'insensitive' } },
        ];
      }
      if (filter_email) {
        where.email = { contains: filter_email, mode: 'insensitive' };
      }
      if (active !== undefined) {
        where.active = active;
      }

      const [customersDb, total, catalog_status] = await Promise.all([
        this.prisma.client.mnt_customer.findMany({
          skip:
            pagination_params?.getPage().value() &&
            pagination_params?.getPerPage().value()
              ? (pagination_params.getPage().value() - 1) *
                pagination_params.getPerPage().value()
              : undefined,
          take: pagination_params?.getPerPage().value(),
          where,
          include: {
            ctl_country: true,
            mnt_customer_address: {
              include: {
                ctl_geographic_division: {
                  include: {
                    ctl_geographic_division: true
                  }
                }
              }
            }
          },
          orderBy: { last_name: 'asc' },
        }),
        this.prisma.client.mnt_customer.count({ where }),
        GetBooleanStatusCatalogService.getStatus(this.prisma),
      ]);

      const customers = customersDb.map((c: any) => this.mapToDto(c, catalog_status));

      if (!pagination_params) return customers;

      const entityList =
        customers.length > 0
          ? new EntityList<CustomerDto>(customers)
          : new EntityList<CustomerDto>([]);

      return new Pagination<CustomerDto>(
        entityList,
        pagination_params.getPage(),
        pagination_params.getPerPage(),
        new TotalItems(total),
        new TotalPages(Math.ceil(total / pagination_params.getPerPage().value())),
      );
    } catch (error) {
      console.error('Prisma error in getAll Customers:', error);
      throw new DatabaseException('Error getting customers', 'getAll');
    }
  }

  async findById(id: string): Promise<CustomerDto | null> {
    try {
      const customer = await this.prisma.client.mnt_customer.findUnique({
        where: { id },
        include: {
          ctl_country: true,
          mnt_customer_address: {
            include: {
              ctl_geographic_division: {
                include: {
                  ctl_geographic_division: true
                }
              }
            }
          }
        }
      });
      if (!customer) return null;
      return this.mapToDto(customer as any);
    } catch (error) {
      throw new DatabaseException('Error finding customer', 'findById');
    }
  }

  async findByEmail(email: string): Promise<CustomerDto | null> {
    try {
      const customer = await this.prisma.client.mnt_customer.findFirst({
        where: { email },
        include: {
          ctl_country: true,
          mnt_customer_address: {
            include: {
              ctl_geographic_division: {
                include: {
                  ctl_geographic_division: true
                }
              }
            }
          }
        }
      });
      if (!customer) return null;
      return this.mapToDto(customer as any);
    } catch (error) {
      throw new DatabaseException('Error finding customer by email', 'findByEmail');
    }
  }

  private mapToDomain(c: any): Customer {
    return Customer.create({
      id: c.id,
      first_name: c.first_name,
      middle_name: c.middle_name ?? undefined,
      last_name: c.last_name,
      email: c.email ?? undefined,
      phone: c.phone,
      phone_secondary: c.phone_secondary ?? undefined,
      company_name: c.company_name ?? undefined,
      tax_id: c.tax_id ?? undefined,
      notes: c.notes ?? undefined,
      active: c.active,
      id_country: c.id_country,
      addresses: c.mnt_customer_address ? c.mnt_customer_address.map((a: any) => ({
        label: a.label,
        address_line1: a.address_line1,
        address_line2: a.address_line2 ?? undefined,
        zip_code: a.zip_code ?? undefined,
        is_primary: a.is_primary,
        id_geographic_division: a.id_geographic_division ?? undefined,
        id: a.id,
        active: a.active,
      })) : [],
    });
  }

  private mapToDto(c: any, catalog_status?: Map<string, BooleanStatusData>): CustomerDto {
    const status = StatusMapperUtil.getStatusFromBoolean(
      c.active,
      catalog_status,
      'mapToDto',
    );
    return new CustomerDto(
      c.first_name,
      c.last_name,
      c.phone,
      c.id_country,
      c.middle_name ?? undefined,
      c.email ?? undefined,
      c.phone_secondary ?? undefined,
      c.company_name ?? undefined,
      c.tax_id ?? undefined,
      c.notes ?? undefined,
      c.active,
      c.ctl_country?.name,
      c.ctl_country?.phone_code,
      c.mnt_customer_address ? c.mnt_customer_address.map((a: any) => ({
        label: a.label,
        address_line1: a.address_line1,
        is_primary: a.is_primary,
        address_line2: a.address_line2 ?? undefined,
        zip_code: a.zip_code ?? undefined,
        id_geographic_division: a.id_geographic_division ?? undefined,
        id: a.id,
        active: a.active,
        geographic_division_name: a.ctl_geographic_division?.name,
        state_name: a.ctl_geographic_division?.ctl_geographic_division?.name,
      })) : [],
      c.id,
      c.created_at,
      c.updated_at,
      status,
    );
  }
}
