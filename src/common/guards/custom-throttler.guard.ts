// src/common/guards/custom-throttler.guard.ts
import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  protected async getTracker(req: Record<string, any>): Promise<string> {
    // If authenticated, use user.id / userId; fallback to IP.
    if (req.user && (req.user.userId || req.user.id)) {
      return req.user.userId ?? req.user.id;
    }

    // default: IP address (or some fallback)
    return req.ip || req.headers['x-forwarded-for'] || 'anonymous';
  }
}
