import { MenuHttpDto } from './menu-http.dto';

export class MenuUserResponseDto<T> {
  constructor(
    public readonly menus: MenuHttpDto<T>[],
    public readonly profile_img: string | null,
  ) {}
}
