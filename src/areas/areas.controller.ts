import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { AreasService } from './areas.service';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { Area } from './entities/area.entity';

@Controller('areas')
export class AreasController {
  constructor(private readonly areasService: AreasService) {}

  @Get('inactive')
  findInactive(): Promise<Area[]> {
    return this.areasService.findInactive();
  }

  @Get()
  findAll(): Promise<Area[]> {
    return this.areasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Area> {
    return this.areasService.findOne(id);
  }

  @Post()
  create(@Body() createAreaDto: CreateAreaDto): Promise<Area> {
    return this.areasService.create(createAreaDto);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAreaDto: UpdateAreaDto,
  ): Promise<Area> {
    return this.areasService.update(id, updateAreaDto);
  }

  @Delete(':id')
  softDelete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.areasService.softDelete(id);
  }

  @Put('reactivate/:id')
  reactivate(@Param('id', ParseIntPipe) id: number): Promise<Area> {
    return this.areasService.reactivate(id);
  }
}
