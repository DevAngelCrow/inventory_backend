import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException } from '@/shared/domain/exceptions/bad-request.exception';
import { VerifyEmailCommand } from './verify-email.command';
import { UserRolDto } from '@/modules/security/application/dtos/user-rol.dto';
import { UserRepository } from '@/modules/identity-access-management/domain/repositories/user-repository';
import { UpdateOrCreateUserRoleService } from '@/modules/security/application/services/user-role/update-or-create-user-role.service';
import { GetRoleByCodeService } from '@/modules/security/application/services/user-role/get-rol-by-code.service';
import { VerificationTokenRepository } from '@/modules/auth/domain/repositories/verification-token-repository';

@CommandHandler(VerifyEmailCommand)
export class VerifyEmailHandler implements ICommandHandler<VerifyEmailCommand> {
  constructor(
    private readonly verificationTokenRepository: VerificationTokenRepository,
    private readonly userRepository: UserRepository,
    private readonly updateRoleUser: UpdateOrCreateUserRoleService,
    private readonly getRoleByCodeService: GetRoleByCodeService,
  ) {}
  public async execute(command: VerifyEmailCommand): Promise<void> {
    const tokenData = await this.verificationTokenRepository.findByToken(
      command.id,
      command.token,
    );
    if (!tokenData) {
      throw new BadRequestException('Invalid token');
    }
    if (new Date() > tokenData.expires_at) {
      throw new BadRequestException('Token has expired');
    }
    const userRole = 'USER';
    const role = await this.getRoleByCodeService.run(userRole);
    if (!role?.id) {
      throw new BadRequestException('Role not found');
    }
    const userRoleDto = new UserRolDto(tokenData.user_id.value(), [role?.id]);
    await this.userRepository.markEmailAsVerified(tokenData.user_id);
    await this.updateRoleUser.run(userRoleDto);
    await this.verificationTokenRepository.markAsUsed(command.id);
    await this.verificationTokenRepository.deleteByUserId(tokenData.user_id);
  }
}
