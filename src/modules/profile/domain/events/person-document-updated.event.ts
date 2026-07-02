export class PersonDocumentUpdatedEvent {
  constructor(
    public readonly id: string,
    public readonly number_document: string,
    public readonly id_people: string,
    public readonly id_type_document: string,
    public readonly active: boolean,
    public readonly description?: string,
  ) {}
}
