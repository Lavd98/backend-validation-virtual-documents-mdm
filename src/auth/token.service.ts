import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  validateToken(token: string): { Valid: boolean; Expired: boolean } {
    try {
      const decoded = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      return { Valid: true, Expired: false };
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return { Valid: false, Expired: true };
      }
      return { Valid: false, Expired: false };
    }
  }
}
