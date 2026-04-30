import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  findAll(): Promise<Profile[]> {
    return this.profileRepo.find({ relations: ['student'] });
  }

  async findOne(id: number): Promise<Profile> {
    const profile = await this.profileRepo.findOne({
      where: { id },
      relations: ['student'],
    });
    if (!profile) throw new NotFoundException(`Profile #${id} not found`);
    return profile;
  }

  async create(dto: CreateProfileDto): Promise<Profile> {
    const student = await this.studentRepo.findOne({
      where: { id: dto.studentId },
      relations: ['profile'],
    });
    if (!student) throw new NotFoundException(`Student #${dto.studentId} not found`);
    if (student.profile) throw new ConflictException('Student already has a profile');

    const profile = this.profileRepo.create({
      bio: dto.bio,
      avatarUrl: dto.avatarUrl,
      student,
    });
    return this.profileRepo.save(profile);
  }

  async update(id: number, dto: UpdateProfileDto): Promise<Profile> {
    const profile = await this.findOne(id);
    Object.assign(profile, dto);
    await this.profileRepo.save(profile);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const profile = await this.findOne(id);
    await this.profileRepo.remove(profile);
  }
}
