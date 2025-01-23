import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
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
     where: { isActive: true },
     relations: ['Area'],
     order: { Id: 'DESC' }
   });
 }

 async findInactive(): Promise<User[]> {
   return await this.userRepository.find({
     where: { isActive: false },
     relations: ['Area'],
     order: { Id: 'DESC' }
   });
 }

 async findOne(id: number): Promise<User> {
   const user = await this.userRepository.findOne({
     where: { Id: id, isActive: true },
     relations: ['Area']
   });
   if (!user) {
     throw new NotFoundException(`User with ID ${id} not found`);
   }
   return user;
 }

 async create(createUserDto: CreateUserDto): Promise<User> {
   const existingUser = await this.userRepository.findOne({
     where: { Username: createUserDto.Username.trim(), isActive: true }
   });

   if (existingUser) {
     throw new ConflictException(`Username ${createUserDto.Username} already exists`);
   }

   const hashedPassword = await bcrypt.hash(createUserDto.Password, 10);

   const user = this.userRepository.create({
     ...createUserDto,
     Password: hashedPassword,
     CreatedAt: new Date()
   });
   
   return await this.userRepository.save(user);
 }

 async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
   const user = await this.findOne(id);

   const existingUser = await this.userRepository.findOne({
     where: { 
       Username: updateUserDto.Username.trim(),
       isActive: true,
       Id: Not(id)
     }
   });

   if (existingUser) {
     throw new ConflictException(`Username ${updateUserDto.Username} already exists`);
   }

   if (updateUserDto.Password) {
     updateUserDto.Password = await bcrypt.hash(updateUserDto.Password, 10);
   }

   this.userRepository.merge(user, {
     ...updateUserDto,
     UpdatedAt: new Date()
   });
   return await this.userRepository.save(user);
 }

 async softDelete(id: number): Promise<void> {
   const user = await this.findOne(id);
   user.isActive = false;
   user.UpdatedAt = new Date();
   await this.userRepository.save(user);
 }

 async reactivate(id: number): Promise<User> {
   const user = await this.userRepository.findOne({
     where: { Id: id, isActive: false }
   });
   
   if (!user) {
     throw new NotFoundException(`Inactive user with ID ${id} not found`);
   }

   const existingActive = await this.userRepository.findOne({
     where: { Username: user.Username, isActive: true }
   });

   if (existingActive) {
     throw new ConflictException(`Username ${user.Username} already exists`);
   }

   user.isActive = true;
   user.UpdatedAt = new Date();
   return await this.userRepository.save(user);
 }
}