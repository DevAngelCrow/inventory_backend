import { GlobalStatusDto } from '@/modules/catalogs/application/dtos/global-status.dto';
import { Route } from '@/modules/security/domain/entities/route';

export class RouteHttpDto<T = unknown> {
  constructor(
    public readonly name: string,
    public readonly description: string,
    public readonly icon: string,
    public readonly uri: string,
    public readonly active: boolean,
    public readonly show: boolean,
    public readonly order: number,
    public readonly required_auth: boolean,
    public readonly id?: string,
    public readonly title?: string,
    public readonly permissions?: T[],
    public readonly children?: RouteHttpDto<T>[],
    public readonly parent?: RouteHttpDto<T>,
    public readonly permissions_id?: string[],
    public readonly status?: GlobalStatusDto,
  ) {}
  public static fromEntity(route: Route): RouteHttpDto {
    return new RouteHttpDto(
      route.getName().value(),
      route.getDescription().value(),
      route.getIcon().value(),
      route.getUri().value(),
      route.getActive().value(),
      route.getShow().value(),
      route.getOrder().value(),
      route.getRequiredAuth().value(),
      route.getId() ? route.getId()?.value() : undefined,
      route.getTitle() ? route.getTitle()?.value() : undefined,
      route.getPermissionsId(),
    );
  }
  public static fromDto<T>(dto: RouteHttpDto<T>): RouteHttpDto<T> {
    return new RouteHttpDto(
      dto.name,
      dto.description,
      dto.icon,
      dto.uri,
      dto.active,
      dto.show,
      dto.order,
      dto.required_auth,
      dto.id,
      dto.title,
      dto.permissions,
      dto.children ?? dto.children,
      dto.parent ?? dto.parent,
      dto.permissions_id,
      dto.status,
    );
  }
}
