import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { SuccessResponseDto } from '../../../../shared/infrastructure/http/dtos/http-success-response.dto';
import { HttpPaginatedResponseDto } from '../../../../shared/infrastructure/http/dtos/http-paginated-response.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Permissions } from '@/modules/security/infrastructure/decorators/permissions.decorator';
import { ConfigService } from '@nestjs/config';
import { Express } from 'express';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { StorageFilesUploadFlowCommand } from '../../application/storage-files/commands/storage-files-upload-flow/storage-files-upload-flow.command';
import {
  multerImageOptions,
  validateFileMagicBytes,
} from '../config/multer-file-filter.config';
import { GetStorageFilesQueryDto } from '../dtos/query/get-storage-files-query.dto';
import { GetStorageFilesQuery } from '../../application/storage-files/queries/get-storage-files/get-storage-files.query';
import { StorageFilesHttpDto } from '../dtos/http/storage-files-http-dto/storage-files-http.dto';
import { Pagination } from '@/shared/domain/value-object/pagination';
import { StorageFileListDto } from '../../application/dtos/storage-file-list.dto';

type FileType = Express.Multer.File;
@Controller('storage-files')
@ApiBearerAuth('JWT-auth')
export class StorageFilesController {
  constructor(
    private readonly command: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly configService: ConfigService,
  ) {}
  @Permissions('listar-archivos-almacenamiento')
  @Get()
  @HttpCode(200)
  async getAll(
    @Query() query: GetStorageFilesQueryDto,
  ): Promise<
    SuccessResponseDto<HttpPaginatedResponseDto<StorageFilesHttpDto>>
  > {
    const appQuery = new GetStorageFilesQuery(query, query.id_provider);
    const result: Pagination<StorageFileListDto> | StorageFileListDto[] =
      await this.queryBus.execute(appQuery);

    const items =
      result instanceof Pagination ? result.getEntityList() : result;
    const totalItems =
      result instanceof Pagination ? result.getTotalItems() : items.length;
    const totalPages =
      result instanceof Pagination ? result.getTotalPages() : 1;

    const itemsHttp = items.map((f: StorageFileListDto) =>
      StorageFilesHttpDto.fromDto(f),
    );
    const response = new HttpPaginatedResponseDto<StorageFilesHttpDto>(
      itemsHttp,
      totalItems,
      totalPages,
      query.page,
      query.per_page,
    );
    return new SuccessResponseDto<
      HttpPaginatedResponseDto<StorageFilesHttpDto>
    >(response, HttpStatus.OK, 'Storage files retrieved successfully');
  }

  @Permissions('subir-multimedia-almacenamiento')
  @Post()
  @HttpCode(201)
  @UseInterceptors(FileInterceptor('content_file', multerImageOptions))
  async upload(
    @UploadedFile() content_file: FileType,
    @Query('folder') folder?: string,
  ): Promise<SuccessResponseDto<null>> {
    const file: FileType = content_file;
    if (file?.buffer && !validateFileMagicBytes(file.buffer, file.mimetype)) {
      throw new BadRequestException(
        `File content does not match its declared MIME type '${file.mimetype}'`,
      );
    }
    const storageFileUploadFlowCommand =
      new StorageFilesUploadFlowCommand<FileType>(
        file,
        this.configService.get<string>('STORAGE_PROVIDER')!,
        folder,
      );
    await this.command.execute(storageFileUploadFlowCommand);
    return new SuccessResponseDto<null>(
      null,
      HttpStatus.CREATED,
      'StorageFile created successfully',
    );
  }
}
