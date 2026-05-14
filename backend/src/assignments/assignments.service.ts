import {
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { Assignment } from './assignment.entity';
import { Course } from '../courses/course.entity';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';

@Injectable()
export class AssignmentsService {
  constructor(
    @InjectRepository(Assignment)
    private readonly assignmentRepo: Repository<Assignment>,
    @InjectRepository(Course)
    private readonly courseRepo: Repository<Course>,
  ) {}

  async findAll(): Promise<Assignment[]> {
    try {
      return await this.assignmentRepo.find({
        relations: ['course'],
        order: { createdAt: 'DESC' },
      });
    } catch (error) {
      throw this.handleDatabaseError(error, 'Unable to load assignments');
    }
  }

  async findOne(id: number): Promise<Assignment> {
    try {
      return await this.assignmentRepo.findOneOrFail({
        where: { id },
        relations: ['course'],
      });
    } catch (error) {
      if (this.isEntityNotFound(error)) {
        throw new NotFoundException(`Assignment #${id} not found`);
      }
      throw this.handleDatabaseError(error, 'Unable to load assignment');
    }
  }

  async create(dto: CreateAssignmentDto): Promise<Assignment> {
    try {
      const course = await this.courseRepo.findOneOrFail({ where: { id: dto.courseId } });
      const assignment = this.assignmentRepo.create({
        title: dto.title,
        dueDate: dto.dueDate,
        course,
      });
      return await this.assignmentRepo.save(assignment);
    } catch (error) {
      if (this.isEntityNotFound(error)) {
        throw new NotFoundException(`Course #${dto.courseId} not found`);
      }
      if (error instanceof HttpException) throw error;
      throw this.handleDatabaseError(error, 'Unable to create assignment');
    }
  }

  async update(id: number, dto: UpdateAssignmentDto): Promise<Assignment> {
    try {
      const assignment = await this.findOne(id);
      Object.assign(assignment, dto);
      await this.assignmentRepo.save(assignment);
      return await this.findOne(id);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw this.handleDatabaseError(error, 'Unable to update assignment');
    }
  }

  async remove(id: number): Promise<{ message: string }> {
    try {
      const assignment = await this.findOne(id);
      await this.assignmentRepo.remove(assignment);
      return { message: 'Assignment deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw this.handleDatabaseError(error, 'Unable to delete assignment');
    }
  }

  private handleDatabaseError(error: unknown, message: string): HttpException {
    if (this.isDuplicate(error)) {
      return new ConflictException('A record with the same unique value already exists');
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
