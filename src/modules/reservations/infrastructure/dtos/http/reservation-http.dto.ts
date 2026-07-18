import {
  ReservationDto,
  ReservationItemDto,
} from '@/modules/reservations/application/dtos/reservation.dto';

export class ReservationItemHttpDto {
  constructor(
    public readonly id: string,
    public readonly id_product: string,
    public readonly quantity: number,
    public readonly unit_price: number,
    public readonly total_price: number,
    public readonly mnt_product?: {
      name: string;
      sku: string;
    },
  ) {}

  public static fromDto(dto: ReservationItemDto): ReservationItemHttpDto {
    return new ReservationItemHttpDto(
      dto.id!,
      dto.id_product,
      dto.quantity,
      dto.unit_price,
      dto.total_price,
      dto.mnt_product,
    );
  }
}

export class ReservationHttpDto {
  constructor(
    public readonly id: string,
    public readonly id_customer: string,
    public readonly event_start: Date,
    public readonly event_end: Date,
    public readonly status: {
      id: string;
      code: string;
      name: string;
      state_color: string;
      text_color: string;
    },
    public readonly total_amount: number,
    public readonly delivery_address: string | undefined,
    public readonly delivery_address_line2: string | undefined,
    public readonly delivery_zip: string | undefined,
    public readonly delivery_notes: string | undefined,
    public readonly id_customer_address: string | undefined,
    public readonly id_geographic_division: string | undefined,
    public readonly geographic_division_name: string | undefined,
    public readonly deposit_amount: number | undefined,
    public readonly balance_due: number | undefined,
    public readonly delivery_fee: number | undefined,
    public readonly discount_amount: number | undefined,
    public readonly notes: string | undefined,
    public readonly items: ReservationItemHttpDto[],
    public readonly created_at?: Date | null,
    public readonly updated_at?: Date | null,
    public readonly reservation_number?: string,
    public readonly delivery_datetime?: Date | null,
    public readonly pickup_datetime?: Date | null,
    public readonly transit_time_minutes?: number,
    public readonly mnt_customer?: {
      first_name: string;
      last_name: string;
      email?: string | null;
      phone?: string | null;
      full_address?: string;
    },
    public readonly mnt_invoice?: any[],
  ) {}

  public static fromDto(dto: ReservationDto): ReservationHttpDto {
    return new ReservationHttpDto(
      dto.id!,
      dto.id_customer,
      dto.event_start,
      dto.event_end,
      dto.status,
      dto.total_amount,
      dto.delivery_address,
      dto.delivery_address_line2,
      dto.delivery_zip,
      dto.delivery_notes,
      dto.id_customer_address,
      dto.id_geographic_division,
      dto.geographic_division_name,
      dto.deposit_amount,
      dto.balance_due,
      dto.delivery_fee,
      dto.discount_amount,
      dto.notes,
      dto.items.map((i) => ReservationItemHttpDto.fromDto(i)),
      dto.created_at,
      dto.updated_at,
      dto.reservation_number,
      dto.delivery_datetime,
      dto.pickup_datetime,
      dto.transit_time_minutes,
      dto.mnt_customer
        ? {
            first_name: dto.mnt_customer.first_name,
            last_name: dto.mnt_customer.last_name,
            email: dto.mnt_customer.email,
            phone: dto.mnt_customer.phone,
            full_address: dto.mnt_customer.full_address,
          }
        : undefined,
      dto.mnt_invoice
        ? dto.mnt_invoice.map((inv: any) => ({
            ...inv,
            subtotal: inv.subtotal != null ? Number(inv.subtotal) : undefined,
            tax_rate: inv.tax_rate != null ? Number(inv.tax_rate) : undefined,
            tax_amount: inv.tax_amount != null ? Number(inv.tax_amount) : undefined,
            discount_amount: inv.discount_amount != null ? Number(inv.discount_amount) : undefined,
            delivery_fee: inv.delivery_fee != null ? Number(inv.delivery_fee) : undefined,
            damage_charges: inv.damage_charges != null ? Number(inv.damage_charges) : undefined,
            total: inv.total != null ? Number(inv.total) : undefined,
          }))
        : undefined,
    );
  }
}
