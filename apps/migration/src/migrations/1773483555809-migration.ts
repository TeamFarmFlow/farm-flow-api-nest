import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1773483555809 implements MigrationInterface {
  name = 'Migration1773483555809';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."ATTENDANCES_UQ"`);
    await queryRunner.query(`CREATE UNIQUE INDEX "ATTENDANCES_UQ" ON "attendances" ("farm_id", "user_id", "work_date") `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."ATTENDANCES_UQ"`);
    await queryRunner.query(`CREATE UNIQUE INDEX "ATTENDANCES_UQ" ON "attendances" ("work_date", "farm_id", "user_id") `);
  }
}
