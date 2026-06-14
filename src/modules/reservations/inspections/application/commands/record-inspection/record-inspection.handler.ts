import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RecordInspectionCommand } from './record-inspection.command';
import { InspectionRepository } from '@/modules/reservations/inspections/domain/repositories/inspection-repository';
import { Inspection } from '@/modules/reservations/inspections/domain/entities/inspection';

@CommandHandler(RecordInspectionCommand)
export class RecordInspectionHandler implements ICommandHandler<RecordInspectionCommand> {
  constructor(private readonly repository: InspectionRepository) {}

  async execute(command: RecordInspectionCommand): Promise<void> {
    const inspection = Inspection.create({
      id_reservation: command.id_reservation,
      inspection_date: command.inspection_date,
      overall_condition: command.overall_condition,
      status: command.status,
      general_notes: command.general_notes,
      total_charges: command.total_charges,
      id_inspected_by: command.id_inspected_by,
      damage_items: command.damage_items.map(i => ({
        id_product: i.id_product,
        damage_type: i.damage_type,
        description: i.description,
        quantity_affected: i.quantity_affected,
        charge_amount: i.charge_amount,
        photo_url: i.photo_url,
      })),
    });

    await this.repository.save(inspection);
  }
}
