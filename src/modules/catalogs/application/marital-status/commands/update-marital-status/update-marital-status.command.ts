import { MaritalStatusDto } from '../../../dtos/marital-status.dto';

export class UpdateMaritalStatusCommand {
  constructor(public readonly marital_status_dto: MaritalStatusDto) {}
}
