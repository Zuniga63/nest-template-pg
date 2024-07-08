import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeProfilePathToJson1720409191140 implements MigrationInterface {
  name = 'ChangeProfilePathToJson1720409191140';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "profile_photo_path"`);
    await queryRunner.query(`ALTER TABLE "users" ADD "profile_photo_path" json`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "profile_photo_path"`);
    await queryRunner.query(`ALTER TABLE "users" ADD "profile_photo_path" text`);
  }
}
