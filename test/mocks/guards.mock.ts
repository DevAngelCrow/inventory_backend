import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class MockJwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    request.user = { id: 'test-user-id', username: 'testuser' };
    return true;
  }
}

@Injectable()
export class MockPermissionsGuard implements CanActivate {
  canActivate(): boolean {
    return true;
  }
}
