import { Injectable } from '@nestjs/common';
import { InspectionRepository } from '@/modules/inspections/domain/repositories/inspection-repository';
import { InspectionQueriesRepository } from '@/modules/inspections/application/repositories/inspection-read.repository';
import { Inspection } from '@/modules/inspections/domain/entities/inspection';
import {
  InspectionDto,
  DamageItemDto,
} from '@/modules/inspections/application/dtos/inspection.dto';
import { PrismaService } from '@/shared/infrastructure/persistence/prisma/prisma.service';
import { Pagination } from '@/shared/domain/value-object/pagination';
import { PaginationParams } from '@/shared/domain/value-object/pagination-params';
import { EntityList } from '@/shared/domain/value-object/entity-list';
import { TotalItems } from '@/shared/domain/value-object/total-items';
import { TotalPages } from '@/shared/domain/value-object/total-page';
import { DatabaseException } from '@/shared/infrastructure/exceptions/database.exception';

@Injectable()
export class ImplInspectionRepository
  implements InspectionRepository, InspectionQueriesRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async save(inspection: Inspection): Promise<void> {
    try {
      await this.prisma.client.$transaction(async (prisma) => {
        const createdInspection =
          await prisma.mnt_reservation_inspection.create({
            data: {
              id_reservation: inspection.getIdReservation(),
              inspection_date: inspection.getInspectionDate(),
              overall_condition: inspection.getOverallCondition(),
              id_status: (
                await prisma.ctl_status.findFirstOrThrow({
                  where: {
                    code: inspection.getStatus().value(),
                    ctl_category_status: { code: 'INS' },
                  },
                })
              ).id,
              general_notes: inspection.getGeneralNotes() ?? null,
              total_charges: inspection.getTotalCharges(),
              id_inspected_by: inspection.getIdInspectedBy() ?? null,
              created_at: new Date(),
            },
          });

        const damageItems = inspection.getDamageItems().map((item) => ({
          id_inspection: createdInspection.id,
          id_product: item.getIdProduct(),
          damage_type: item.getDamageType(),
          description: item.getDescription(),
          quantity_affected: item.getQuantityAffected().value(),
          charge_amount: item.getChargeAmount(),
          photo_url: item.getPhotoUrl() ?? null,
          created_at: new Date(),
        }));

        if (damageItems.length > 0) {
          await prisma.mnt_damage_item.createMany({
            data: damageItems,
          });
        }
      });
    } catch (error: any) {
      throw new DatabaseException('Error saving inspection', 'save');
    }
  }

  async getAll(
    pagination_params?: PaginationParams,
    filter_reservation?: string,
    filter_status?: string,
  ): Promise<Pagination<InspectionDto> | InspectionDto[]> {
    try {
      const where: any = {};

      if (filter_reservation) {
        where.id_reservation = filter_reservation;
      }
      if (filter_status) {
        where.id_status = filter_status;
      }

      const [inspectionsDb, total] = await Promise.all([
        this.prisma.client.mnt_reservation_inspection.findMany({
          skip:
            pagination_params?.getPage().value() &&
            pagination_params?.getPerPage().value()
              ? (pagination_params.getPage().value() - 1) *
                pagination_params.getPerPage().value()
              : undefined,
          take: pagination_params?.getPerPage().value(),
          where,
          include: {
            mnt_damage_item: true,
            ctl_status: true,
          },
          orderBy: { inspection_date: 'desc' },
        }),
        this.prisma.client.mnt_reservation_inspection.count({ where }),
      ]);

      const inspections = inspectionsDb.map((i: any) => this.mapToDto(i));

      if (!pagination_params) return inspections;

      const entityList =
        inspections.length > 0
          ? new EntityList<InspectionDto>(inspections)
          : new EntityList<InspectionDto>([]);

      return new Pagination<InspectionDto>(
        entityList,
        pagination_params.getPage(),
        pagination_params.getPerPage(),
        new TotalItems(total),
        new TotalPages(
          Math.ceil(total / pagination_params.getPerPage().value()),
        ),
      );
    } catch (error) {
      throw new DatabaseException('Error getting inspections', 'getAll');
    }
  }

  async findById(id: string): Promise<InspectionDto | null> {
    try {
      const inspection =
        await this.prisma.client.mnt_reservation_inspection.findUnique({
          where: { id },
          include: {
            mnt_damage_item: true,
            ctl_status: true,
          },
        });
      if (!inspection) return null;
      return this.mapToDto(inspection);
    } catch (error) {
      throw new DatabaseException('Error finding inspection', 'findById');
    }
  }

  private mapToDto(i: any): InspectionDto {
    return new InspectionDto(
      i.id_reservation,
      i.inspection_date,
      i.overall_condition,
      i.ctl_status ?? i.status,
      i.general_notes ?? undefined,
      Number(i.total_charges),
      i.id_inspected_by ?? undefined,
      i.mnt_damage_item
        ? i.mnt_damage_item.map(
            (d: any) =>
              new DamageItemDto(
                d.id_product,
                d.damage_type,
                d.description,
                d.quantity_affected,
                Number(d.charge_amount),
                d.id_inspection,
                d.photo_url ?? undefined,
                d.id,
              ),
          )
        : [],
      i.id,
      i.created_at,
      i.updated_at,
    );
  }
}
