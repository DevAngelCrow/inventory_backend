import { QUEUE_NAMES } from '@/shared/infrastructure/queues/queues.constants';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PersonEmail } from '@/modules/profile/domain/value-objects/person-value-object/person-email';
import { UserName } from '@/modules/identity-access-management/domain/value-objects/user-value-object/user-name';
import { ImplAuthPort } from '../implementation/auth-port-implementation/impl-auth.port';
import { PinoLogger } from 'nestjs-pino';

@Processor(QUEUE_NAMES.SEND_EMAIL_VERIFICATION)
export class EmailProcessor extends WorkerHost {
  constructor(
    private readonly emailService: ImplAuthPort,
    private readonly logger: PinoLogger,
  ) {
    super();
    this.logger.setContext(EmailProcessor.name);
  }

  async process(
    job: Job<{
      email: string;
      user_name: string;
      verificationToken: { id: string; token: string };
    }>,
  ) {
    try {
      const { email, user_name, verificationToken } = job.data;
      await this.emailService.sendVerificationEmail(
        new PersonEmail(email),
        new UserName(user_name),
        verificationToken,
      );
    } catch (error) {
      // Log only error name + message — never the full error (may include job
      // data with verification tokens) or job.data itself.
      this.logger.error(
        {
          jobId: job.id,
          jobName: job.name,
          attemptsMade: job.attemptsMade,
          errorName: error instanceof Error ? error.name : 'UnknownError',
          errorMessage:
            error instanceof Error ? error.message : 'Unknown error',
        },
        'Failed to process email job',
      );
      // Re-throw so BullMQ marks the job failed and applies retry/backoff
      // policy. Swallowing here masks delivery failures from observability.
      throw error;
    }
  }
}
