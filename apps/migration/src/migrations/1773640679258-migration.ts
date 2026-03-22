import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1773640679258 implements MigrationInterface {
  name = 'Migration1773640679258';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`UPDATE role_permissions SET "key" = 'farm.update' WHERE "key" = 'update'`);
    await queryRunner.query(`UPDATE role_permissions SET "key" = 'farm.delete' WHERE "key" = 'delete'`);
    await queryRunner.query(`ALTER TABLE "farms" ADD "pay_rate_per_hour" integer NOT NULL DEFAULT '0'`);
    await queryRunner.query(`ALTER TABLE "farms" ADD "pay_deduction_amount" integer NOT NULL DEFAULT '0'`);
    await queryRunner.query(`ALTER TABLE "farm_users" ADD "pay_rate_per_hour" integer NOT NULL DEFAULT '0'`);
    await queryRunner.query(`ALTER TABLE "farm_users" ADD "pay_deduction_amount" integer NOT NULL DEFAULT '0'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`UPDATE role_permissions SET "key" = 'update' WHERE "key" = 'farm.update'`);
    await queryRunner.query(`UPDATE role_permissions SET "key" = 'delete' WHERE "key" = 'farm.delete'`);
    await queryRunner.query(`ALTER TABLE "farm_users" DROP COLUMN "pay_deduction_amount"`);
    await queryRunner.query(`ALTER TABLE "farm_users" DROP COLUMN "pay_rate_per_hour"`);
    await queryRunner.query(`ALTER TABLE "farms" DROP COLUMN "pay_deduction_amount"`);
    await queryRunner.query(`ALTER TABLE "farms" DROP COLUMN "pay_rate_per_hour"`);
  }
}
