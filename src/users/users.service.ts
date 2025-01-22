import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { ActivateUserDto } from './dto/activate-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { username, email, password, ...userData } = createUserDto;

    // Verificar si el usuario ya existe
    const existingUser = await this.usersRepository.findOne({
      where: [{ username }, { email }],
    });

    if (existingUser) {
      if (existingUser.username === username) {
        throw new NotFoundException('El nombre de usuario ya está en uso');
      }
      if (existingUser.email === email) {
        throw new NotFoundException('El correo electrónico ya está en uso');
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({
      ...userData,
      username,
      email,
      password: hashedPassword,
    });
    return this.usersRepository.save(user);
  }

  findAll(isActive?: boolean): Promise<User[]> {
    const whereCondition = isActive !== undefined ? { isActive } : {};
    return this.usersRepository.find({ where: whereCondition, relations: ['profile'], });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id, isActive: true }, relations: ['profile'], });
    if (!user) {
      throw new NotFoundException(`Usuario con ID "${id}" no encontrado`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    Object.assign(user, updateUserDto);
    return this.usersRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    user.isActive = false;
    await this.usersRepository.save(user);
  }

  async findByUsername(username: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { username, isActive: true }, relations: ['profile'] });
  }

  async updateLastLogin(userId: string): Promise<void> {
    await this.usersRepository.update(userId, { lastLogin: new Date() });
  }

  async activateUser(id: string, activateUserDto: ActivateUserDto): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['profile']
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID "${id}" no encontrado`);
    }

    if (user.isActive === activateUserDto.isActive) {
      throw new ConflictException(`El usuario ya se encuentra ${activateUserDto.isActive ? 'activado' : 'desactivado'}`);
    }

    user.isActive = activateUserDto.isActive;
    return await this.usersRepository.save(user);
  }
}