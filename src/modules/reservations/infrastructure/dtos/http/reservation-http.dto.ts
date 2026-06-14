import { ReservationDto, ReservationItemDto } from '@/modules/reservations/application/dtos/reservation.dto';

export class ReservationItemHttpDto {
  constructor(
    public readonly id: string,
    public readonly id_product: string,
    public readonly quantity: number,
    public readonly unit_price: number,
    public readonly total_price: number,
  ) {}

  public static fromDto(dto: ReservationItemDto): ReservationItemHttpDto {
    return new ReservationItemHttpDto(
      dto.id!,
      dto.id_product,
      dto.quantity,
      dto.unit_price,
      dto.total_price,
    );
  }
}

export class ReservationHttpDto {
  constructor(
    public readonly id: string,
    public readonly id_customer: string,
    public readonly status: string,
    public readonly event_start: Date,
    public readonly event_end: Date,
    public readonly total_amount: number,
    public readonly delivery_address: string | undefined,
    public readonly deposit_amount: number | undefined,
    public readonly balance_due: number | undefined,
    public readonly notes: string | undefined,
    public readonly items: ReservationItemHttpDto[],
    public readonly created_at?: Date | null,
    public readonly updated_at?: Date | null,
  ) {}

  public static fromDto(dto: ReservationDto): ReservationHttpDto {
    return new ReservationHttpDto(
      dto.id!,
      dto.id_customer,
      dto.status,
      dto.event_start,
      dto.event_end,
      dto.total_amount,
      dto.delivery_address,
      dto.deposit_amount,
      dto.balance_due,
      dto.notes,
      dto.items.map(i => ReservationItemHttpDto.fromDto(i)),
      dto.created_at,
      dto.updated_at,
    );
  }
}
