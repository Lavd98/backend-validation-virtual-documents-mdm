import { IsBoolean, IsNotEmpty } from 'class-validator';

export class ActivateUserDto {
  @IsBoolean()
  @IsNotEmpty({ message: 'El estado es requerido' })
  isActive: boolean;
}