import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

export class AddUsersAndTimestamps1714000000000 implements MigrationInterface {
  name = 'AddUsersAndTimestamps1714000000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    // Create users table
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          { name: 'id', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
          { name: 'email', type: 'varchar', length: '255', isUnique: true },
          { name: 'password', type: 'varchar', length: '255' },
          { name: 'role', type: 'enum', enum: ['admin', 'student'], default: "'student'" },
          { name: 'created_at', type: 'datetime', precision: 6, default: 'CURRENT_TIMESTAMP(6)' },
          { name: 'updated_at', type: 'datetime', precision: 6, default: 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)' },
        ],
      }),
      true, // ifNotExists
    );

    // Add soft-delete column to students
    const studentsHasDeletedAt = await queryRunner.hasColumn('students', 'deleted_at');
    if (!studentsHasDeletedAt) {
      await queryRunner.addColumn(
        'students',
        new TableColumn({ name: 'deleted_at', type: 'datetime', precision: 6, isNullable: true }),
      );
    }

    // Add timestamps to profiles
    const profilesHasCreatedAt = await queryRunner.hasColumn('profiles', 'created_at');
    if (!profilesHasCreatedAt) {
      await queryRunner.addColumn(
        'profiles',
        new TableColumn({ name: 'created_at', type: 'datetime', precision: 6, default: 'CURRENT_TIMESTAMP(6)' }),
      );
    }
    const profilesHasUpdatedAt = await queryRunner.hasColumn('profiles', 'updated_at');
    if (!profilesHasUpdatedAt) {
      await queryRunner.addColumn(
        'profiles',
        new TableColumn({ name: 'updated_at', type: 'datetime', precision: 6, default: 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)' }),
      );
    }

    // Add updatedAt to assignments
    const assignmentsHasUpdatedAt = await queryRunner.hasColumn('assignments', 'updated_at');
    if (!assignmentsHasUpdatedAt) {
      await queryRunner.addColumn(
        'assignments',
        new TableColumn({ name: 'updated_at', type: 'datetime', precision: 6, default: 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)' }),
      );
    }
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('assignments', 'updated_at');
    await queryRunner.dropColumn('profiles', 'updated_at');
    await queryRunner.dropColumn('profiles', 'created_at');
    await queryRunner.dropColumn('students', 'deleted_at');
    await queryRunner.dropTable('users');
  }
}
