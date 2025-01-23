import { IsNotEmpty, IsString, IsInt, MaxLength } from 'class-validator';

export class CreateUserDto {
 @IsNotEmpty()
 @IsString()
 @MaxLength(100)
 Name: string;

 @IsNotEmpty()
 @IsInt()
 AreaId: number;

 @IsNotEmpty()
 @IsString()
 @MaxLength(50)
 Profile: string;

 @IsNotEmpty()
 @IsString()
 Password: string;

 @IsNotEmpty()
 @IsString()
 @MaxLength(50)
 Username: string;

 @IsNotEmpty()
 @IsString()
 @MaxLength(255)
 LastName: string;
}