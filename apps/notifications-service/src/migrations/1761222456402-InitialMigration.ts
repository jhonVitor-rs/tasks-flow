import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1761222456402 implements MigrationInterface {
    name = 'InitialMigration1761222456402'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."notification_type_enum" AS ENUM('created', 'updated', 'deleted', 'assigned', 'commented', 'completed')`);
        await queryRunner.query(`CREATE TABLE "notification" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "public"."notification_type_enum" NOT NULL, "eventName" character varying(100) NOT NULL, "payload" json NOT NULL, "taskId" uuid, "actorId" uuid NOT NULL, "message" character varying(500), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "metadata" json, CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_704ad601e8d5ec67b5e7ec26e0" ON "notification" ("taskId") `);
        await queryRunner.query(`CREATE INDEX "IDX_c5133a026bd1b3d9feccac1a23" ON "notification" ("actorId") `);
        await queryRunner.query(`CREATE INDEX "IDX_8b3ee57671d31c9c0e34192f4e" ON "notification" ("actorId", "createdAt") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_8b3ee57671d31c9c0e34192f4e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c5133a026bd1b3d9feccac1a23"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_704ad601e8d5ec67b5e7ec26e0"`);
        await queryRunner.query(`DROP TABLE "notification"`);
        await queryRunner.query(`DROP TYPE "public"."notification_type_enum"`);
    }

}
