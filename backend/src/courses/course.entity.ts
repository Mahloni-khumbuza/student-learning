import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Assignment } from '../assignments/assignment.entity';
import { Student } from '../students/student.entity';

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ unique: true })
  code: string;

  // One-to-Many: one course owns many assignments
  @OneToMany(() => Assignment, (assignment) => assignment.course, {
    cascade: true,
  })
  assignments: Assignment[];

  // Inverse side of the Many-to-Many with students
  @ManyToMany(() => Student, (student) => student.courses)
  students: Student[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
