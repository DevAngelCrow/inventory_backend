import { Menu } from '@/modules/security/domain/entities/menu';

export class MenuHttpDto<T> {
  constructor(
    public readonly active: boolean,
    public readonly children: T[],
    public readonly decription: string,
    public readonly icon: string,
    public readonly name: string,
    public readonly order: number,
    public readonly parent: T,
    public readonly required_auth: boolean,
    public readonly show: boolean,
    public readonly title: string,
    public readonly uri: string,
    public readonly id?: string,
  ) {}
  public static fromEntity<T>(menu: Menu<T>): MenuHttpDto<T> {
    const children = menu.getChildren().map((child) => child.value());
    return new MenuHttpDto(
      menu.getActive().value(),
      children,
      menu.getDescription().value(),
      menu.getIcon().value(),
      menu.getName().value(),
      menu.getOrder().value(),
      menu.getParent().value(),
      menu.getRequiredAuth().value(),
      menu.getShow().value(),
      menu.getTitle().value(),
      menu.getUri().value(),
      menu.getId() ? menu.getId()?.value() : undefined,
    );
  }
}
