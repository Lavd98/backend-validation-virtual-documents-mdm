import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service'; // Import UsersService

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService, // Inject UsersService
  ) {}

  validateToken(token: string): { Valid: boolean; Expired: boolean } {
    try {
      this.jwtService.verify(token, {
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

  async newToken(token: string) {
    try {
      const decoded = this.jwtService.decode(token);
      const { Username } = decoded;
      const user = await this.usersService.findByUsername(Username);

      if (!user) {
        throw new Error('User not found');
      }

      const payload = {
        Username: user.Username,
        sub: user.Id,
      };

      const newToken = this.jwtService.sign(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: '10m',
      });
      const { AreaId, ...userWithoutAreaId } = user;
      return {
        Token: newToken,
        User: userWithoutAreaId,
      };
    } catch (error) {
      console.log(error);
      throw new Error('Failed to generate new token');
    }
  }
}
