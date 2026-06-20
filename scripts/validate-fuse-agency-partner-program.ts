import assert from 'node:assert/strict';
import { resolve } from 'node:path';

import { buildManifest } from '../packages/twenty-sdk/src/cli/utilities/build/manifest/manifest-build';
import { validatePartnerAppSpec } from '../packages/twenty-shared/src/application/validatePartnerAppSpec';
import {
  FIELD_IDS,
  FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
  NAVIGATION_IDS,
  OBJECT_IDS,
  PAGE_LAYOUT_IDS,
  POST_INSTALL_UNIVERSAL_IDENTIFIER,
  VIEW_IDS,
} from '../packages/twenty-apps/internal/fuse-agency-partner-program/src/constants/universal-identifiers';
import { fuseAgencyPartnerProgramSpec } from '../packages/twenty-apps/internal/fuse-agency-partner-program/src/partner-app-spec';

const appPath = resolve(
  process.cwd(),
  'packages/twenty-apps/internal/fuse-agency-partner-program',
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
  console.log('Building Fuse Agency Partner Program manifest...');

  const { manifest, errors } = await buildManifest(appPath);

  if (errors.length > 0) {
    console.error('Fuse Agency Partner Program manifest build failed:');

    for (const error of errors) {
      console.error(`- ${error}`);
    }

    process.exit(1);
  }

  assert.ok(manifest, 'Fuse Agency Partner Program manifest was not built.');

  console.log('Validating Fuse Agency Partner Program spec...');

  const specValidation = validatePartnerAppSpec(fuseAgencyPartnerProgramSpec);

  if (!specValidation.valid) {
    console.error('Fuse Agency Partner Program spec validation failed:');

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
    pageLayouts: manifest.pageLayouts.length,
    frontComponents: manifest.frontComponents.length,
    logicFunctions: manifest.logicFunctions.length,
  };

  assert.equal(manifest.objects.length, 5);
  assert.equal(manifest.roles.length, 1);
  assert.equal(manifest.views.length, 7);
  assert.equal(manifest.navigationMenuItems.length, 8);
  assert.equal(manifest.pageLayouts.length, 1);
  assert.equal(manifest.frontComponents.length, 1);
  assert.equal(manifest.logicFunctions.length, 1);

  assertIncludesIds(
    'custom objects',
    manifest.objects.map((object) => object.universalIdentifier),
    Object.values(OBJECT_IDS),
  );

  assertIncludesIds(
    'standard and core object extension fields',
    manifest.fields.map((field) => field.universalIdentifier),
    [
      ...Object.values(FIELD_IDS.company),
      ...Object.values(FIELD_IDS.person),
      ...Object.values(FIELD_IDS.opportunity),
      ...Object.values(FIELD_IDS.partnerProfile),
    ],
  );

  assertIncludesIds(
    'custom object fields',
    manifest.objects.flatMap((object) =>
      object.fields.map((field) => field.universalIdentifier),
    ),
    [
      ...Object.values(FIELD_IDS.agencyApplication),
      ...Object.values(FIELD_IDS.agencyServiceCapability),
      ...Object.values(FIELD_IDS.agencyResource),
      ...Object.values(FIELD_IDS.agencyAttribution),
      ...Object.values(FIELD_IDS.agencyTask),
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

  assertIncludesIds(
    'page layouts',
    manifest.pageLayouts.map((pageLayout) => pageLayout.universalIdentifier),
    [PAGE_LAYOUT_IDS.partnerProfile],
  );

  assertIncludesIds(
    'front components',
    manifest.frontComponents.map(
      (frontComponent) => frontComponent.universalIdentifier,
    ),
    [FRONT_COMPONENT_UNIVERSAL_IDENTIFIER],
  );

  assertIncludesIds(
    'logic functions',
    manifest.logicFunctions.map(
      (logicFunction) => logicFunction.universalIdentifier,
    ),
    [POST_INSTALL_UNIVERSAL_IDENTIFIER],
  );

  console.log('Fuse Agency Partner Program validation passed:');
  console.log(JSON.stringify(manifestSummary, null, 2));
};

void main();
