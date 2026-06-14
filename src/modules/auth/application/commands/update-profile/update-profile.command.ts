import { UpdateProfileDto } from '../../dtos/update-profile.dto';
interface FileUpload {
  originalname: string;
  size: number;
  mimetype: string;
}
export class UpdateProfileCommand<T extends FileUpload> {
  constructor(
    public readonly update_profile_dto: UpdateProfileDto<T>,
    public readonly provider_storage_code: string,
  ) {}
}
