import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateStudentDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEmail()
  @IsOptional()
  email?: string;
}
