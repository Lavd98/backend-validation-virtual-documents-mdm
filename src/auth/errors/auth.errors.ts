import { UnauthorizedException, BadRequestException } from '@nestjs/common';

export class AuthErrors {
  static invalidCredentials() {
    throw new BadRequestException({
      message: "Invalid login credentials",
      errors: [
        {
          code: "INVALID_CREDENTIALS",
          field: "password",
          message: "The provided password is incorrect"
        }
      ]
    });
  }

  static authenticationFailed() {
    throw new UnauthorizedException({
      message: "Authentication failed",
      errors: [
        {
          code: "AUTHENTICATION_FAILED",
          message: "Invalid username or password"
        }
      ]
    });
  }
}