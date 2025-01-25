import { Controller, Get, Post, Body, Put, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { DocumentTypesService } from './document-types.service';
import { DocumentType } from './entities/document-type.entity';
import { CreateDocumentTypeDto } from './dto/create-document-type.dto';
import { UpdateDocumentTypeDto } from './dto/update-document-type.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('document-types')
@UseGuards(JwtAuthGuard)
export class DocumentTypesController {
  constructor(private readonly documentTypesService: DocumentTypesService) {}
  
  @Get('inactive')
  findInactive(): Promise<DocumentType[]> {
    return this.documentTypesService.findInactive();
  }

  @Get()
  findAll(): Promise<DocumentType[]> {
    return this.documentTypesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<DocumentType> {
    return this.documentTypesService.findOne(id);
  }

  @Post()
  create(@Body() createDocumentTypeDto: CreateDocumentTypeDto): Promise<DocumentType> {
    return this.documentTypesService.create(createDocumentTypeDto);
  }

  @Put('reactivate/:id')
  reactivate(@Param('id', ParseIntPipe) id: number): Promise<DocumentType> {
    return this.documentTypesService.reactivate(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDocumentTypeDto: UpdateDocumentTypeDto,
  ): Promise<DocumentType> {
    return this.documentTypesService.update(id, updateDocumentTypeDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.documentTypesService.softDelete(id);
  }
}