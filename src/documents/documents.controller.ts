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
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { DocumentsService } from './documents.service';
import { Document } from '../documents/entities/document.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Get('inactive')
  @UseGuards(JwtAuthGuard)
  findInactive(): Promise<Document[]> {
    return this.documentsService.findInactive();
  }

  @Get('basic/:code')
  findBasicInfo(@Param('code') code: string) {
    return this.documentsService.findBasicInfo(code);
  }

  @Get('area/:areaId')
  @UseGuards(JwtAuthGuard)
  findByArea(
    @Param('areaId', ParseIntPipe) areaId: number,
  ): Promise<Document[]> {
    return this.documentsService.findByArea(areaId);
  }

  @Get('area/:areaId/inactive')
  @UseGuards(JwtAuthGuard)
  findByAreaInactive(
    @Param('areaId', ParseIntPipe) areaId: number,
  ): Promise<Document[]> {
    return this.documentsService.findByAreaInactive(areaId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(): Promise<Document[]> {
    return this.documentsService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Document> {
    return this.documentsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Body() createDocumentDto: CreateDocumentDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<Document> {
    return this.documentsService.create(createDocumentDto, file);
  }

  @Put(':id/archivo')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Document> {
    return this.documentsService.uploadFile(id, file);
  }

  @Put('reactivate/:id')
  @UseGuards(JwtAuthGuard)
  reactivate(@Param('id', ParseIntPipe) id: number): Promise<Document> {
    return this.documentsService.reactivate(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDocumentDto: UpdateDocumentDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<Document> {
    return this.documentsService.update(id, updateDocumentDto, file);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.documentsService.softDelete(id);
  }
}
