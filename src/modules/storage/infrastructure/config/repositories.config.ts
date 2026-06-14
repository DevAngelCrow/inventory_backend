import { ProviderStorageRepository } from '../../domain/repositories/provider-storage.repository';
import { StorageFilesRepository } from '../../domain/repositories/storage-files.repository';
import { ImplProviderStorageRepository } from '../implementation/impl-provider-storage.repository';
import { ImplStorageFilesRepository } from '../implementation/impl-storage-files.repository';
import { ProviderStorageQueriesRepository } from '../../application/repositories/provider-storage-read.repository';
import { ImplProviderStorageQueriesRepository } from '../implementation/impl-provider-storage-queries.repository';
import { StorageFileReaderPort } from '../../domain/ports/storage-file-reader.port';
import { ImplStorageFileReaderPort } from '../implementation/impl-storage-file-reader.port';

export const repositories = [
  {
    provide: ProviderStorageRepository,
    useClass: ImplProviderStorageRepository,
  },
  {
    provide: ProviderStorageQueriesRepository,
    useClass: ImplProviderStorageQueriesRepository,
  },
  {
    provide: StorageFilesRepository,
    useClass: ImplStorageFilesRepository,
  },
  {
    provide: StorageFileReaderPort,
    useClass: ImplStorageFileReaderPort,
  },
];
