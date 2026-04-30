import { IsDateString, IsOptional, IsString } from 'class-validator';

export class UpdateAssignmentDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsDateString()
  @IsOptional()
  dueDate?: string;
}
