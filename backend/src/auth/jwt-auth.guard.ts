// src/auth/jwt-auth.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // 여기에 JWT 유효성 검증 로직을 구현하세요
    // 임시로 모든 요청을 허용하도록 true를 반환합니다
    return true;
  }
}
