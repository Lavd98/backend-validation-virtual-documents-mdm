import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  validateToken(token: string): { valid: boolean; expired: boolean } {
    try {
      const decoded = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      return { valid: true, expired: false };
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return { valid: false, expired: true };
      }
      return { valid: false, expired: false };
    }
  }
}
