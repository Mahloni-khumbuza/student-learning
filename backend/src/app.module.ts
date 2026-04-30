import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentsModule } from './students/students.module';
import { ProfilesModule } from './profiles/profiles.module';
import { CoursesModule } from './courses/courses.module';
import { AssignmentsModule } from './assignments/assignments.module';
import { Student } from './students/student.entity';
import { Profile } from './profiles/profile.entity';
import { Course } from './courses/course.entity';
import { Assignment } from './assignments/assignment.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 3306,
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '',
      database: process.env.DB_NAME || 'student_learning',
      entities: [Student, Profile, Course, Assignment],
      synchronize: true,
    }),
    StudentsModule,
    ProfilesModule,
    CoursesModule,
    AssignmentsModule,
  ],
})
export class AppModule {}
