import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { DocumentType } from './entities/document-type.entity';
import { CreateDocumentTypeDto } from './dto/create-document-type.dto';
import { UpdateDocumentTypeDto } from './dto/update-document-type.dto';

@Injectable()
export class DocumentTypesService {
  constructor(
    @InjectRepository(DocumentType)
    private documentTypeRepository: Repository<DocumentType>,
  ) {}

  async findAll(): Promise<DocumentType[]> {
    return await this.documentTypeRepository.find({
      where: { isActive: true },
      order: { Id: 'DESC' }
    });
  }

  async findOne(id: number): Promise<DocumentType> {
    const documentType = await this.documentTypeRepository.findOne({
      where: { Id: id, isActive: true }
    });
    if (!documentType) {
      throw new NotFoundException(`Tipo de documento con ID ${id} no encontrado`);
    }
    return documentType;
  }

  async create(createDocumentTypeDto: CreateDocumentTypeDto): Promise<DocumentType> {
    const existingDocument = await this.documentTypeRepository.findOne({
      where: {
        Name: createDocumentTypeDto.Name.trim(),
        isActive: true
      }
    });

    if (existingDocument) {
      throw new ConflictException(`Ya existe un tipo de documento con el nombre ${createDocumentTypeDto.Name}`);
    }
    
    const documentType = this.documentTypeRepository.create(createDocumentTypeDto);
    return await this.documentTypeRepository.save(documentType);
  }

  async update(id: number, updateDocumentTypeDto: UpdateDocumentTypeDto): Promise<DocumentType> {
    const documentType = await this.findOne(id);

    const existingDocument = await this.documentTypeRepository.findOne({
      where: {
        Name: updateDocumentTypeDto.Name.trim(),
        isActive: true,
        Id: Not(id)
      }
    });

    if (existingDocument) {
      throw new ConflictException(`Ya existe un tipo de documento con el nombre ${updateDocumentTypeDto.Name}`);
    }

    this.documentTypeRepository.merge(documentType, updateDocumentTypeDto);
    return await this.documentTypeRepository.save(documentType);
  }

  async softDelete(id: number): Promise<void> {
    const documentType = await this.findOne(id);
    documentType.isActive = false;
    await this.documentTypeRepository.save(documentType);
  }

  async findInactive(): Promise<DocumentType[]> {
    return await this.documentTypeRepository.find({
      where: { isActive: false },
      order: { Id: 'DESC' }
    });
  }
  
  async reactivate(id: number): Promise<DocumentType> {
    const documentType = await this.documentTypeRepository.findOne({
      where: { Id: id, isActive: false }
    });
    
    if (!documentType) {
      throw new NotFoundException(`Inactive document type with ID ${id} not found`);
    }

    const existingActive = await this.documentTypeRepository.findOne({
      where: {
        Name: documentType.Name.trim(),
        isActive: true
      }
    });
  
    if (existingActive) {
      throw new ConflictException(
        `No se puede reactivar. Ya existe un tipo de documento activo con el nombre ${documentType.Name}`
      );
    }
    
    documentType.isActive = true;
    return await this.documentTypeRepository.save(documentType);
  }
}