import { plainToInstance, Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
  validateSync,
} from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}
const toBoolean = ({ value }: { value: unknown }) => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (normalized === 'true') return true;
    if (normalized === 'false') return false;
  }
  return value;
};
const toNumber = ({ value }: { value: unknown }) => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string' && value.trim() !== '') {
    return Number(value);
  }
  return value;
};
export class EnvironmentVariables {
  @IsEnum(Environment)
  @IsNotEmpty()
  NODE_ENV!: Environment;

  @Transform(toBoolean)
  @IsBoolean()
  SHOW_STACK_TRACE!: boolean;

  @Transform(toNumber)
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  PORT!: number;

  @IsString()
  @IsNotEmpty()
  DB_HOST!: string;

  @IsString()
  @IsNotEmpty()
  DB_USER!: string;

  @IsString()
  @IsNotEmpty()
  DB_PASSWORD!: string;

  @IsString()
  @IsNotEmpty()
  DB_NAME!: string;

  @Transform(toNumber)
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  DB_PORT!: number;

  @IsString()
  @IsNotEmpty()
  DB_PROVIDER!: string;

  @IsString()
  @IsOptional()
  DATABASE_DIRECT_URL?: string;

  @IsOptional()
  @Transform(toNumber)
  @IsNumber()
  @IsPositive()
  DATABASE_POOL_MAX?: number;

  @IsOptional()
  @Transform(toNumber)
  @IsNumber()
  @IsPositive()
  DATABASE_POOL_IDLE_TIMEOUT_MS?: number;

  @IsOptional()
  @Transform(toNumber)
  @IsNumber()
  @IsPositive()
  DATABASE_POOL_CONN_TIMEOUT_MS?: number;

  @IsString()
  @IsNotEmpty()
  PROVIDER_STORAGE_CODE!: string;

  // S3 backend — only required when PROVIDER_STORAGE_CODE=S3. All optional so
  // the LOCAL default keeps working without these. The S3StorageBackend throws
  // at construction time if it's selected without REGION/BUCKET.
  @IsOptional()
  @IsString()
  S3_REGION?: string;

  @IsOptional()
  @IsString()
  S3_BUCKET?: string;

  @IsOptional()
  @IsString()
  S3_ENDPOINT?: string;

  @IsOptional()
  @IsString()
  S3_ACCESS_KEY_ID?: string;

  @IsOptional()
  @IsString()
  S3_SECRET_ACCESS_KEY?: string;

  @IsOptional()
  @IsString()
  S3_FORCE_PATH_STYLE?: string;

  @IsOptional()
  @IsString()
  S3_PUBLIC_BASE_URL?: string;

  @IsOptional()
  @IsString()
  S3_KEY_PREFIX?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(32, {
    message: 'JWT_SECRET must be at least 32 characters long',
  })
  JWT_SECRET!: string;

  @IsString()
  @IsNotEmpty()
  JWT_EXPIRES_IN!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(32, {
    message: 'JWT_REFRESH_SECRET must be at least 32 characters long',
  })
  JWT_REFRESH_SECRET!: string;

  @IsString()
  @IsNotEmpty()
  JWT_REFRESH_EXPIRES_IN!: string;

  @IsOptional()
  @IsString()
  EMAIL_HOST?: string;

  @IsOptional()
  @Transform(toNumber)
  @IsNumber()
  @IsPositive()
  EMAIL_PORT?: number;

  @IsOptional()
  @IsString()
  EMAIL_USER?: string;

  @IsOptional()
  @IsString()
  EMAIL_PASSWORD?: string;

  @IsOptional()
  @IsString()
  EMAIL_FROM?: string;

  @IsOptional()
  @IsString()
  EMAIL_SECRET?: string;

  @IsString()
  @IsNotEmpty()
  APP_URL!: string;

  @IsString()
  @IsNotEmpty()
  API_URL!: string;

  @IsString()
  @IsNotEmpty()
  CLIENT_URL!: string;

  // Comma-separated list of additional allowed CORS origins.
  // Example: https://app.domain.com,https://admin.domain.com
  // When set, these origins are added to CLIENT_URL. When absent, only CLIENT_URL is allowed.
  @IsOptional()
  @IsString()
  CORS_ORIGINS?: string;

  @IsOptional()
  @IsString()
  CLIENT_FORGOTTEN_PASSWORD?: string;

  @IsOptional()
  @IsString()
  CLIENT_VERIFY_EMAIL_ROUTE?: string;

  @IsString()
  @IsNotEmpty()
  REDIS_HOST!: string;

  @Transform(toNumber)
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  REDIS_PORT!: number;

  @IsString()
  @IsNotEmpty()
  REDIS_URL!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(12, {
    message: 'REDIS_PASSWORD must be at least 12 characters long',
  })
  REDIS_PASSWORD!: string;

  @Transform(toNumber)
  @IsNumber()
  @IsPositive()
  THROTTLE_LOGIN_TTL!: number;

  @Transform(toNumber)
  @IsNumber()
  @IsPositive()
  THROTTLE_LOGIN_LIMIT!: number;

  @Transform(toNumber)
  @IsNumber()
  @IsPositive()
  THROTTLE_GLOBAL_TTL!: number;

  @Transform(toNumber)
  @IsNumber()
  @IsPositive()
  THROTTLE_GLOBAL_LIMIT!: number;

  @IsOptional()
  @Transform(toBoolean)
  @IsBoolean()
  ENABLE_API_DOCS?: boolean;

  // Account lockout (2B). Default: 5 attempts, 15-minute lockout.
  @IsOptional()
  @Transform(toNumber)
  @IsNumber()
  @IsPositive()
  AUTH_MAX_LOGIN_ATTEMPTS?: number;

  @IsOptional()
  @Transform(toNumber)
  @IsNumber()
  @IsPositive()
  AUTH_LOCKOUT_MINUTES?: number;

  // Password history (2C). How many previous passwords to block reuse of.
  @IsOptional()
  @Transform(toNumber)
  @IsNumber()
  @IsPositive()
  PASSWORD_HISTORY_COUNT?: number;
}

export const validate = (config: Record<string, unknown>) => {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: false,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
};
