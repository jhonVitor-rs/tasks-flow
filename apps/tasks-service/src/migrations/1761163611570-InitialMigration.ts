import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1761163611570 implements MigrationInterface {
    name = 'InitialMigration1761163611570'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "comment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "taskId" uuid NOT NULL, "message" text NOT NULL, "authorId" uuid NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_0b0e4bbc8415ec426f87f3a88e2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_b8868d349c7d34607df4510f99" ON "comment" ("taskId", "createdAt") `);
        await queryRunner.query(`CREATE TYPE "public"."task_status_enum" AS ENUM('todo', 'in_progress', 'review', 'done')`);
        await queryRunner.query(`CREATE TYPE "public"."task_priority_enum" AS ENUM('low', 'medium', 'high', 'urgent')`);
        await queryRunner.query(`CREATE TABLE "task" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" text NOT NULL DEFAULT '', "status" "public"."task_status_enum" NOT NULL DEFAULT 'todo', "priority" "public"."task_priority_enum" NOT NULL DEFAULT 'low', "term" TIMESTAMP NOT NULL, "assigneeIds" text NOT NULL DEFAULT '', "verifiedAssigneeIds" text NOT NULL DEFAULT '', "createdBy" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_fb213f79ee45060ba925ecd576e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_9fc19c95c33ef4d97d09b72ee95" FOREIGN KEY ("taskId") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_9fc19c95c33ef4d97d09b72ee95"`);
        await queryRunner.query(`DROP TABLE "task"`);
        await queryRunner.query(`DROP TYPE "public"."task_priority_enum"`);
        await queryRunner.query(`DROP TYPE "public"."task_status_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b8868d349c7d34607df4510f99"`);
        await queryRunner.query(`DROP TABLE "comment"`);
    }

}
