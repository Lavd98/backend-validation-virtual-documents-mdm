import { IsString, IsEmail, IsNotEmpty, IsNumber, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  firstName: string;

  @IsString()
  @IsNotEmpty({ message: 'El apellido paterno es requerido' })
  @MinLength(2, { message: 'El apellido paterno debe tener al menos 2 caracteres' })
  paternalSurname: string;

  @IsString()
  @IsNotEmpty({ message: 'El apellido materno es requerido' })
  @MinLength(2, { message: 'El apellido materno debe tener al menos 2 caracteres' })
  maternalSurname: string;

  @IsString()
  @IsNotEmpty({ message: 'El nombre de usuario es requerido' })
  @MinLength(4, { message: 'El nombre de usuario debe tener al menos 4 caracteres' })
  username: string;

  @IsEmail({}, { message: 'Debe proporcionar un email válido' })
  @IsNotEmpty({ message: 'El email es requerido' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'La contraseña es requerida' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  @IsNumber({}, { message: 'El ID del perfil debe ser un número' })
  @IsNotEmpty({ message: 'El ID del perfil es requerido' })
  profileId: number;
}