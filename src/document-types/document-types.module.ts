import { Module } from '@nestjs/common';
import { DocumentTypesService } from './document-types.service';
import { DocumentTypesController } from './document-types.controller';
import { DocumentType } from './entities/document-type.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentsModule } from 'src/documents/documents.module';

@Module({
  imports: [TypeOrmModule.forFeature([DocumentType]), DocumentsModule],
  controllers: [DocumentTypesController],
  providers: [DocumentTypesService],
  exports: [DocumentTypesService]
})
export class DocumentTypesModule {}
