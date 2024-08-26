import { ThrottlerGuard } from '@nestjs/throttler';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ThrottleByUserId extends ThrottlerGuard {
  protected async getTracker(req: Record<string, any>): Promise<string> {
    return req.get('user-id');
  }
}
