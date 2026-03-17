import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1773749120937 implements MigrationInterface {
  name = 'Migration1773749120937';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "attendances" ADD "payrolled" boolean NOT NULL DEFAULT false`);
    await queryRunner.query(`ALTER TABLE "attendances" ADD "deleted_at" TIMESTAMP WITH TIME ZONE`);
    await queryRunner.query(`DROP INDEX "public"."ATTENDANCES_UQ"`);
    await queryRunner.query(`CREATE UNIQUE INDEX "ATTENDANCES_UQ" ON "attendances" ("farm_id", "user_id", "work_date") WHERE "deleted_at" IS NULL`);
    await queryRunner.query(`UPDATE "role_permissions" SET "key" = 'payroll.attendance.history.update' WHERE "key" = 'attendance.history.update'`);
    await queryRunner.query(`
      INSERT INTO "role_permissions" ("id", "key", "created_at", "role_id")
      SELECT uuid_generate_v4(), 'payroll.check', now(), "roles"."id"
      FROM "roles"
      WHERE "roles"."super" = true
        AND NOT EXISTS (
          SELECT 1
          FROM "role_permissions"
          WHERE "role_permissions"."role_id" = "roles"."id"
            AND "role_permissions"."key" = 'payroll.check'
        )
    `);
    await queryRunner.query(`
      INSERT INTO "role_permissions" ("id", "key", "created_at", "role_id")
      SELECT uuid_generate_v4(), 'payroll.attendance.history.delete', now(), "roles"."id"
      FROM "roles"
      WHERE "roles"."super" = true
        AND NOT EXISTS (
          SELECT 1
          FROM "role_permissions"
          WHERE "role_permissions"."role_id" = "roles"."id"
            AND "role_permissions"."key" = 'payroll.attendance.history.delete'
        )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "attendances" WHERE "deleted_at" IS NOT NULL`);
    await queryRunner.query(`DROP INDEX "public"."ATTENDANCES_UQ"`);
    await queryRunner.query(`CREATE UNIQUE INDEX "ATTENDANCES_UQ" ON "attendances" ("farm_id", "user_id", "work_date")`);
    await queryRunner.query(`ALTER TABLE "attendances" DROP COLUMN "deleted_at"`);
    await queryRunner.query(`ALTER TABLE "attendances" DROP COLUMN "payrolled"`);
    await queryRunner.query(`UPDATE "role_permissions" SET "key" = 'attendance.history.update' WHERE "key" = 'payroll.attendance.history.update'`);
    await queryRunner.query(`DELETE FROM "role_permissions" WHERE key IN ('payroll.check', 'payroll.attendance.history.delete')`);
  }
}
