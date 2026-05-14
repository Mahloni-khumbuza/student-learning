import {
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { Student } from './student.entity';
import { Course } from '../courses/course.entity';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepo: Repository<Student>,
    @InjectRepository(Course)
    private readonly courseRepo: Repository<Course>,
  ) {}

  async findAll(): Promise<Student[]> {
    try {
      return await this.studentRepo.find({
        relations: ['profile', 'courses'],
        order: { createdAt: 'DESC' },
      });
    } catch (error) {
      throw this.handleDatabaseError(error, 'Unable to load students');
    }
  }

  async findOne(id: string): Promise<Student> {
    try {
      return await this.studentRepo.findOneOrFail({
        where: { id },
        relations: ['profile', 'courses', 'courses.assignments'],
      });
    } catch (error) {
      if (this.isEntityNotFound(error)) {
        throw new NotFoundException(`Student #${id} not found`);
      }
      throw this.handleDatabaseError(error, 'Unable to load student');
    }
  }

  async create(dto: CreateStudentDto): Promise<Student> {
    try {
      const student = this.studentRepo.create(dto);
      return await this.studentRepo.save(student);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw this.handleDatabaseError(error, 'Unable to create student');
    }
  }

  async update(id: string, dto: UpdateStudentDto): Promise<Student> {
    try {
      const student = await this.findOne(id);
      Object.assign(student, dto);
      await this.studentRepo.save(student);
      return await this.findOne(id);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw this.handleDatabaseError(error, 'Unable to update student');
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      await this.findOne(id);
      await this.studentRepo.softDelete(id);
      return { message: 'Student deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw this.handleDatabaseError(error, 'Unable to delete student');
    }
  }

  async restore(id: string): Promise<{ message: string }> {
    try {
      await this.studentRepo.restore(id);
      return { message: 'Student restored successfully' };
    } catch (error) {
      throw this.handleDatabaseError(error, 'Unable to restore student');
    }
  }

  async enroll(studentId: string, courseId: number): Promise<Student> {
    try {
      await this.studentRepo.findOneOrFail({ where: { id: studentId } });
    } catch (error) {
      if (this.isEntityNotFound(error)) {
        throw new NotFoundException(`Student #${studentId} not found`);
      }
      throw this.handleDatabaseError(error, 'Unable to enroll student');
    }

    try {
      await this.courseRepo.findOneOrFail({ where: { id: courseId } });
    } catch (error) {
      if (this.isEntityNotFound(error)) {
        throw new NotFoundException(`Course #${courseId} not found`);
      }
      throw this.handleDatabaseError(error, 'Unable to enroll student');
    }

    try {
      await this.studentRepo
        .createQueryBuilder()
        .relation(Student, 'courses')
        .of(studentId)
        .add(courseId);
    } catch (error) {
      if (this.isDuplicate(error)) {
        throw new ConflictException(
          `Student #${studentId} is already enrolled in Course #${courseId}`,
        );
      }
      throw this.handleDatabaseError(error, 'Unable to enroll student');
    }

    return this.findOne(studentId);
  }

  async unenroll(studentId: string, courseId: number): Promise<Student> {
    try {
      await this.studentRepo.findOneOrFail({ where: { id: studentId } });
    } catch (error) {
      if (this.isEntityNotFound(error)) {
        throw new NotFoundException(`Student #${studentId} not found`);
      }
      throw this.handleDatabaseError(error, 'Unable to unenroll student');
    }

    try {
      await this.studentRepo
        .createQueryBuilder()
        .relation(Student, 'courses')
        .of(studentId)
        .remove(courseId);
      return await this.findOne(studentId);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw this.handleDatabaseError(error, 'Unable to unenroll student');
    }
  }

  async findAllEnrollments(): Promise<Student[]> {
    try {
      return await this.studentRepo.find({
        relations: ['courses'],
        order: { name: 'ASC' },
      });
    } catch (error) {
      throw this.handleDatabaseError(error, 'Unable to load enrollments');
    }
  }

  private handleDatabaseError(error: unknown, message: string): HttpException {
    if (this.isDuplicate(error)) {
      return new ConflictException('A record with the same unique value already exists');
    }
    console.error('[StudentsService]', message, error);
    return new InternalServerErrorException(message);
  }

  private isDuplicate(error: unknown): boolean {
    if (error instanceof QueryFailedError) {
      const driverErr = error as QueryFailedError & { code?: string; driverError?: { code?: string } };
      const code = driverErr.code || driverErr.driverError?.code;
      return code === 'ER_DUP_ENTRY' || code === '23505';
    }
    return false;
  }

  private isEntityNotFound(error: unknown): boolean {
    return (error as { name?: string })?.name === 'EntityNotFoundError';
  }
}
