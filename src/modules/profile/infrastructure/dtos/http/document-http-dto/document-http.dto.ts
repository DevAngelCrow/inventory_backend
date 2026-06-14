import { Document } from 'src/modules/profile/domain/entities/document';

export class DocumentHttpDto {
  constructor(
    public readonly number_document: string,
    public readonly id_people: string,
    public readonly id_type_document: string,
    public readonly active: boolean,
    public readonly description?: string,
    public readonly id?: string,
  ) {}
  public static fromEntity(document: Document): DocumentHttpDto {
    return new DocumentHttpDto(
      document.getNumberDocument().value(),
      document.getIdPeople().value(),
      document.getIdTypeDocument().value(),
      document.getActive().value(),
      document.getDescription()?.value(),
      document.getId() ? document.getId()?.value() : undefined,
    );
  }
}
