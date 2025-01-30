import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Area } from './entities/area.entity';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { DocumentsService } from 'src/documents/documents.service';

@Injectable()
export class AreasService {
  constructor(
    @InjectRepository(Area)
    private areaRepository: Repository<Area>,
    private documentsService: DocumentsService,
  ) {}

  async findAll(): Promise<Area[]> {
    return await this.areaRepository.find({
      where: { IsActive: true },
      order: {
        Name: 'ASC',
      },
    });
  }

  async findOne(id: number): Promise<Area> {
    const area = await this.areaRepository.findOne({
      where: {
        Id: id,
        IsActive: true,
      },
    });
    if (!area) {
      throw new NotFoundException(`Area with ID ${id} not found`);
    }
    return area;
  }

  async findInactive(): Promise<Area[]> {
    return await this.areaRepository.find({
      where: { IsActive: false },
      order: {
        Name: 'ASC',
      },
    });
  }

  async create(createAreaDto: CreateAreaDto): Promise<Area> {
    const area = this.areaRepository.create(createAreaDto);
    return await this.areaRepository.save(area);
  }

  async update(id: number, updateAreaDto: UpdateAreaDto): Promise<Area> {
    const area = await this.findOne(id);
    this.areaRepository.merge(area, updateAreaDto);
    return await this.areaRepository.save(area);
  }

  async softDelete(id: number): Promise<void> {
    const area = await this.findOne(id);
    const activeDocuments = await this.documentsService.findByArea(id);

    if (activeDocuments.length > 0) {
      throw new ConflictException(
        `No se puede desactivar el área porque tiene ${activeDocuments.length} documento(s) activo(s) vinculado(s)`
      );
    }
    
    area.IsActive = false;
    await this.areaRepository.save(area);
  }

  async reactivate(id: number): Promise<Area> {
    const area = await this.areaRepository.findOne({
      where: { Id: id },
    });
    if (!area) {
      throw new NotFoundException(`Area with ID ${id} not found`);
    }
    area.IsActive = true;
    return await this.areaRepository.save(area);
  }
}
