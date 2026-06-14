export class UpdateDocumentDto {
  constructor(
    public readonly id?: string,
    public readonly id_people?: string,
    public readonly number_document?: string,
    public readonly description?: string,
    public readonly id_type_document?: string,
    public readonly active?: boolean,
  ) {}
}
