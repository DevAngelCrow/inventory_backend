import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../persistence/prisma/prisma.service';
import { TransactionContextService } from '../services/transaction-context.service';
import { from, lastValueFrom, Observable } from 'rxjs';
import { TRANSACTIONAL_KEY } from '../decorators/transactional.decorator';

@Injectable()
export class TransactionInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
    private readonly transactionContext: TransactionContextService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const isTransactional = this.reflector.get<boolean>(
      TRANSACTIONAL_KEY,
      context.getHandler(),
    );
    if (!isTransactional) {
      return next.handle();
    }
    const executeTransaction = async (): Promise<unknown> => {
      const result: unknown = await this.prisma.$transaction(
        async (prisma): Promise<unknown> => {
          const transactionResult: unknown = await this.transactionContext.run(
            prisma,
            async (): Promise<unknown> => {
              return await lastValueFrom(next.handle());
            },
          );
          return transactionResult;
        },
      );
      return result;
    };
    return from(executeTransaction());
  }
}
