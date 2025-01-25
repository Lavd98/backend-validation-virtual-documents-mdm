import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { AuthErrors } from './errors/auth.errors';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);
    if (!user) {
      AuthErrors.authenticationFailed();
    }

    const isPasswordValid = await bcrypt.compare(pass, user.Password);
    if (!isPasswordValid) {
      AuthErrors.invalidCredentials();
    }

    const { Password, ...result } = user;
    return result;
  }

  async login(user: User) {
    const payload = {
      Username: user.Username,
      sub: user.Id,
    };
    const token = this.jwtService.sign(payload, { expiresIn: '5s' });
    const { AreaId, ...userWithoutAreaId } = user;
    return {
      Token: token,
      User: {
        ...userWithoutAreaId,
      },
    };
  }
}
