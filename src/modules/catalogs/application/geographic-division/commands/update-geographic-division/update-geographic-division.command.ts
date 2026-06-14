import { GeographicDivisionDto } from '../../../dtos/geographic-division.dto';

export class UpdateGeographicDivisionCommand {
  constructor(public readonly dto: GeographicDivisionDto) {}
}
