import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCollectionsTable1781613810415 implements MigrationInterface {
    name = 'CreateCollectionsTable1781613810415'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."collections_condition_enum" AS ENUM('loose', 'carded')`);
        await queryRunner.query(`CREATE TABLE "collections" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "quantity" integer NOT NULL DEFAULT '1', "condition" "public"."collections_condition_enum" NOT NULL DEFAULT 'loose', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, "carId" uuid, CONSTRAINT "UQ_333a19aba91851a4a7c7c531346" UNIQUE ("userId", "carId", "condition"), CONSTRAINT "PK_21c00b1ebbd41ba1354242c5c4e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "collections" ADD CONSTRAINT "FK_da613d6625365707f8df0f65d81" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "collections" ADD CONSTRAINT "FK_d7a70d78b475ee97d21619a8c2f" FOREIGN KEY ("carId") REFERENCES "cars"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "collections" DROP CONSTRAINT "FK_d7a70d78b475ee97d21619a8c2f"`);
        await queryRunner.query(`ALTER TABLE "collections" DROP CONSTRAINT "FK_da613d6625365707f8df0f65d81"`);
        await queryRunner.query(`DROP TABLE "collections"`);
        await queryRunner.query(`DROP TYPE "public"."collections_condition_enum"`);
    }

}
