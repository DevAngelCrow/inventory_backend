import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

type SerializableValue = string | number | boolean | null | undefined;
type SerializableObject = { [key: string]: SerializableData };
type SerializableArray = SerializableData[];
type SerializableData =
  | SerializableValue
  | SerializableObject
  | SerializableArray;

/**
 * Interceptor para transformar BigInt a string antes de la serialización JSON
 * Soluciona el error: "Do not know how to serialize a BigInt"
 */
@Injectable()
export class BigIntTransformInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<SerializableData> {
    return next.handle().pipe(map((data) => this.transformBigInt(data)));
  }

  /**
   * Transforma recursivamente todos los BigInt en un objeto a strings
   * @param data - Datos a transformar
   * @returns Datos con BigInt convertidos a string
   */
  private transformBigInt(data: unknown): SerializableData {
    if (data === null || data === undefined) {
      return data;
    }

    // Si es BigInt, convertir a string
    if (typeof data === 'bigint') {
      return data.toString();
    }

    // Si es un array, transformar cada elemento
    if (Array.isArray(data)) {
      return data.map((item) => this.transformBigInt(item));
    }

    // Si es un objeto (incluye Date, pero Date.toJSON() maneja la serialización)
    if (typeof data === 'object') {
      // Manejar objetos Date sin transformarlos
      if (data instanceof Date) {
        return data.toISOString();
      }

      // Transformar cada propiedad del objeto
      const transformed: SerializableObject = {};
      for (const [key, value] of Object.entries(data)) {
        transformed[key] = this.transformBigInt(value);
      }
      return transformed;
    }

    if (
      typeof data === 'string' ||
      typeof data === 'number' ||
      typeof data === 'boolean'
    ) {
      return data;
    }

    return undefined;
  }
}
