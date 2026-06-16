import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { ReservationStatusType } from '@/modules/reservations/domain/value-objects/reservation-status';

export class UpdateReservationStatusDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(['DRAFT', 'CONFIRMED', 'IN_TRANSIT', 'DELIVERED', 'PICKED_UP', 'RETURNED', 'INSPECTED', 'COMPLETED', 'CANCELLED'])
  @ApiProperty({ example: 'CONFIRMED' })
  status!: ReservationStatusType;
}
