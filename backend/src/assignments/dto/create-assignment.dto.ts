import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateAssignmentDto {
  @ApiProperty({ example: 'Homework 1', description: 'Assignment title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ example: '2025-12-31', description: 'Due date in YYYY-MM-DD format' })
  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @ApiProperty({ example: 1, description: 'ID of the course this assignment belongs to' })
  @IsNumber()
  @IsNotEmpty()
  courseId: number;
}
