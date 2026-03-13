import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1773382902093 implements MigrationInterface {
  name = 'Migration1773382902093';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "role_permissions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "key" character varying(50) NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "role_id" uuid NOT NULL, CONSTRAINT "ROLE_PERMISSIONS_PK" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE UNIQUE INDEX "ROLE_PERMISSIONS_UK" ON "role_permissions" ("role_id", "key") `);
    await queryRunner.query(
      `CREATE TABLE "roles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(50) NOT NULL, "required" boolean NOT NULL DEFAULT false, "super" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "farm_id" uuid NOT NULL, CONSTRAINT "ROLES_PK" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE INDEX "ROLES_FARM_ID_IDX" ON "roles" ("farm_id") `);
    await queryRunner.query(`CREATE UNIQUE INDEX "ROLES_FARM_ID_NAME_UK" ON "roles" ("farm_id", "name") `);
    await queryRunner.query(
      `CREATE TABLE "farms" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(50) NOT NULL, "timezone" character varying(20) NOT NULL DEFAULT 'Asia/Seoul', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "FARMS_PK" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "farm_users" ("farm_id" uuid NOT NULL, "user_id" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "role_id" uuid, CONSTRAINT "FARM_USERS_PK" PRIMARY KEY ("farm_id", "user_id"))`,
    );
    await queryRunner.query(`CREATE INDEX "FARM_USERS_ROLE_ID_IDX" ON "farm_users" ("role_id") WHERE role_id IS NOT NULL`);
    await queryRunner.query(
      `CREATE TABLE "user_usages" ("user_id" uuid NOT NULL, "farm_count" integer NOT NULL DEFAULT '0', "farm_limit" integer NOT NULL DEFAULT '3', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "USER_USAGES_PK" PRIMARY KEY ("user_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(340) NOT NULL, "password" character varying(255) NOT NULL, "name" character varying(50) NOT NULL, "status" character varying(20) NOT NULL DEFAULT 'activated', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "USERS_PK" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "attendances" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "work_date" date NOT NULL, "farm_id" uuid NOT NULL, "user_id" uuid NOT NULL, "checked_in_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(), "checked_out_at" TIMESTAMP WITH TIME ZONE, "status" character varying(10) NOT NULL DEFAULT 'in', "seconds" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "ATTENDANCES_PK" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE UNIQUE INDEX "ATTENDANCES_UQ" ON "attendances" ("work_date", "farm_id", "user_id") `);
    await queryRunner.query(
      `ALTER TABLE "role_permissions" ADD CONSTRAINT "ROLE_PERMISSIONS_ROLE_FK" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`ALTER TABLE "roles" ADD CONSTRAINT "ROLES_FARM_FK" FOREIGN KEY ("farm_id") REFERENCES "farms"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "farm_users" ADD CONSTRAINT "FARM_USERS_FARM_FK" FOREIGN KEY ("farm_id") REFERENCES "farms"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "farm_users" ADD CONSTRAINT "FARM_USERS_USER_FK" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "farm_users" ADD CONSTRAINT "FARM_USERS_ROLE_FK" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    await queryRunner.query(
      `ALTER TABLE "user_usages" ADD CONSTRAINT "USER_USAGES_USER_FK" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "attendances" ADD CONSTRAINT "ATTENDANCES_FARM_FK" FOREIGN KEY ("farm_id") REFERENCES "farms"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "attendances" ADD CONSTRAINT "ATTENDANCES_USER_FK" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "attendances" DROP CONSTRAINT "ATTENDANCES_USER_FK"`);
    await queryRunner.query(`ALTER TABLE "attendances" DROP CONSTRAINT "ATTENDANCES_FARM_FK"`);
    await queryRunner.query(`ALTER TABLE "user_usages" DROP CONSTRAINT "USER_USAGES_USER_FK"`);
    await queryRunner.query(`ALTER TABLE "farm_users" DROP CONSTRAINT "FARM_USERS_ROLE_FK"`);
    await queryRunner.query(`ALTER TABLE "farm_users" DROP CONSTRAINT "FARM_USERS_USER_FK"`);
    await queryRunner.query(`ALTER TABLE "farm_users" DROP CONSTRAINT "FARM_USERS_FARM_FK"`);
    await queryRunner.query(`ALTER TABLE "roles" DROP CONSTRAINT "ROLES_FARM_FK"`);
    await queryRunner.query(`ALTER TABLE "role_permissions" DROP CONSTRAINT "ROLE_PERMISSIONS_ROLE_FK"`);
    await queryRunner.query(`DROP INDEX "public"."ATTENDANCES_UQ"`);
    await queryRunner.query(`DROP TABLE "attendances"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "user_usages"`);
    await queryRunner.query(`DROP INDEX "public"."FARM_USERS_ROLE_ID_IDX"`);
    await queryRunner.query(`DROP TABLE "farm_users"`);
    await queryRunner.query(`DROP TABLE "farms"`);
    await queryRunner.query(`DROP INDEX "public"."ROLES_FARM_ID_NAME_UK"`);
    await queryRunner.query(`DROP INDEX "public"."ROLES_FARM_ID_IDX"`);
    await queryRunner.query(`DROP TABLE "roles"`);
    await queryRunner.query(`DROP INDEX "public"."ROLE_PERMISSIONS_UK"`);
    await queryRunner.query(`DROP TABLE "role_permissions"`);
  }
}
