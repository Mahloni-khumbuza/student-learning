import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Course } from '../courses/course.entity';

@Entity('assignments')
export class Assignment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'date', nullable: true })
  dueDate: string;

  // Many-to-One: many assignments belong to one course
  @ManyToOne(() => Course, (course) => course.assignments, {
    onDelete: 'CASCADE',
  })
  course: Course;

  @CreateDateColumn()
  createdAt: Date;
}
