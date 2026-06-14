import { BooleanStatusData } from '../interfaces/boolean-status-data.interface';
import { BooleanStatus } from '../../domain/enums/boolean-status';
import { DatabaseException } from '../exceptions/database.exception';
import { GlobalStatusDto } from '@/modules/catalogs/application/dtos/global-status.dto';
export class StatusMapperUtil {
  static getStatusFromBoolean(
    isActive: boolean,
    catalog_status: Map<string, BooleanStatusData> | undefined,
    context: string = 'mapReadModelToDto',
  ): GlobalStatusDto | undefined {
    if (catalog_status === undefined) {
      return undefined;
    }
    const statusKey = isActive
      ? BooleanStatus.ACTIVE.toLocaleLowerCase()
      : BooleanStatus.INACTIVE.toLocaleLowerCase();
    const status = catalog_status.get(statusKey);
    if (!status) {
      throw new DatabaseException(
        `Status '${statusKey}' not found in catalog`,
        context,
      );
    }
    return new GlobalStatusDto(
      status.name,
      status.code,
      status.description,
      status.active,
      status.state_color,
      status.text_color,
      status.id_category_status,
      status.id,
      status.ctl_category_status,
    );
  }
}
