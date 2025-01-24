import { IsNotEmpty, IsString, MaxLength, IsBoolean } from 'class-validator';

export class CreateDocumentTypeDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  Name: string;

  @IsBoolean()
  IsActive: boolean = true;
}