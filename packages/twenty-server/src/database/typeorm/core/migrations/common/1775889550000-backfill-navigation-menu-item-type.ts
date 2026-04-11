import { type MigrationInterface, type QueryRunner } from 'typeorm';

import { makeNavigationMenuItemTypeNotNullQueries } from 'src/database/typeorm/core/migrations/utils/1773681736596-makeNavigationMenuItemTypeNotNull.util';

export class BackfillNavigationMenuItemType1775889550000
  implements MigrationInterface
{
  name = 'BackfillNavigationMenuItemType1775889550000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Backfill type from existing FK relationships for rows left NULL
    // by the original add-type migration (1773681736596)
    await queryRunner.query(`
      UPDATE core."navigationMenuItem"
      SET type = CASE
        WHEN "viewId" IS NOT NULL THEN 'VIEW'
        WHEN "targetRecordId" IS NOT NULL AND "targetObjectMetadataId" IS NOT NULL THEN 'RECORD'
        WHEN "targetObjectMetadataId" IS NOT NULL THEN 'OBJECT'
        WHEN "link" IS NOT NULL THEN 'LINK'
        ELSE 'OBJECT'
      END
      WHERE type IS NULL
    `);

    // Backfill name from related objectMetadata or view
    await queryRunner.query(`
      UPDATE core."navigationMenuItem" nmi
      SET name = COALESCE(
        (SELECT om."namePlural" FROM core."objectMetadata" om WHERE om.id = nmi."targetObjectMetadataId"),
        (SELECT v."name" FROM core."view" v WHERE v.id = nmi."viewId"),
        'Unnamed'
      )
      WHERE nmi.name IS NULL
    `);

    // Delete orphaned rows that cannot satisfy the CHECK constraint
    // (e.g. type='OBJECT' but targetObjectMetadataId IS NULL)
    await queryRunner.query(`
      DELETE FROM core."navigationMenuItem"
      WHERE NOT (
        ("type" = 'FOLDER')
        OR ("type" = 'OBJECT' AND "targetObjectMetadataId" IS NOT NULL)
        OR ("type" = 'VIEW' AND "viewId" IS NOT NULL)
        OR ("type" = 'RECORD' AND "targetRecordId" IS NOT NULL AND "targetObjectMetadataId" IS NOT NULL)
        OR ("type" = 'LINK' AND "link" IS NOT NULL)
      )
    `);

    // Re-apply NOT NULL + CHECK constraint that may have silently failed
    // in the original migration (1773822077682). Wrapped in savepoint so
    // a failure does not block server startup.
    const savepointName = 'sp_backfill_nav_type_constraint';

    try {
      await queryRunner.query(`SAVEPOINT ${savepointName}`);
      await makeNavigationMenuItemTypeNotNullQueries(queryRunner);
      await queryRunner.query(`RELEASE SAVEPOINT ${savepointName}`);
    } catch (e) {
      try {
        await queryRunner.query(`ROLLBACK TO SAVEPOINT ${savepointName}`);
        await queryRunner.query(`RELEASE SAVEPOINT ${savepointName}`);
      } catch (rollbackError) {
        // oxlint-disable-next-line no-console
        console.error(
          'Failed to rollback savepoint in BackfillNavigationMenuItemType1775889550000',
          rollbackError,
        );
        throw rollbackError;
      }

      // oxlint-disable-next-line no-console
      console.error(
        'Constraint application failed in BackfillNavigationMenuItemType1775889550000 — data was backfilled but NOT NULL + CHECK not applied',
        e,
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "core"."navigationMenuItem" DROP CONSTRAINT IF EXISTS "CHK_navigation_menu_item_type_fields"`,
    );

    await queryRunner.query(
      `ALTER TABLE "core"."navigationMenuItem" ALTER COLUMN "type" DROP NOT NULL`,
    );
  }
}
