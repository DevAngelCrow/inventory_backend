import { MenuActive } from '../value-objects/menu-value-object/menu-active';
import { MenuChildren } from '../value-objects/menu-value-object/menu-children';
import { MenuDescription } from '../value-objects/menu-value-object/menu-description';
import { MenuIcon } from '../value-objects/menu-value-object/menu-icon';
import { MenuId } from '../value-objects/menu-value-object/menu-id';
import { MenuName } from '../value-objects/menu-value-object/menu-name';
import { MenuOrder } from '../value-objects/menu-value-object/menu-order';
import { MenuParent } from '../value-objects/menu-value-object/menu-parent';
import { MenuRequiredAuth } from '../value-objects/menu-value-object/menu-required-auth';
import { MenuShow } from '../value-objects/menu-value-object/menu-show';
import { MenuTitle } from '../value-objects/menu-value-object/menu-title';
import { MenuUri } from '../value-objects/menu-value-object/menu-uri';

export class Menu<T> {
  constructor(
    private readonly active: MenuActive,
    private readonly children: MenuChildren<T>[],
    private readonly description: MenuDescription,
    private readonly icon: MenuIcon,
    private readonly name: MenuName,
    private readonly order: MenuOrder,
    private readonly parent: MenuParent<T>,
    private readonly required_auth: MenuRequiredAuth,
    private readonly show: MenuShow,
    private readonly title: MenuTitle,
    private readonly uri: MenuUri,
    private readonly id?: MenuId,
  ) {}
  public static create<T>(data: {
    id?: string;
    name: string;
    title: string;
    description: string;
    icon: string;
    uri: string;
    order: number;
    active: boolean;
    show: boolean;
    required_auth: boolean;
    parent: T;
    children: T[];
  }): Menu<T> {
    const childrens = data.children.map((c) => new MenuChildren<T>(c));
    return new Menu<T>(
      new MenuActive(data.active),
      childrens,
      new MenuDescription(data.description),
      new MenuIcon(data.icon),
      new MenuName(data.name),
      new MenuOrder(data.order),
      new MenuParent<T>(data.parent),
      new MenuRequiredAuth(data.required_auth),
      new MenuShow(data.show),
      new MenuTitle(data.title),
      new MenuUri(data.uri),
      data.id ? new MenuId(data.id) : undefined,
    );
  }
  getActive(): MenuActive {
    return this.active;
  }
  getChildren(): MenuChildren<T>[] {
    return this.children;
  }
  getDescription(): MenuDescription {
    return this.description;
  }
  getIcon(): MenuIcon {
    return this.icon;
  }
  getName(): MenuName {
    return this.name;
  }
  getOrder(): MenuOrder {
    return this.order;
  }
  getParent(): MenuParent<T> {
    return this.parent;
  }
  getRequiredAuth(): MenuRequiredAuth {
    return this.required_auth;
  }
  getShow(): MenuShow {
    return this.show;
  }
  getTitle(): MenuTitle {
    return this.title;
  }
  getUri(): MenuUri {
    return this.uri;
  }
  getId(): MenuId | undefined {
    return this.id;
  }
}
