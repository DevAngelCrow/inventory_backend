import { AggregateRoot } from '@/shared/domain/aggregate-root';
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
import { RouteCreatedEvent } from '../events/route-created.event';
import { RouteUpdatedEvent } from '../events/route-updated.event';
import { RouteStatusToggledEvent } from '../events/route-status-toggled.event';

export class Route extends AggregateRoot {
  constructor(
    private name: RoutesName,
    private description: RoutesDescription,
    private icon: RoutesIcon,
    private uri: RoutesUri,
    private active: RoutesActive,
    private show: RoutesShow,
    private order: RoutesOrder,
    private required_auth: RoutesRquiredAuth,
    private id?: RoutesId,
    private title?: RoutesTitle,
    private id_parent?: RoutesId,
    private permissions_id?: string[],
  ) {
    super();
  }
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

  public created() {
    this.apply(
      new RouteCreatedEvent(
        this.id?.value(),
        this.name.value(),
        this.description.value(),
        this.icon.value(),
        this.uri.value(),
        this.active.value(),
        this.show.value(),
        this.order.value(),
        this.required_auth.value(),
      ),
    );
  }

  public update(
    name: RoutesName,
    description: RoutesDescription,
    icon: RoutesIcon,
    uri: RoutesUri,
    show: RoutesShow,
    order: RoutesOrder,
    required_auth: RoutesRquiredAuth,
    permissions_id?: string[],
  ) {
    this.name = name;
    this.description = description;
    this.icon = icon;
    this.uri = uri;
    this.show = show;
    this.order = order;
    this.required_auth = required_auth;
    this.permissions_id = permissions_id;
    this.apply(
      new RouteUpdatedEvent(
        this.name.value(),
        this.description.value(),
        this.icon.value(),
        this.uri.value(),
        this.show.value(),
        this.order.value(),
        this.required_auth.value(),
      ),
    );
  }

  public toggleStatus(newStatus: RoutesActive) {
    this.active = newStatus;
    this.apply(new RouteStatusToggledEvent(this.active.value()));
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
