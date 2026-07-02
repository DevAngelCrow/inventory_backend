export class PersonDocumentAddedEvent {
  constructor(
    public readonly number_document: string,
    public readonly id_people: string,
    public readonly id_type_document: string,
    public readonly active: boolean,
    public readonly description?: string,
  ) {}
}
