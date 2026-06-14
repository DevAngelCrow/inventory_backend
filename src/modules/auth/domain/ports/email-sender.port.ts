import { PersonEmail } from '@/modules/profile/domain/value-objects/person-value-object/person-email';
import { UserName } from '../../../identity-access-management/domain/value-objects/user-value-object/user-name';

export abstract class EmailSenderPort {
  abstract sendVerificationEmail(
    email: PersonEmail,
    user_name: UserName,
    verificationToken: {
      token: string;
      id: string;
    },
  ): Promise<void>;
  abstract sendForgottenPasswordEmail(
    email: PersonEmail,
    user_name: UserName,
    verificationToken: {
      token: string;
      id: string;
    },
  ): Promise<void>;
}
