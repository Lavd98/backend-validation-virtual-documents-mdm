export interface Response<T> {
    code: number;
    success: boolean;
    message: string;
    data?: T;
    errors?: any[];
  }