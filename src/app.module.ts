import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AreasModule } from './areas/areas.module';
import { DocumentTypesModule } from './document-types/document-types.module';
import { UsersModule } from './users/users.module';
import { DocumentsModule } from './documents/documents.module';
import { appConfig } from './config/app.config';
import { databaseConfig } from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot(appConfig),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: databaseConfig
    }),
    AuthModule,
    AreasModule,
    DocumentTypesModule,
    UsersModule,
    DocumentsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
