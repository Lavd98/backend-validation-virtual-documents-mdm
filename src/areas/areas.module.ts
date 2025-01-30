import { Module } from '@nestjs/common';
import { AreasService } from './areas.service';
import { AreasController } from './areas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Area } from './entities/area.entity';
import { DocumentsModule } from 'src/documents/documents.module';

@Module({
  imports: [TypeOrmModule.forFeature([Area]), DocumentsModule],
  controllers: [AreasController],
  providers: [AreasService],
  exports: [AreasService]
})
export class AreasModule {}
