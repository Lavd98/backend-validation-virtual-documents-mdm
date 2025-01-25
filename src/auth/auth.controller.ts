import {
  Controller,
  Post,
  UseGuards,
  Request,
  HttpStatus,
  HttpCode,
  Body,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { TokenService } from './token.service';

@Controller('auth')
export class AuthController {
  usersService: any;
  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
  ) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('validate-token')
  validateToken(@Body('Token') token: string) {
    return this.tokenService.validateToken(token);
  }

  //End point para crear usuarios sin token
  // @Post('register')
  // async register(@Body() createUserDto: CreateUserDto) {
  //   const user = await this.usersService.create(createUserDto);
  //   return this.authService.login(user);
  // }
}
