/**
 * Utilidades para trabajar con BigInt
 * Proporciona funciones helper para conversiones manuales cuando sea necesario
 */

/**
 * Convierte un BigInt a string de forma segura
 * @param value - Valor BigInt a convertir
 * @returns String representation del BigInt
 */
export function bigIntToString(
  value: bigint | null | undefined,
): string | null {
  if (value === null || value === undefined) {
    return null;
  }
  return value.toString();
}

/**
 * Convierte un BigInt a number de forma segura
 * ADVERTENCIA: Solo usar si el valor cabe en un Number (hasta 2^53 - 1)
 * @param value - Valor BigInt a convertir
 * @returns Number representation del BigInt
 * @throws Error si el valor es demasiado grande para un Number
 */
export function bigIntToNumber(
  value: bigint | null | undefined,
): number | null {
  if (value === null || value === undefined) {
    return null;
  }

  const num = Number(value);

  // Verificar si el valor se puede representar con precisión como number
  if (value > Number.MAX_SAFE_INTEGER || value < Number.MIN_SAFE_INTEGER) {
    throw new Error(
      `BigInt value ${value} is too large to convert to number safely. Use bigIntToString() instead.`,
    );
  }

  return num;
}

/**
 * Convierte un string o number a BigInt de forma segura
 * @param value - Valor a convertir
 * @returns BigInt representation del valor
 */
export function toBigInt(value: string | number | bigint): bigint {
  if (typeof value === 'bigint') {
    return value;
  }
  return BigInt(value);
}

type TransformedValue = string | number | boolean | null | undefined | Date;
type TransformedObject = { [key: string]: TransformedData };
type TransformedArray = TransformedData[];
type TransformedData = TransformedValue | TransformedObject | TransformedArray;

/**
 * Transforma recursivamente todos los BigInt en un objeto a strings
 * Útil para conversiones manuales en DTOs o mappers
 * @param data - Datos a transformar
 * @returns Datos con BigInt convertidos a string
 */
export function transformBigIntToString(data: unknown): TransformedData {
  if (data === null || data === undefined) {
    return data;
  }

  if (typeof data === 'bigint') {
    return data.toString();
  }

  if (Array.isArray(data)) {
    return data.map((item) => transformBigIntToString(item));
  }

  if (typeof data === 'object') {
    if (data instanceof Date) {
      return data;
    }

    const transformed: TransformedObject = {};
    for (const key in data) {
      if (Object.hasOwn(data, key)) {
        transformed[key] = transformBigIntToString(
          data[key as keyof typeof data],
        );
      }
    }
    return transformed;
  }

  return data as TransformedValue;
}
