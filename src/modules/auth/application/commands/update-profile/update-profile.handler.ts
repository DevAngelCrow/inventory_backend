import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { StorageUploadService } from '@/modules/storage/application/services/storage/storage-upload.service';
import { UserReadRepository } from '@/modules/identity-access-management/application/repositories/user-read.repository';
import { NotFoundException } from '@/shared/domain/exceptions/not-found.exception';
import { ForbiddenException } from '@/shared/application/exceptions/forbidden.exception';
import { GetAddressByIdQuery } from '@/modules/profile/application/address/queries/get-address-by-id/get-address-by-id.query';
import { GetDocumentByIdQuery } from '@/modules/profile/application/document/queries/get-document-by-id/get-document-by-id.query';
import { Address } from '@/modules/profile/domain/entities/address';
import { Document } from '@/modules/profile/domain/entities/document';
import { UpdateProfileCommand } from './update-profile.command';
import { StorageFilesContentFile } from '@/modules/storage/domain/value-objects/storage-files-value-object/storage-files-content-file';
import { StorageFiles } from '@/modules/storage/domain/entities/storage-files';
import { UpdatePersonDto } from '@/modules/profile/application/profile-dto/update-person.dto';
import { PersonUpdateService } from '@/modules/profile/application/services/person/person-update.service';
import { UpdateAddressDto } from '@/modules/profile/application/profile-dto/update-address.dto';
import { AddressUpdateService } from '@/modules/profile/application/services/address/address-update.service';
import { UpdateDocumentDto } from '@/modules/profile/application/profile-dto/update-document.dto';
import { DocumentUpdateService } from '@/modules/profile/application/services/document/document-update.service';
import { UpdateUserNameService } from '@/modules/identity-access-management/application/services/update-user-name.service';
import { PersonDto } from '@/modules/profile/application/dtos/person.dto';
import { AddressDto } from '@/modules/profile/application/dtos/address.dto';
import { DocumentDto } from '@/modules/profile/application/dtos/document.dto';
interface FileUpload {
  originalname: string;
  size: number;
  mimetype: string;
}
@CommandHandler(UpdateProfileCommand)
export class UpdateProfileHandler<
  T extends FileUpload,
> implements ICommandHandler<UpdateProfileCommand<T>> {
  constructor(
    private readonly personUpdateService: PersonUpdateService,
    private readonly storageUploaderService: StorageUploadService<T>,
    private readonly userNameUpdateService: UpdateUserNameService,
    public readonly addressUpdateService: AddressUpdateService,
    public readonly documentUpdateService: DocumentUpdateService,
    private readonly userReadRepository: UserReadRepository,
    private readonly queryBus: QueryBus,
  ) {}

  async execute(command: UpdateProfileCommand<T>): Promise<void> {
    const idUser = command.update_profile_dto.id_user;
    const user = await this.userReadRepository.getOneById(idUser);
    if (!user) {
      throw new NotFoundException('User', idUser);
    }
    const idPeople = user.id_people;

    if (command.update_profile_dto.id_address) {
      const address = await this.queryBus.execute<GetAddressByIdQuery, Address | null>(
        new GetAddressByIdQuery(command.update_profile_dto.id_address)
      );
      if (!address) {
        throw new NotFoundException('Address', command.update_profile_dto.id_address);
      }
      if (address.getIdPeople().value() !== idPeople) {
        throw new ForbiddenException('You are not allowed to modify this address.');
      }
    }

    if (command.update_profile_dto.id_document) {
      const document = await this.queryBus.execute<GetDocumentByIdQuery, Document | null>(
        new GetDocumentByIdQuery(command.update_profile_dto.id_document)
      );
      if (!document) {
        throw new NotFoundException('Document', command.update_profile_dto.id_document);
      }
      if (document.getIdPeople().value() !== idPeople) {
        throw new ForbiddenException('You are not allowed to modify this document.');
      }
    }

    const { file_img } = command.update_profile_dto;
    let storageFiles: StorageFiles<T> | undefined = undefined;
    if (file_img) {
      const storageFileDto = new StorageFilesContentFile<T>(file_img);
      storageFiles = await this.storageUploaderService.run(
        storageFileDto.value(),
        command.provider_storage_code,
      );
    }

    const resolvedImgPath = storageFiles
      ? storageFiles.getPath().value()
      : (command.update_profile_dto?.img_path ?? null);

    const personDto = new UpdatePersonDto(
      idPeople,
      command.update_profile_dto?.first_name,
      command.update_profile_dto?.birthdate,
      command.update_profile_dto?.id_gender,
      command.update_profile_dto?.email,
      command.update_profile_dto?.id_marital_status,
      command.update_profile_dto?.phone,
      command.update_profile_dto?.middle_name,
      command.update_profile_dto?.last_name,
      resolvedImgPath,
      command.update_profile_dto?.nationalities,
      user.id_status,
    );

    await this.personUpdateService.run(personDto as unknown as PersonDto);

    const addressDto = new UpdateAddressDto(
      command.update_profile_dto?.id_address,
      idPeople,
      command.update_profile_dto?.street ?? undefined,
      command.update_profile_dto?.street_number ?? undefined,
      command.update_profile_dto?.neighborhood ?? undefined,
      command.update_profile_dto?.id_geographic_division ?? undefined,
      command.update_profile_dto?.house_number ?? undefined,
      command.update_profile_dto?.block ?? undefined,
      command.update_profile_dto?.pathway ?? undefined,
      command.update_profile_dto?.current ?? undefined,
    );
    //if (command.update_profile_dto.id_address) {
    await this.addressUpdateService.run(addressDto as unknown as AddressDto);
    //}

    const documentDto = new UpdateDocumentDto(
      command.update_profile_dto.id_document,
      idPeople,
      command.update_profile_dto.document_number ?? undefined,
      command.update_profile_dto.description ?? undefined,
      command.update_profile_dto.id_type_document ?? undefined,
      command.update_profile_dto.active ?? true,
    );

    if (command.update_profile_dto.id_document) {
      await this.documentUpdateService.run(
        documentDto as unknown as DocumentDto,
      );
    }
    if (
      !command.update_profile_dto.id_document &&
      command.update_profile_dto.document_number &&
      command.update_profile_dto.id_type_document
    ) {
      await this.documentUpdateService.run(
        documentDto as unknown as DocumentDto,
      );
    }
    const userName = command.update_profile_dto.user_name;

    await this.userNameUpdateService.run(userName, idUser);
  }
}
