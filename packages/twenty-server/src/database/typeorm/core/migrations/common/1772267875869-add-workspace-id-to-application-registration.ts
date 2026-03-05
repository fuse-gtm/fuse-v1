import { type MigrationInterface, type QueryRunner } from 'typeorm';

export class AddWorkspaceIdToApplicationRegistration1772267875869
  implements MigrationInterface
{
  name = 'AddWorkspaceIdToApplicationRegistration1772267875869';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "core"."applicationRegistration" ADD "workspaceId" uuid`,
    );

    // Backfill workspaceId from linked applications.
    // A registration may be installed in multiple workspaces, so use
    // DISTINCT ON to deterministically pick the earliest installation.
    await queryRunner.query(`
      UPDATE "core"."applicationRegistration" ar
      SET "workspaceId" = earliest."workspaceId"
      FROM (
        SELECT DISTINCT ON ("applicationRegistrationId")
          "applicationRegistrationId", "workspaceId"
        FROM "core"."application"
        WHERE "workspaceId" IS NOT NULL
          AND "deletedAt" IS NULL
        ORDER BY "applicationRegistrationId", "createdAt" ASC
      ) earliest
      WHERE earliest."applicationRegistrationId" = ar."id"
        AND ar."workspaceId" IS NULL
    `);

    // Secondary backfill: for registrations still without a workspace,
    // infer from the creator's earliest workspace membership.
    await queryRunner.query(`
      UPDATE "core"."applicationRegistration" ar
      SET "workspaceId" = uw_first."workspaceId"
      FROM (
        SELECT DISTINCT ON ("userId")
          "userId", "workspaceId"
        FROM "core"."userWorkspace"
        WHERE "deletedAt" IS NULL
        ORDER BY "userId", "createdAt" ASC
      ) uw_first
      WHERE uw_first."userId" = ar."createdByUserId"
        AND ar."workspaceId" IS NULL
    `);

    // Column stays nullable — any remaining registrations with no
    // linked application and no identifiable creator workspace are
    // preserved rather than dropped.

    await queryRunner.query(`
      CREATE INDEX "IDX_APPLICATION_REGISTRATION_WORKSPACE_ID"
      ON "core"."applicationRegistration" ("workspaceId")
    `);

    await queryRunner.query(
      `ALTER TABLE "core"."applicationRegistration" ADD CONSTRAINT "FK_94ab20372e448d45088357f884e" FOREIGN KEY ("workspaceId") REFERENCES "core"."workspace"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "core"."applicationRegistration" DROP CONSTRAINT "FK_94ab20372e448d45088357f884e"`,
    );

    await queryRunner.query(
      `DROP INDEX "core"."IDX_APPLICATION_REGISTRATION_WORKSPACE_ID"`,
    );

    await queryRunner.query(
      `ALTER TABLE "core"."applicationRegistration" DROP COLUMN "workspaceId"`,
    );
  }
}
