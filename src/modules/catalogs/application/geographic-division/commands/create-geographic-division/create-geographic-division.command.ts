import { GeographicDivisionDto } from '../../../dtos/geographic-division.dto';

export class CreateGeographicDivisionCommand {
  constructor(public readonly dto: GeographicDivisionDto) {}
}
