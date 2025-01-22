import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpException, HttpStatus } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface Response<T> {
  code: number;
  success: boolean;
  message: string;
  data?: T;
  errors?: any[];
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(
      map(data => this.handleSuccess(context, data)),
      // catchError(err => this.handleError(err))
    );
  }

  private handleSuccess(context: ExecutionContext, data: any): Response<T> {
    const statusCode = context.switchToHttp().getResponse().statusCode;
    return {
      code: statusCode,
      success: true,
      message: this.getDefaultMessageForStatus(statusCode),
      data: data || null
    };
  }

  private handleError(err: any): Observable<never> {
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errors = null;

    if (err instanceof HttpException) {
      status = err.getStatus();
      const response = err.getResponse() as any;
      message = response.message || err.message;
      errors = response.errors || null;
    }

    const errorResponse: Response<null> = {
      code: status,
      success: false,
      message: message,
      errors: errors
    };

    return throwError(() => errorResponse);
  }

  private getDefaultMessageForStatus(status: number): string {
    switch (status) {
      case HttpStatus.OK:
        return 'Operation successful';
      case HttpStatus.CREATED:
        return 'Resource created successfully';
      case HttpStatus.NO_CONTENT:
        return 'Action completed successfully, but no content to return';
      default:
        return 'Operation completed';
    }
  }
}