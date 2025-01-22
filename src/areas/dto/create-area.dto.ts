import { IsBoolean, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateAreaDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  Name: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  Abbreviation: string;

  @IsBoolean()
  isActive: boolean = true;
}