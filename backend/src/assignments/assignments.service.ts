import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  findAll(): Promise<Assignment[]> {
    return this.assignmentRepo.find({
      relations: ['course'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Assignment> {
    const assignment = await this.assignmentRepo.findOne({
      where: { id },
      relations: ['course'],
    });
    if (!assignment) throw new NotFoundException(`Assignment #${id} not found`);
    return assignment;
  }

  async create(dto: CreateAssignmentDto): Promise<Assignment> {
    const course = await this.courseRepo.findOne({ where: { id: dto.courseId } });
    if (!course) throw new NotFoundException(`Course #${dto.courseId} not found`);

    const assignment = this.assignmentRepo.create({
      title: dto.title,
      dueDate: dto.dueDate,
      course,
    });
    return this.assignmentRepo.save(assignment);
  }

  async update(id: number, dto: UpdateAssignmentDto): Promise<Assignment> {
    const assignment = await this.findOne(id);
    Object.assign(assignment, dto);
    await this.assignmentRepo.save(assignment);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const assignment = await this.findOne(id);
    await this.assignmentRepo.remove(assignment);
  }
}
