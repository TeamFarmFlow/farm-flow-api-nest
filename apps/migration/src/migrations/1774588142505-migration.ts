import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1774588142505 implements MigrationInterface {
  name = 'Migration1774588142505';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "payrolls" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "start_date" date NOT NULL, "end_date" date NOT NULL, "total_seconds" integer NOT NULL DEFAULT '0', "total_payment_amount" integer NOT NULL DEFAULT '0', "total_deduction_amount" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "farm_id" uuid, "user_id" uuid, CONSTRAINT "PAYROLLS_PK" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE INDEX "PAYROLLS_FARM_USER_ID_IDX" ON "payrolls" ("farm_id", "user_id") WHERE payrolls.farm_id IS NOT NULL AND payrolls.user_id IS NOT NULL`);
    await queryRunner.query(`CREATE INDEX "PAYROLLS_FARM_ID_IDX" ON "payrolls" ("farm_id") WHERE payrolls.farm_id IS NOT NULL`);
    await queryRunner.query(`CREATE INDEX "PAYROLLS_USER_ID_IDX" ON "payrolls" ("user_id") WHERE payrolls.user_id IS NOT NULL`);
    await queryRunner.query(`ALTER TABLE "payrolls" ADD CONSTRAINT "PAYROLLS_FARM_FK" FOREIGN KEY ("farm_id") REFERENCES "farms"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "payrolls" ADD CONSTRAINT "PAYROLLS_USER_FK" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "payrolls" DROP CONSTRAINT "PAYROLLS_USER_FK"`);
    await queryRunner.query(`ALTER TABLE "payrolls" DROP CONSTRAINT "PAYROLLS_FARM_FK"`);
    await queryRunner.query(`DROP INDEX "public"."PAYROLLS_USER_ID_IDX"`);
    await queryRunner.query(`DROP INDEX "public"."PAYROLLS_FARM_ID_IDX"`);
    await queryRunner.query(`DROP INDEX "public"."PAYROLLS_FARM_USER_ID_IDX"`);
    await queryRunner.query(`DROP TABLE "payrolls"`);
  }
}
