import { Injectable } from '@nestjs/common';
import { VerificationTokenRepository } from '../../domain/repositories/verification-token-repository';
import { UserId } from '../../../identity-access-management/domain/value-objects/user-value-object/user-id';
import { PrismaService } from '@/shared/infrastructure/persistence/prisma/prisma.service';
import { DatabaseException } from '@/shared/infrastructure/exceptions/database.exception';
import { TransactionContextService } from '@/shared/infrastructure/services/transaction-context.service';
import { randomBytes } from 'node:crypto';
import { PasswordHasher } from '../services/password-hasher.service';

@Injectable()
export class ImplVerificationTokenRepository implements VerificationTokenRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly transactionContext: TransactionContextService,
  ) {}
  async markAsUsed(id_token: string): Promise<void> {
    try {
      const prisma = this.getPrismaClient();
      await prisma.mnt_email_verification_tokens.update({
        where: { id: id_token },
        data: {
          used_at: new Date(),
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error deleting verification token: ${error.message}`);
      }
      throw new DatabaseException(
        'Unknown database error occurred while deleting verification token.',
      );
    }
  }
  async createTokenForForgottenPassword(
    user_id: UserId,
  ): Promise<{ token: string; id: string }> {
    const token = randomBytes(32).toString('hex');
    const hashedToken = await new PasswordHasher().hash(token);
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15);
    const prisma = this.getPrismaClient();
    await prisma.mnt_email_verification_tokens.deleteMany({
      where: {
        id_user: user_id.value(),
        used_at: null,
        is_reset_password: true,
      },
    });
    const result = await prisma.mnt_email_verification_tokens.create({
      data: {
        id_user: user_id.value(),
        token: hashedToken,
        expires_at: expiresAt,
        is_reset_password: true,
      },
    });
    return { token, id: result.id.toString() };
  }
  private getPrismaClient() {
    return this.transactionContext.getTransaction() ?? this.prisma;
  }
  async create(user_id: UserId): Promise<{ token: string; id: string }> {
    try {
      const token = randomBytes(32).toString('hex');
      const hashedToken = await new PasswordHasher().hash(token);
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 3);
      const prisma = this.getPrismaClient();
      const result = await prisma.mnt_email_verification_tokens.create({
        data: {
          id_user: user_id.value(),
          token: hashedToken,
          expires_at: expiresAt,
        },
      });
      return { token, id: result.id.toString() };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error creating verification token: ${error.message}`);
      }
      throw new DatabaseException(
        'Unknown database error occurred while creating verification token.',
      );
    }
  }
  async findByToken(
    id: string,
    token: string,
  ): Promise<{ user_id: UserId; expires_at: Date; id: string } | null> {
    try {
      const prisma = this.getPrismaClient();
      const record = await prisma.mnt_email_verification_tokens.findUnique({
        where: { id },
      });
      if (!record) {
        return null;
      }
      if (record.expires_at < new Date()) return null;
      if (record.used_at !== null) return null;
      const verificationToken = await new PasswordHasher().compare(
        token,
        record.token,
      );
      if (!verificationToken) return null;
      return {
        user_id: new UserId(record.id_user),
        expires_at: record.expires_at,
        id: record.id,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error finding verification token: ${error.message}`);
      }
      throw new DatabaseException(
        'Unknown database error occurred while finding verification token.',
      );
    }
  }
  async deleteByUserId(
    user_id: UserId,
    is_reset_password?: boolean,
  ): Promise<void> {
    try {
      const prisma = this.getPrismaClient();
      await prisma.mnt_email_verification_tokens.deleteMany({
        where: {
          id_user: user_id.value(),
          used_at: { not: null },
          is_reset_password,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error deleting verification token: ${error.message}`);
      }
      throw new DatabaseException(
        'Unknown database error occurred while deleting verification token.',
      );
    }
  }
}
