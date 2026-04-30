import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Profile } from '../profiles/profile.entity';
import { Course } from '../courses/course.entity';

@Entity('students')
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  // One-to-One: each student has exactly one profile
  @OneToOne(() => Profile, (profile) => profile.student, {
    cascade: true,
    nullable: true,
  })
  profile: Profile;

  // Many-to-Many: students enroll in many courses; courses have many students
  @ManyToMany(() => Course, (course) => course.students)
  @JoinTable({
    name: 'enrollments',
    joinColumn: { name: 'student_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'course_id', referencedColumnName: 'id' },
  })
  courses: Course[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
