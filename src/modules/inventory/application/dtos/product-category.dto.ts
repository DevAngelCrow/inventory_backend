export class ProductCategoryDto {
  constructor(
    public readonly name: string,
    public readonly description: string | undefined,
    public readonly icon: string | undefined,
    public readonly active: boolean,
    public readonly id?: string,
    public readonly created_at?: Date | null,
    public readonly updated_at?: Date | null,
  ) {}
}
