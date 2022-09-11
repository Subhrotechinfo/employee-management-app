// import { IsNotEmpty, IsEmail, IsString, IsArray, IsOptional, ValidateIf, IsObject, IsNotEmptyObject, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    Id: number;
    login:string;
    name:string;
    salary:number;
}