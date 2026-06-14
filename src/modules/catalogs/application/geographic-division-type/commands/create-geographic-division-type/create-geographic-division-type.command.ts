import { GeographicDivisionTypeDto } from '../../../dtos/geographic-division-type.dto';

export class CreateGeographicDivisionTypeCommand {
  constructor(public readonly dto: GeographicDivisionTypeDto) {}
}
