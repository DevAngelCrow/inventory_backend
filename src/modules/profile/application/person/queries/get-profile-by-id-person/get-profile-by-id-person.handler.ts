import { PersonReadRepository } from '../../../repositories/person-read.repository';
import { GetProfileByIdPersonQuery } from './get-profile-by-id-person.query';
import { StorageFileReaderPort } from '@/modules/storage/domain/ports/storage-file-reader.port';
import { AuthenticateProfileDto } from '@/modules/auth/application/dtos/authenticate-profile.dto';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

@QueryHandler(GetProfileByIdPersonQuery)
export class GetProfileByIdPersonHandler implements IQueryHandler<GetProfileByIdPersonQuery> {
  constructor(
    private readonly repository: PersonReadRepository,
    private readonly storageFileReader: StorageFileReaderPort,
  ) {}
  async execute(query: GetProfileByIdPersonQuery) {
    const dto = await this.repository.getOneByIdProfile(query.id);
    if (!dto) return null;
    const profile_img = dto.profile_img
      ? await this.storageFileReader.readFileAsBase64(dto.profile_img)
      : null;
    return AuthenticateProfileDto.fromDto({ ...dto, profile_img });
  }
}
