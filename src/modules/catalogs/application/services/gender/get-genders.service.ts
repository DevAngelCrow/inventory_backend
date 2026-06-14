import { Pagination } from '@/shared/domain/value-object/pagination';
import { GenderDto } from '../../dtos/gender.dto';
import { GetGendersHandler } from '../../gender/queries/get-genders/get-genders.handler';
import { GetGendersQuery } from '../../gender/queries/get-genders/get-genders.query';

export class GetGendersService {
  constructor(private readonly getGendersHandler: GetGendersHandler) {}

  async run(
    query: GetGendersQuery,
  ): Promise<Pagination<GenderDto> | GenderDto[]> {
    return await this.getGendersHandler.execute(query);
  }
}
