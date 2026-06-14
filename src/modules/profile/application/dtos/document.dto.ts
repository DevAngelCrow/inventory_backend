import { Document } from '../../domain/entities/document';

export class DocumentDto {
  constructor(
    public readonly number_document: string,
    public readonly id_people: string,
    public readonly id_type_document: string,
    public readonly active: boolean,
    public readonly description?: string,
    public readonly id?: string,
  ) {}
  public static fromEntity(document: Document): DocumentDto {
    return new DocumentDto(
      document.getNumberDocument().value(),
      document.getIdPeople().value(),
      document.getIdTypeDocument().value(),
      document.getActive().value(),
      document.getDescription()?.value(),
      document.getId()?.value(),
    );
  }
}
