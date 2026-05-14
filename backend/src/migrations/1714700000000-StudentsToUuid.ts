import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * DESTRUCTIVE: drops and recreates the students, profiles, and enrollments tables
 * to switch students.id from auto-increment INT to UUID. Existing rows in these
 * three tables are lost. Other tables (users, courses, assignments) are untouched.
 */
export class StudentsToUuid1714700000000 implements MigrationInterface {
  name = 'StudentsToUuid1714700000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('SET FOREIGN_KEY_CHECKS = 0');
    await queryRunner.query('DROP TABLE IF EXISTS `enrollments`');
    await queryRunner.query('DROP TABLE IF EXISTS `profiles`');
    await queryRunner.query('DROP TABLE IF EXISTS `students`');

    await queryRunner.query(`
      CREATE TABLE \`students\` (
        \`id\` varchar(36) NOT NULL,
        \`name\` varchar(255) NOT NULL,
        \`surname\` varchar(255) NULL,
        \`email\` varchar(255) NOT NULL,
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        \`deleted_at\` datetime(6) NULL,
        UNIQUE INDEX \`IDX_students_email\` (\`email\`),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE \`profiles\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`bio\` varchar(255) NULL,
        \`avatarUrl\` varchar(255) NULL,
        \`student_id\` varchar(36) NULL,
        \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        UNIQUE INDEX \`REL_profiles_student\` (\`student_id\`),
        PRIMARY KEY (\`id\`),
        CONSTRAINT \`FK_profiles_student\`
          FOREIGN KEY (\`student_id\`) REFERENCES \`students\`(\`id\`) ON DELETE CASCADE
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE \`enrollments\` (
        \`student_id\` varchar(36) NOT NULL,
        \`course_id\` int NOT NULL,
        INDEX \`IDX_enrollments_course\` (\`course_id\`),
        PRIMARY KEY (\`student_id\`, \`course_id\`),
        CONSTRAINT \`FK_enrollments_student\`
          FOREIGN KEY (\`student_id\`) REFERENCES \`students\`(\`id\`) ON DELETE CASCADE,
        CONSTRAINT \`FK_enrollments_course\`
          FOREIGN KEY (\`course_id\`) REFERENCES \`courses\`(\`id\`) ON DELETE CASCADE
      ) ENGINE=InnoDB
    `);

    await queryRunner.query('SET FOREIGN_KEY_CHECKS = 1');
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('SET FOREIGN_KEY_CHECKS = 0');
    await queryRunner.query('DROP TABLE IF EXISTS `enrollments`');
    await queryRunner.query('DROP TABLE IF EXISTS `profiles`');
    await queryRunner.query('DROP TABLE IF EXISTS `students`');

    await queryRunner.query(`
      CREATE TABLE \`students\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`name\` varchar(255) NOT NULL,
        \`email\` varchar(255) NOT NULL,
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        \`deleted_at\` datetime(6) NULL,
        UNIQUE INDEX \`IDX_students_email\` (\`email\`),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE \`profiles\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`bio\` varchar(255) NULL,
        \`avatarUrl\` varchar(255) NULL,
        \`student_id\` int NULL,
        \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        UNIQUE INDEX \`REL_profiles_student\` (\`student_id\`),
        PRIMARY KEY (\`id\`),
        CONSTRAINT \`FK_profiles_student\`
          FOREIGN KEY (\`student_id\`) REFERENCES \`students\`(\`id\`) ON DELETE CASCADE
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE \`enrollments\` (
        \`student_id\` int NOT NULL,
        \`course_id\` int NOT NULL,
        INDEX \`IDX_enrollments_course\` (\`course_id\`),
        PRIMARY KEY (\`student_id\`, \`course_id\`),
        CONSTRAINT \`FK_enrollments_student\`
          FOREIGN KEY (\`student_id\`) REFERENCES \`students\`(\`id\`) ON DELETE CASCADE,
        CONSTRAINT \`FK_enrollments_course\`
          FOREIGN KEY (\`course_id\`) REFERENCES \`courses\`(\`id\`) ON DELETE CASCADE
      ) ENGINE=InnoDB
    `);

    await queryRunner.query('SET FOREIGN_KEY_CHECKS = 1');
  }
}
