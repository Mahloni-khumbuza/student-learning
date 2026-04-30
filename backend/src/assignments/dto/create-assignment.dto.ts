import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateAssignmentDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @IsNumber()
  @IsNotEmpty()
  courseId: number;
}
