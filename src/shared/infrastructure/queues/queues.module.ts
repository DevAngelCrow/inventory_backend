import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const isProduction =
          configService.get<string>('NODE_ENV') === 'production';
        if (isProduction) {
          return {
            connection: {
              url: configService.get<string>('REDIS_URL'),
            },
          };
        }
        const password = configService.get<string>('REDIS_PASSWORD');
        return {
          connection: {
            host: configService.get<string>('REDIS_HOST'),
            port: configService.get<number>('REDIS_PORT'),
            ...(password ? { password } : {}),
          },
        };
      },
    }),
  ],
})
export class QueuesModule {}
