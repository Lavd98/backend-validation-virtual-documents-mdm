import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
  } from '@nestjs/common';
  import { HttpAdapterHost } from '@nestjs/core';
  
  @Catch()
  export class AllExceptionsFilter implements ExceptionFilter {
    constructor(private readonly httpAdapterHost: HttpAdapterHost) {}
  
    catch(exception: unknown, host: ArgumentsHost): void {
      const { httpAdapter } = this.httpAdapterHost;
      const ctx = host.switchToHttp();
  
      let status = HttpStatus.INTERNAL_SERVER_ERROR;
      let message = 'Internal server error';
      let errors = null;
  
      if (exception instanceof HttpException) {
        status = exception.getStatus();
        const response = exception.getResponse() as any;
        message = response.message || exception.message;
        errors = response.errors || null;
      }
  
      const responseBody = {
        code: status,
        success: false,
        message: message,
        errors: errors,
      };
  
      httpAdapter.reply(ctx.getResponse(), responseBody, status);
    }
  }