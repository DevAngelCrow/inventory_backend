import { GeographicDivisionTypeDto } from '../../../dtos/geographic-division-type.dto';

export class UpdateGeographicDivisionTypeCommand {
  constructor(public readonly dto: GeographicDivisionTypeDto) {}
}
