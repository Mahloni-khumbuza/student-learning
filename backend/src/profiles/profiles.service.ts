import {
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { Profile } from './profile.entity';
import { Student } from '../students/student.entity';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepo: Repository<Profile>,
    @InjectRepository(Student)
    private readonly studentRepo: Repository<Student>,
  ) {}

  async findAll(): Promise<Profile[]> {
    try {
      return await this.profileRepo.find({ relations: ['student'] });
    } catch (error) {
      throw this.handleDatabaseError(error, 'Unable to load profiles');
    }
  }

  async findOne(id: number): Promise<Profile> {
    try {
      return await this.profileRepo.findOneOrFail({
        where: { id },
        relations: ['student'],
      });
    } catch (error) {
      if (this.isEntityNotFound(error)) {
        throw new NotFoundException(`Profile #${id} not found`);
      }
      throw this.handleDatabaseError(error, 'Unable to load profile');
    }
  }

  async create(dto: CreateProfileDto): Promise<Profile> {
    try {
      const student = await this.studentRepo.findOneOrFail({
        where: { id: dto.studentId },
        relations: ['profile'],
      });

      if (student.profile) {
        throw new ConflictException('Student already has a profile');
      }

      const profile = this.profileRepo.create({
        bio: dto.bio,
        avatarUrl: dto.avatarUrl,
        student,
      });
      return await this.profileRepo.save(profile);
    } catch (error) {
      if (this.isEntityNotFound(error)) {
        throw new NotFoundException(`Student #${dto.studentId} not found`);
      }
      if (error instanceof HttpException) throw error;
      throw this.handleDatabaseError(error, 'Unable to create profile');
    }
  }

  async update(id: number, dto: UpdateProfileDto): Promise<Profile> {
    try {
      const profile = await this.findOne(id);
      Object.assign(profile, dto);
      await this.profileRepo.save(profile);
      return await this.findOne(id);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw this.handleDatabaseError(error, 'Unable to update profile');
    }
  }

  async remove(id: number): Promise<{ message: string }> {
    try {
      const profile = await this.findOne(id);
      await this.profileRepo.remove(profile);
      return { message: 'Profile deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw this.handleDatabaseError(error, 'Unable to delete profile');
    }
  }

  private handleDatabaseError(error: unknown, message: string): HttpException {
    if (this.isDuplicate(error)) {
      return new ConflictException('Profile already exists for this student');
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
