import { Abstract, Type } from '@nestjs/common';

export function registerService<T>(
  useCaseClass: Type<T>,
  dependencies: Array<Type<unknown> | Abstract<unknown> | string>,
) {
  return {
    provide: useCaseClass,
    useFactory: (...deps: unknown[]): T => {
      return Reflect.construct(useCaseClass, deps);
    },
    inject: dependencies,
  };
}
