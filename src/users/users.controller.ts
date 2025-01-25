import { Controller, Get, Post, Body, Put, Param, Delete, ParseIntPipe, UseInterceptors, ClassSerializerInterceptor, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
 constructor(private readonly usersService: UsersService) {}

 @Get('inactive')
 findInactive(): Promise<User[]> {
   return this.usersService.findInactive();
 }

 @Get()
 findAll(): Promise<User[]> {
   return this.usersService.findAll();
 }

 @Get(':id')
 findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
   return this.usersService.findOne(id);
 }

 @Post()
 create(@Body() createUserDto: CreateUserDto): Promise<User> {
   return this.usersService.create(createUserDto);
 }

 @Put('reactivate/:id')
 reactivate(@Param('id', ParseIntPipe) id: number): Promise<User> {
   return this.usersService.reactivate(id);
 }

 @Put(':id')
 update(
   @Param('id', ParseIntPipe) id: number,
   @Body() updateUserDto: UpdateUserDto,
 ): Promise<User> {
   return this.usersService.update(id, updateUserDto);
 }

 @Delete(':id')
 remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
   return this.usersService.softDelete(id);
 }
}