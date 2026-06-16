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
          last_name: customer.getName().lastName,
          email: customer.getContact().email ?? null,
          phone: customer.getContact().phone,
          phone_secondary: customer.getContact().phoneSecondary ?? null,
          company_name: customer.getCompanyName() ?? null,
          tax_id: customer.getTaxId() ?? null,
          address_line1: customer.getAddress().addressLine1 ?? null,
          address_line2: customer.getAddress().addressLine2 ?? null,
          city: customer.getAddress().city ?? null,
          state: customer.getAddress().state ?? null,
          zip_code: customer.getAddress().zipCode ?? null,
          notes: customer.getNotes() ?? null,
          active: customer.getActive(),
          id_user: customer.getIdUser() ?? null,
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
          last_name: customer.getName().lastName,
          email: customer.getContact().email ?? null,
          phone: customer.getContact().phone,
          phone_secondary: customer.getContact().phoneSecondary ?? null,
          company_name: customer.getCompanyName() ?? null,
          tax_id: customer.getTaxId() ?? null,
          address_line1: customer.getAddress().addressLine1 ?? null,
          address_line2: customer.getAddress().addressLine2 ?? null,
          city: customer.getAddress().city ?? null,
          state: customer.getAddress().state ?? null,
          zip_code: customer.getAddress().zipCode ?? null,
          notes: customer.getNotes() ?? null,
          id_user: customer.getIdUser() ?? null,
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

      const [customersDb, total] = await Promise.all([
        this.prisma.client.mnt_customer.findMany({
          skip:
            pagination_params?.getPage().value() &&
            pagination_params?.getPerPage().value()
              ? (pagination_params.getPage().value() - 1) *
                pagination_params.getPerPage().value()
              : undefined,
          take: pagination_params?.getPerPage().value(),
          where,
          orderBy: { last_name: 'asc' },
        }),
        this.prisma.client.mnt_customer.count({ where }),
      ]);

      const customers = customersDb.map((c: any) => this.mapToDto(c));

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
      last_name: c.last_name,
      email: c.email ?? undefined,
      phone: c.phone,
      phone_secondary: c.phone_secondary ?? undefined,
      company_name: c.company_name ?? undefined,
      tax_id: c.tax_id ?? undefined,
      address_line1: c.address_line1 ?? undefined,
      address_line2: c.address_line2 ?? undefined,
      city: c.city ?? undefined,
      state: c.state ?? undefined,
      zip_code: c.zip_code ?? undefined,
      notes: c.notes ?? undefined,
      active: c.active,
      id_user: c.id_user ?? undefined,
    });
  }

  private mapToDto(c: any): CustomerDto {
    return new CustomerDto(
      c.first_name,
      c.last_name,
      c.phone,
      c.email ?? undefined,
      c.phone_secondary ?? undefined,
      c.company_name ?? undefined,
      c.tax_id ?? undefined,
      c.address_line1 ?? undefined,
      c.address_line2 ?? undefined,
      c.city ?? undefined,
      c.state ?? undefined,
      c.zip_code ?? undefined,
      c.notes ?? undefined,
      c.active,
      c.id_user ?? undefined,
      c.id,
      c.created_at,
      c.updated_at,
    );
  }
}
