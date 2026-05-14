import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { Role } from '../auth/enums/role.enum';

@ApiTags('students')
@ApiBearerAuth()
@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'List all students with profiles and enrolled courses' })
  @ApiResponse({ status: 200, description: 'Array of student objects' })
  findAll() {
    return this.studentsService.findAll();
  }

  @Public()
  @Get('enrollments')
  @ApiOperation({ summary: 'List all students with their course enrollments' })
  findAllEnrollments() {
    return this.studentsService.findAllEnrollments();
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get a single student with profile and courses' })
  @ApiResponse({ status: 404, description: 'Student not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.studentsService.findOne(id);
  }

  @Roles(Role.ADMIN)
  @Post()
  @ApiOperation({ summary: '[Admin] Create a new student' })
  @ApiResponse({ status: 409, description: 'Email already in use' })
  create(@Body() dto: CreateStudentDto) {
    return this.studentsService.create(dto);
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  @ApiOperation({ summary: '[Admin] Update student details' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateStudentDto) {
    return this.studentsService.update(id, dto);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: '[Admin] Soft-delete a student (recoverable)' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.studentsService.remove(id);
  }

  @Roles(Role.ADMIN)
  @Post(':studentId/enroll/:courseId')
  @ApiOperation({ summary: '[Admin] Enroll a student in a course' })
  @ApiResponse({ status: 409, description: 'Student already enrolled in this course' })
  enroll(
    @Param('studentId', ParseUUIDPipe) studentId: string,
    @Param('courseId', ParseIntPipe) courseId: number,
  ) {
    return this.studentsService.enroll(studentId, courseId);
  }

  @Roles(Role.ADMIN)
  @Delete(':studentId/unenroll/:courseId')
  @ApiOperation({ summary: '[Admin] Remove a student from a course' })
  unenroll(
    @Param('studentId', ParseUUIDPipe) studentId: string,
    @Param('courseId', ParseIntPipe) courseId: number,
  ) {
    return this.studentsService.unenroll(studentId, courseId);
  }
}
