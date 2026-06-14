import { IsString, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UpdateProfileValidatorDto } from './update-profile.dto';

/**
 * Body shape for PUT /update-profile/:id (self-service profile edit).
 *
 * For the list of fields a user is NOT allowed to send (and why) see the
 * docblock on UpdateProfileValidatorDto. This class only adds optional,
 * non-privileged extras.
 */
export class UpdateProfileBodyDto extends UpdateProfileValidatorDto {
  @IsString()
  @IsOptional()
  @MaxLength(255)
  @ApiProperty({ required: false })
  description?: string;
}
