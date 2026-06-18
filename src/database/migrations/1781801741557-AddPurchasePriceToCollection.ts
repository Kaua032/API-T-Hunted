import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPurchasePriceToCollection1781801741557 implements MigrationInterface {
    name = 'AddPurchasePriceToCollection1781801741557'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "collections" ADD "purchase_price" numeric(10,2)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "collections" DROP COLUMN "purchase_price"`);
    }

}
