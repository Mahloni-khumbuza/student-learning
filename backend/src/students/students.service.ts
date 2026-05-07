import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  findAll(): Promise<Student[]> {
    return this.studentRepo.find({
      relations: ['profile', 'courses'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Student> {
    const student = await this.studentRepo.findOne({
      where: { id },
      relations: ['profile', 'courses', 'courses.assignments'],
    });
    if (!student) throw new NotFoundException(`Student #${id} not found`);
    return student;
  }

  async create(dto: CreateStudentDto): Promise<Student> {
    const exists = await this.studentRepo.findOne({ where: { email: dto.email } });
    if (exists) throw new ConflictException('Email already in use');
    const student = this.studentRepo.create(dto);
    return this.studentRepo.save(student);
  }

  async update(id: number, dto: UpdateStudentDto): Promise<Student> {
    const student = await this.findOne(id);
    if (dto.email && dto.email !== student.email) {
      const exists = await this.studentRepo.findOne({ where: { email: dto.email } });
      if (exists) throw new ConflictException('Email already in use');
    }
    Object.assign(student, dto);
    await this.studentRepo.save(student);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const student = await this.studentRepo.findOne({ where: { id } });
    if (!student) throw new NotFoundException(`Student #${id} not found`);
    await this.studentRepo.softDelete(id);
  }

  async restore(id: number): Promise<void> {
    await this.studentRepo.restore(id);
  }

  async enroll(studentId: number, courseId: number): Promise<Student> {
    const student = await this.studentRepo.findOne({
      where: { id: studentId },
      relations: ['courses'],
    });
    if (!student) throw new NotFoundException(`Student #${studentId} not found`);

    const course = await this.courseRepo.findOne({ where: { id: courseId } });
    if (!course) throw new NotFoundException(`Course #${courseId} not found`);

    const alreadyEnrolled = student.courses?.some((c) => c.id === courseId);
    if (alreadyEnrolled) {
      throw new ConflictException(`Student #${studentId} is already enrolled in Course #${courseId}`);
    }

    student.courses = [...(student.courses || []), course];
    await this.studentRepo.save(student);
    return this.findOne(studentId);
  }

  async unenroll(studentId: number, courseId: number): Promise<Student> {
    const student = await this.studentRepo.findOne({
      where: { id: studentId },
      relations: ['courses'],
    });
    if (!student) throw new NotFoundException(`Student #${studentId} not found`);

    student.courses = (student.courses || []).filter((c) => c.id !== courseId);
    await this.studentRepo.save(student);
    return this.findOne(studentId);
  }

  findAllEnrollments(): Promise<Student[]> {
    return this.studentRepo.find({
      relations: ['courses'],
      order: { name: 'ASC' },
    });
  }
}
