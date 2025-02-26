import {
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from '../documents/entities/document.entity';
import * as fs from 'fs';
import * as path from 'path';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { CreateDocumentDto } from './dto/create-document.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DocumentsService {
  private readonly uploadPath: string;

  constructor(
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,
    private configService: ConfigService,
  ) {
    const stage = this.configService.get<string>('STAGE') || 'dev';

    if (stage === 'prod') {
      this.uploadPath = path.join(__dirname, '..', 'files');
    } else {
      this.uploadPath = path.join(process.cwd(), 'src', 'files');
    }
  
    if (!fs.existsSync(this.uploadPath)) {
      fs.mkdirSync(this.uploadPath, { recursive: true });
    }
  }

  private generateVerificationCode(): string {
    return Math.random().toString(36).substring(2, 12).toUpperCase();
  }

  async findAll(): Promise<Document[]> {
    return await this.documentRepository.find({
      where: { IsActive: true },
      relations: ['Area', 'Type', 'User'],
      order: { Id: 'DESC' },
    });
  }

  async findInactive(): Promise<Document[]> {
    return await this.documentRepository.find({
      where: { IsActive: false },
      relations: ['Area', 'Type', 'User'],
      order: { Id: 'DESC' },
    });
  }

  async findByArea(areaId: number): Promise<Document[]> {
    return await this.documentRepository.find({
      where: {
        AreaId: areaId,
        IsActive: true,
      },
      relations: ['Area', 'Type', 'User'],
      order: { Id: 'DESC' },
    });
  }

  async findByAreaInactive(areaId: number): Promise<Document[]> {
    return await this.documentRepository.find({
      where: {
        AreaId: areaId,
        IsActive: false,
      },
      relations: ['Area', 'Type', 'User'],
      order: { Id: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Document> {
    const document = await this.documentRepository.findOne({
      where: { Id: id, IsActive: true },
      relations: ['Area', 'Type', 'User'],
    });
    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }
    return document;
  }

  async findBasicInfo(verificationCode: string): Promise<{
    Id: number;
    Name: string;
    VerificationCode: string;
    FilePath: string;
  }> {
    const document = await this.documentRepository.findOne({
      select: ['Id', 'Name', 'VerificationCode', 'FilePath'],
      where: {
        VerificationCode: verificationCode,
        IsActive: true,
      },
    });

    if (!document) {
      throw new NotFoundException(
        `Document with verification code ${verificationCode} not found`,
      );
    }

    return document;
  }

  async uploadFile(id: number, file: Express.Multer.File): Promise<Document> {
    const document = await this.findOne(id);

    if (document.FilePath) {
      const rutaArchivoAntiguo = path.join(this.uploadPath, document.FilePath);
      try {
        if (fs.existsSync(rutaArchivoAntiguo)) {
          await fs.promises.unlink(rutaArchivoAntiguo);
        } else {
          console.log(`Archivo anterior no encontrado: ${rutaArchivoAntiguo}`);
        }
      } catch (error) {
        console.error('Error al eliminar archivo antiguo:', error);
      }
    }

    const fileName = `${document.VerificationCode}_${file.originalname}`;
    const filePath = path.join(this.uploadPath, fileName);
    await fs.promises.mkdir(this.uploadPath, { recursive: true });
    await fs.promises.writeFile(filePath, file.buffer);

    document.FilePath = fileName;
    document.UpdatedAt = new Date();

    return await this.documentRepository.save(document);
  }

  async create(
    createDocumentDto: CreateDocumentDto,
    file?: Express.Multer.File,
  ): Promise<Document> {
    const verificationCode = this.generateVerificationCode();

    let isUnique = false;
    while (!isUnique) {
      const existing = await this.documentRepository.findOne({
        where: { VerificationCode: verificationCode },
      });
      if (!existing) isUnique = true;
    }

    let fileName = null;
    if (file) {
      fileName = `${verificationCode}_${file.originalname}`;
      const filePath = path.join(this.uploadPath, fileName);

      await fs.promises.mkdir(this.uploadPath, { recursive: true });
      await fs.promises.writeFile(filePath, file.buffer);
    }

    const document = this.documentRepository.create({
      ...createDocumentDto,
      VerificationCode: verificationCode,
      FilePath: fileName,
      CreatedAt: new Date(),
    });
    return await this.documentRepository.save(document);
  }

  async update(
    id: number,
    updateDocumentDto: UpdateDocumentDto,
    file?: Express.Multer.File,
  ): Promise<Document> {
    const document = await this.findOne(id);

    let filePath = document.FilePath;
    if (file) {
      const rutaArchivoAntiguo = path.join(this.uploadPath, document.FilePath);
      try {
        await fs.promises.unlink(rutaArchivoAntiguo);
      } catch (error) {
        console.error('Error deleting old file:', error);
      }

      const fileName = `${document.VerificationCode}_${file.originalname}`;
      const filePath = path.join(this.uploadPath, fileName);
      await fs.promises.mkdir(this.uploadPath, { recursive: true });
      await fs.promises.writeFile(filePath, file.buffer);

      document.FilePath = fileName;
    }

    this.documentRepository.merge(document, {
      ...updateDocumentDto,
      FilePath: filePath,
      UpdatedAt: new Date(),
    });

    return await this.documentRepository.save(document);
  }

  async softDelete(id: number): Promise<void> {
    const document = await this.findOne(id);
    document.IsActive = false;
    document.UpdatedAt = new Date();
    await this.documentRepository.save(document);
  }

  async reactivate(id: number): Promise<Document> {
    const document = await this.documentRepository.findOne({
      where: { Id: id, IsActive: false },
    });

    if (!document) {
      throw new NotFoundException(`Inactive document with ID ${id} not found`);
    }

    document.IsActive = true;
    document.UpdatedAt = new Date();
    return await this.documentRepository.save(document);
  }
}
