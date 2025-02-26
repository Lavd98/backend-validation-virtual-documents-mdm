import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const databaseConfig = (configService: ConfigService): TypeOrmModuleOptions => {
    const connectionString = configService.get<string>('DATABASE_CONNECTION_STRING');
    if (connectionString) {
        return {
          type: 'mssql',
          url: connectionString,
          entities: [__dirname + '/../**/*.entity{.ts,.js}'],
          synchronize: false,
          autoLoadEntities: true,
          options: {
            encrypt: false,
            trustServerCertificate: true
          }
        };
      } else {
        return {
            type: 'mssql',
            host: configService.get<string>('DATABASE_HOST'),
            port: parseInt(configService.get<string>('DATABASE_PORT'), 10),
            username: configService.get<string>('DATABASE_USERNAME'),
            password: configService.get<string>('DATABASE_PASSWORD'),
            database: configService.get<string>('DATABASE_NAME'),
            entities: [__dirname + '/../**/*.entity{.ts,.js}'],
            synchronize: false,
            autoLoadEntities: true,
            options: {
              encrypt: true,
              trustServerCertificate: true
            },
        };
}
};