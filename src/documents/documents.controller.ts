import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { DocumentsService } from './documents.service';
import { Document } from '../documents/entities/document.entity';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Get('inactive')
  findInactive(): Promise<Document[]> {
    return this.documentsService.findInactive();
  }

  @Get('basic/:code')
  findBasicInfo(@Param('code') code: string) {
    return this.documentsService.findBasicInfo(code);
  }

  @Get('area/:areaId')
  findByArea(
    @Param('areaId', ParseIntPipe) areaId: number,
  ): Promise<Document[]> {
    return this.documentsService.findByArea(areaId);
  }

  @Get('area/:areaId/inactive')
  findByAreaInactive(
    @Param('areaId', ParseIntPipe) areaId: number,
  ): Promise<Document[]> {
    return this.documentsService.findByAreaInactive(areaId);
  }

  @Get()
  findAll(): Promise<Document[]> {
    return this.documentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Document> {
    return this.documentsService.findOne(id);
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Body() createDocumentDto: CreateDocumentDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Document> {
    return this.documentsService.create(createDocumentDto, file);
  }

  @Put('reactivate/:id')
  reactivate(@Param('id', ParseIntPipe) id: number): Promise<Document> {
    return this.documentsService.reactivate(id);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('file'))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDocumentDto: UpdateDocumentDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<Document> {
    return this.documentsService.update(id, updateDocumentDto, file);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.documentsService.softDelete(id);
  }
}
