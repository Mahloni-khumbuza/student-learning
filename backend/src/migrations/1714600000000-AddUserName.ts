import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddUserName1714600000000 implements MigrationInterface {
  name = 'AddUserName1714600000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    const hasName = await queryRunner.hasColumn('users', 'name');
    if (!hasName) {
      await queryRunner.addColumn(
        'users',
        new TableColumn({ name: 'name', type: 'varchar', length: '255', isNullable: true }),
      );
    }
    const hasSurname = await queryRunner.hasColumn('users', 'surname');
    if (!hasSurname) {
      await queryRunner.addColumn(
        'users',
        new TableColumn({ name: 'surname', type: 'varchar', length: '255', isNullable: true }),
      );
    }
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    if (await queryRunner.hasColumn('users', 'surname')) {
      await queryRunner.dropColumn('users', 'surname');
    }
    if (await queryRunner.hasColumn('users', 'name')) {
      await queryRunner.dropColumn('users', 'name');
    }
  }
}
