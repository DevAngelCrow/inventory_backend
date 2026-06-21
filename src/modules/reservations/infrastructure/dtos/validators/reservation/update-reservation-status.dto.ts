import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ReservationStatusType } from '@/modules/reservations/domain/value-objects/reservation-status';

export class UpdateReservationStatusDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'])
  @ApiProperty({ example: 'CONFIRMED' })
  status!: ReservationStatusType;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Cliente canceló', required: false })
  reason?: string;
}
