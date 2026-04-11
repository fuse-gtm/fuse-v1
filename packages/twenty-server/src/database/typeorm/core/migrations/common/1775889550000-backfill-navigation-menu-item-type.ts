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

    // Re-apply NOT NULL + CHECK constraint that may have silently failed
    await makeNavigationMenuItemTypeNotNullQueries(queryRunner);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // The down migration for the constraint is already handled by
    // MakeNavigationMenuItemTypeNotNull1773822077682.down — no-op here
    // since we only backfilled data (non-destructive)
  }
}
