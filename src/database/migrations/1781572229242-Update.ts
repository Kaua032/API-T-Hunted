import { MigrationInterface, QueryRunner } from "typeorm";

export class Update1781572229242 implements MigrationInterface {
    name = 'Update1781572229242'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "cars" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "toy_number" character varying(50) NOT NULL, "name" character varying(255) NOT NULL, "series" character varying(150) NOT NULL, "year" integer NOT NULL, "image_url" character varying, "is_th" boolean NOT NULL DEFAULT false, "is_sth" boolean NOT NULL DEFAULT false, "average_price" numeric(10,2), "last_update_at" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_66c1ab2fc03062a1e95dde9c837" UNIQUE ("toy_number"), CONSTRAINT "PK_fc218aa84e79b477d55322271b6" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "cars"`);
    }

}
