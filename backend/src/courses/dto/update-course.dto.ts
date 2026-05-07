import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCourseDto {
  @ApiPropertyOptional({ example: 'Advanced Computer Science' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ example: 'CS201' })
  @IsString()
  @IsOptional()
  code?: string;
}
