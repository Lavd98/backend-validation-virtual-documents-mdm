import { IsString, IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  @IsString()
  @IsNotEmpty()
  Username: string;

  @IsString()
  @IsNotEmpty()
  Password: string;
}