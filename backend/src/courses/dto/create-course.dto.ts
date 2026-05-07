import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCourseDto {
  @ApiProperty({ example: 'Introduction to Computer Science', description: 'Course title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'CS101', description: 'Unique course code' })
  @IsString()
  @IsNotEmpty()
  code: string;
}
