import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './course.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepo: Repository<Course>,
  ) {}

  findAll(): Promise<Course[]> {
    return this.courseRepo.find({
      relations: ['assignments', 'students'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Course> {
    const course = await this.courseRepo.findOne({
      where: { id },
      relations: ['assignments', 'students', 'students.profile'],
    });
    if (!course) throw new NotFoundException(`Course #${id} not found`);
    return course;
  }

  async create(dto: CreateCourseDto): Promise<Course> {
    const exists = await this.courseRepo.findOne({ where: { code: dto.code } });
    if (exists) throw new ConflictException('Course code already exists');
    const course = this.courseRepo.create(dto);
    return this.courseRepo.save(course);
  }

  async update(id: number, dto: UpdateCourseDto): Promise<Course> {
    const course = await this.findOne(id);
    if (dto.code && dto.code !== course.code) {
      const exists = await this.courseRepo.findOne({ where: { code: dto.code } });
      if (exists) throw new ConflictException('Course code already exists');
    }
    Object.assign(course, dto);
    await this.courseRepo.save(course);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const course = await this.courseRepo.findOne({ where: { id } });
    if (!course) throw new NotFoundException(`Course #${id} not found`);
    await this.courseRepo.remove(course);
  }
}
