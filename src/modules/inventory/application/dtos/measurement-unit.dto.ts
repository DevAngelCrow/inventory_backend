export class MeasurementUnitDto {
  id!: string;
  name!: string;
  abbreviation!: string;
  active!: boolean;
  created_at?: Date | null;
  updated_at?: Date | null;
}
