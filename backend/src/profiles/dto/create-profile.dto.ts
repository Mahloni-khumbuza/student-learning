import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProfileDto {
  @ApiProperty({ example: 1, description: 'Student ID to attach the profile to' })
  @IsNumber()
  @IsNotEmpty()
  studentId: number;

  @ApiPropertyOptional({ example: 'Passionate about mathematics and science.' })
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiPropertyOptional({ example: 'https://example.com/avatar.jpg' })
  @IsString()
  @IsOptional()
  avatarUrl?: string;
}
