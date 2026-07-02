export class CreateProductCategoryCommand {
  constructor(
    public readonly name: string,
    public readonly description?: string,
    public readonly icon?: string,
  ) {}
}
