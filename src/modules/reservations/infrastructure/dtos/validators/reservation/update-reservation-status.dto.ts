import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsOptional, IsString, IsDateString } from 'class-validator';
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

  @IsDateString()
  @IsOptional()
  @ApiProperty({ example: '2023-12-01T10:00:00Z', required: false })
  delivery_datetime?: string;

  @IsDateString()
  @IsOptional()
  @ApiProperty({ example: '2023-12-02T10:00:00Z', required: false })
  pickup_datetime?: string;
}
