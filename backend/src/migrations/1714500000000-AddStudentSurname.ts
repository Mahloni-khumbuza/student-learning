import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddStudentSurname1714500000000 implements MigrationInterface {
  name = 'AddStudentSurname1714500000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    const hasSurname = await queryRunner.hasColumn('students', 'surname');
    if (!hasSurname) {
      await queryRunner.addColumn(
        'students',
        new TableColumn({ name: 'surname', type: 'varchar', length: '255', isNullable: true }),
      );
    }
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    const hasSurname = await queryRunner.hasColumn('students', 'surname');
    if (hasSurname) {
      await queryRunner.dropColumn('students', 'surname');
    }
  }
}
