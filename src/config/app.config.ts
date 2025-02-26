import { ConfigModuleOptions } from '@nestjs/config';

export const appConfig: ConfigModuleOptions = {
  isGlobal: true,
  envFilePath: `.env.${process.env.NODE_ENV || 'development'}`
};