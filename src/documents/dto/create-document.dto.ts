import { IsInt, IsString, IsOptional, MaxLength } from 'class-validator';

export class CreateDocumentDto {
 @IsInt()
 AreaId: number;

 @IsInt()
 TypeId: number;

 @IsInt()
 YearPublication: number;

 @IsString()
 @MaxLength(255)
 Name: string;

 @IsOptional()
 @IsString()
 Description?: string;

 @IsInt()
 UserId: number;
}