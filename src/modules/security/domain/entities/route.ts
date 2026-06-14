import { RoutesActive } from '../value-objects/routes-value-object/routes-active';
import { RoutesDescription } from '../value-objects/routes-value-object/routes-description';
import { RoutesIcon } from '../value-objects/routes-value-object/routes-icon';
import { RoutesId } from '../value-objects/routes-value-object/routes-id';
import { RoutesName } from '../value-objects/routes-value-object/routes-name';
import { RoutesOrder } from '../value-objects/routes-value-object/routes-order';
import { RoutesRquiredAuth } from '../value-objects/routes-value-object/routes-require-auth';
import { RoutesShow } from '../value-objects/routes-value-object/routes-show';
import { RoutesTitle } from '../value-objects/routes-value-object/routes-title';
import { RoutesUri } from '../value-objects/routes-value-object/routes-uri';

export class Route {
  constructor(
    private readonly name: RoutesName,
    private readonly description: RoutesDescription,
    private readonly icon: RoutesIcon,
    private readonly uri: RoutesUri,
    private readonly active: RoutesActive,
    private readonly show: RoutesShow,
    private readonly order: RoutesOrder,
    private readonly required_auth: RoutesRquiredAuth,
    private readonly id?: RoutesId,
    private readonly title?: RoutesTitle,
    private readonly id_parent?: RoutesId,
    private readonly permissions_id?: string[],
  ) {}
  public static create(data: {
    id?: string;
    name: string;
    title?: string;
    description: string;
    icon: string;
    uri: string;
    order: number;
    active: boolean;
    show: boolean;
    required_auth: boolean;
    id_parent?: string;
    permissions_id?: string[];
  }): Route {
    return new Route(
      new RoutesName(data.name),
      new RoutesDescription(data.description),
      new RoutesIcon(data.icon),
      new RoutesUri(data.uri),
      new RoutesActive(data.active),
      new RoutesShow(data.show),
      new RoutesOrder(data.order),
      new RoutesRquiredAuth(data.required_auth),
      data.id ? new RoutesId(data.id) : undefined,
      data.title ? new RoutesTitle(data.title) : undefined,
      data.id_parent ? new RoutesId(data.id_parent) : undefined,
      data.permissions_id,
    );
  }

  public getId(): RoutesId | undefined {
    return this.id;
  }
  public getName(): RoutesName {
    return this.name;
  }
  public getTitle(): RoutesTitle | undefined {
    return this.title;
  }
  public getDescription(): RoutesDescription {
    return this.description;
  }
  public getIcon(): RoutesIcon {
    return this.icon;
  }
  public getUri(): RoutesUri {
    return this.uri;
  }
  public getActive(): RoutesActive {
    return this.active;
  }
  public getShow(): RoutesShow {
    return this.show;
  }
  public getOrder(): RoutesOrder {
    return this.order;
  }
  public getIdParent(): RoutesId | undefined {
    return this.id_parent;
  }
  public getRequiredAuth(): RoutesRquiredAuth {
    return this.required_auth;
  }
  public getPermissionsId(): string[] | undefined {
    return this.permissions_id;
  }
}
