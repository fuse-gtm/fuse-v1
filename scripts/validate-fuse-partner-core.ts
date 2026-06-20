import assert from 'node:assert/strict';
import { resolve } from 'node:path';

import { buildManifest } from '../packages/twenty-sdk/src/cli/utilities/build/manifest/manifest-build';
import { validatePartnerAppSpec } from '../packages/twenty-shared/src/application/validatePartnerAppSpec';
import {
  FIELD_IDS,
  NAVIGATION_IDS,
  OBJECT_IDS,
  VIEW_IDS,
} from '../packages/twenty-apps/internal/fuse-partner-core/src/constants/universal-identifiers';
import { fusePartnerCoreSpec } from '../packages/twenty-apps/internal/fuse-partner-core/src/partner-app-spec';

const appPath = resolve(
  process.cwd(),
  'packages/twenty-apps/internal/fuse-partner-core',
);

const assertIncludesIds = (
  label: string,
  actualIds: string[],
  requiredIds: string[],
) => {
  const missingIds = requiredIds.filter((id) => !actualIds.includes(id));

  assert.deepEqual(missingIds, [], `${label} missing required IDs`);
};

const main = async () => {
  const { manifest, errors } = await buildManifest(appPath);

  if (errors.length > 0) {
    console.error('Fuse Partner Core manifest build failed:');

    for (const error of errors) {
      console.error(`- ${error}`);
    }

    process.exit(1);
  }

  assert.ok(manifest, 'Fuse Partner Core manifest was not built.');

  const specValidation = validatePartnerAppSpec(fusePartnerCoreSpec);

  if (!specValidation.valid) {
    console.error('Fuse Partner Core spec validation failed:');

    for (const issue of specValidation.issues) {
      console.error(`- ${issue.path}: ${issue.message}`);
    }

    process.exit(1);
  }

  const customObjectFieldCount = manifest.objects.reduce(
    (fieldCount, object) => fieldCount + object.fields.length,
    0,
  );

  const manifestSummary = {
    objects: manifest.objects.length,
    customObjectFields: customObjectFieldCount,
    topLevelFields: manifest.fields.length,
    roles: manifest.roles.length,
    views: manifest.views.length,
    navigationMenuItems: manifest.navigationMenuItems.length,
    logicFunctions: manifest.logicFunctions.length,
  };

  assert.equal(manifest.objects.length, 3);
  assert.equal(manifest.roles.length, 1);
  assert.equal(manifest.views.length, 3);
  assert.equal(manifest.navigationMenuItems.length, 4);
  assert.equal(manifest.logicFunctions.length, 1);

  assertIncludesIds(
    'custom objects',
    manifest.objects.map((object) => object.universalIdentifier),
    Object.values(OBJECT_IDS),
  );

  assertIncludesIds(
    'standard object extension fields',
    manifest.fields.map((field) => field.universalIdentifier),
    [
      ...Object.values(FIELD_IDS.company),
      ...Object.values(FIELD_IDS.person),
      ...Object.values(FIELD_IDS.opportunity),
    ],
  );

  assertIncludesIds(
    'custom object fields',
    manifest.objects.flatMap((object) =>
      object.fields.map((field) => field.universalIdentifier),
    ),
    [
      ...Object.values(FIELD_IDS.partnerProfile),
      ...Object.values(FIELD_IDS.partnerProgram),
      ...Object.values(FIELD_IDS.partnerEnrollment),
    ],
  );

  assertIncludesIds(
    'views',
    manifest.views.map((view) => view.universalIdentifier),
    Object.values(VIEW_IDS),
  );

  assertIncludesIds(
    'navigation menu items',
    manifest.navigationMenuItems.map((item) => item.universalIdentifier),
    Object.values(NAVIGATION_IDS),
  );

  console.log('Fuse Partner Core validation passed:');
  console.log(JSON.stringify(manifestSummary, null, 2));
};

void main();
