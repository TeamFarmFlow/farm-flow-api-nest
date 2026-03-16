import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1773666961216 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO "role_permissions" ("id", "key", "created_at", "role_id")
      SELECT uuid_generate_v4(), 'attendance.history.update', now(), "roles"."id"
      FROM "roles"
      WHERE "roles"."super" = true
        AND NOT EXISTS (
          SELECT 1
          FROM "role_permissions"
          WHERE "role_permissions"."role_id" = "roles"."id"
            AND "role_permissions"."key" = 'attendance.history.update'
        )
    `);
    await queryRunner.query(`
      INSERT INTO "role_permissions" ("id", "key", "created_at", "role_id")
      SELECT uuid_generate_v4(), 'payroll.read', now(), "roles"."id"
      FROM "roles"
      WHERE "roles"."super" = true
        AND NOT EXISTS (
          SELECT 1
          FROM "role_permissions"
          WHERE "role_permissions"."role_id" = "roles"."id"
            AND "role_permissions"."key" = 'payroll.read'
        )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "role_permissions" WHERE "key" = 'attendance.history.update'`);
    await queryRunner.query(`DELETE FROM "role_permissions" WHERE "key" = 'payroll.read'`);
  }
}
