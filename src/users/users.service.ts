import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({
      where: { IsActive: true },
      relations: ['Area'],
      order: { Id: 'DESC' },
    });
  }

  async findInactive(): Promise<User[]> {
    return await this.userRepository.find({
      where: { IsActive: false },
      relations: ['Area'],
      order: { Id: 'DESC' },
    });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { Id: id, IsActive: true },
      relations: ['Area'],
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { Username: createUserDto.Username.trim(), IsActive: true },
    });

    if (existingUser) {
      throw new ConflictException(
        `Username ${createUserDto.Username} already exists`,
      );
    }

    const hashedPassword = await bcrypt.hash(createUserDto.Password, 10);

    const user = this.userRepository.create({
      ...createUserDto,
      Password: hashedPassword,
      CreatedAt: new Date(),
    });

    return await this.userRepository.save(user);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    const existingUser = await this.userRepository.findOne({
      where: {
        Username: updateUserDto.Username.trim(),
        IsActive: true,
        Id: Not(id),
      },
    });

    if (existingUser) {
      throw new ConflictException(
        `Username ${updateUserDto.Username} already exists`,
      );
    }

    if (updateUserDto.Password) {
      updateUserDto.Password = await bcrypt.hash(updateUserDto.Password, 10);
    }

    this.userRepository.merge(user, {
      ...updateUserDto,
      UpdatedAt: new Date(),
    });
    return await this.userRepository.save(user);
  }

  async softDelete(id: number): Promise<void> {
    const user = await this.findOne(id);
    user.IsActive = false;
    user.UpdatedAt = new Date();
    await this.userRepository.save(user);
  }

  async reactivate(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { Id: id, IsActive: false },
    });

    if (!user) {
      throw new NotFoundException(`Inactive user with ID ${id} not found`);
    }

    const existingActive = await this.userRepository.findOne({
      where: { Username: user.Username, IsActive: true },
    });

    if (existingActive) {
      throw new ConflictException(`Username ${user.Username} already exists`);
    }

    user.IsActive = true;
    user.UpdatedAt = new Date();
    return await this.userRepository.save(user);
  }

  async findByUsername(username: string): Promise<User | undefined> {
    const user = await this.userRepository.findOne({
      where: { Username: username, IsActive: true },
      relations: ['Area'],
    });
    if (!user) {
      throw new NotFoundException(`User not found`);
    }
    return user;
  }

  async findByArea(areaId: number): Promise<User[]> {
    return await this.userRepository.find({
      where: { 
        Area: { Id: areaId },
        IsActive: true 
      },
      relations: ['Area']
    });
  }
}
