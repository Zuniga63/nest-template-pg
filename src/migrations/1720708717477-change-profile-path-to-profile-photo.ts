import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeProfilePathToProfilePhoto1720708717477 implements MigrationInterface {
  name = 'ChangeProfilePathToProfilePhoto1720708717477';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "profile_photo_path" TO "profile_photo"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "profile_photo" TO "profile_photo_path"`);
  }
}
