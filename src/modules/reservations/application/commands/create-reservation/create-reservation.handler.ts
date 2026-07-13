import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { EventDispatcherPort } from '@/shared/domain/ports/event-dispatcher.port';
import { randomUUID } from 'crypto';
import { CreateReservationCommand } from './create-reservation.command';
import { ReservationRepository } from '@/modules/reservations/domain/repositories/reservation-repository';
import { ReservationAggregate as Reservation } from '@/modules/reservations/domain/aggregates/reservation.aggregate';
import { GetAvailableStockQuery } from '@/modules/inventory/application/availability/queries/get-available-stock/get-available-stock.query';
import { BadRequestException } from '@nestjs/common';

@CommandHandler(CreateReservationCommand)
export class CreateReservationHandler implements ICommandHandler<CreateReservationCommand> {
  constructor(
    private readonly repository: ReservationRepository,
    private readonly dispatcher: EventDispatcherPort,
    private readonly queryBus: QueryBus,
  ) {}

  async execute(command: CreateReservationCommand): Promise<void> {
    const reservation = Reservation.create({
      id: randomUUID(),
      id_customer: command.id_customer,
      status: 'PENDING',
      event_start: command.event_start,
      event_end: command.event_end,
      total_amount: command.total_amount,
      delivery_address: command.delivery_address,
      delivery_address_line2: command.delivery_address_line2,
      delivery_zip: command.delivery_zip,
      delivery_notes: command.delivery_notes,
      id_customer_address: command.id_customer_address,
      id_geographic_division: command.id_geographic_division,
      deposit_amount: command.deposit_amount,
      balance_due: command.balance_due,
      delivery_fee: command.delivery_fee,
      discount_amount: command.discount_amount,
      notes: command.notes,
      items: command.items.map((i) => ({
        id_product: i.id_product,
        quantity: i.quantity,
        unit_price: i.unit_price,
        total_price: i.total_price,
      })),
    });

    for (const item of command.items) {
      const availableStock = await this.queryBus.execute<
        GetAvailableStockQuery,
        number
      >(
        new GetAvailableStockQuery(
          item.id_product,
          new Date(command.event_start),
          new Date(command.event_end),
        ),
      );

      if (availableStock < item.quantity) {
        throw new BadRequestException(
          `Not enough stock for product ${item.id_product}. Requested: ${item.quantity}, Available: ${availableStock}`,
        );
      }
    }

    await this.repository.create(reservation);

    await this.dispatcher.dispatch(reservation.getDomainEvents());
    reservation.clearDomainEvents();
  }
}
