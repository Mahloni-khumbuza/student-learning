import {
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { Course } from './course.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepo: Repository<Course>,
  ) {}

  async findAll(): Promise<Course[]> {
    try {
      return await this.courseRepo.find({
        relations: ['assignments', 'students'],
        order: { createdAt: 'DESC' },
      });
    } catch (error) {
      throw this.handleDatabaseError(error, 'Unable to load courses');
    }
  }

  async findOne(id: number): Promise<Course> {
    try {
      return await this.courseRepo.findOneOrFail({
        where: { id },
        relations: ['assignments', 'students', 'students.profile'],
      });
    } catch (error) {
      if (this.isEntityNotFound(error)) {
        throw new NotFoundException(`Course #${id} not found`);
      }
      throw this.handleDatabaseError(error, 'Unable to load course');
    }
  }

  async create(dto: CreateCourseDto): Promise<Course> {
    try {
      const course = this.courseRepo.create(dto);
      return await this.courseRepo.save(course);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw this.handleDatabaseError(error, 'Unable to create course');
    }
  }

  async update(id: number, dto: UpdateCourseDto): Promise<Course> {
    try {
      const course = await this.findOne(id);
      Object.assign(course, dto);
      await this.courseRepo.save(course);
      return await this.findOne(id);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw this.handleDatabaseError(error, 'Unable to update course');
    }
  }

  async remove(id: number): Promise<{ message: string }> {
    try {
      const course = await this.findOne(id);
      await this.courseRepo.remove(course);
      return { message: 'Course deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw this.handleDatabaseError(error, 'Unable to delete course');
    }
  }

  private handleDatabaseError(error: unknown, message: string): HttpException {
    if (this.isDuplicate(error)) {
      return new ConflictException('Course code already exists');
    }
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
