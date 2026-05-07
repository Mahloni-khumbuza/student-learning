import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateStudentDto {
  @ApiProperty({ example: 'Jane', description: 'First name of the student' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'Doe', description: 'Surname / last name' })
  @IsString()
  @IsOptional()
  surname?: string;

  @ApiProperty({ example: 'jane@example.com', description: 'Unique email address' })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
