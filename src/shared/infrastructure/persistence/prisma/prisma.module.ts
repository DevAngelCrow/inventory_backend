import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { TransactionContextService } from '../../services/transaction-context.service';

@Global()
@Module({
  providers: [PrismaService, TransactionContextService],
  exports: [PrismaService, TransactionContextService],
})
export class PrismaModule {}
