import assert from 'node:assert/strict';
import {
  FUSE_COMMERCIAL_MODELS,
  FUSE_PROGRAM_MECHANICS,
  validatePartnerAppSpec,
} from 'twenty-shared/application';
import { fusePartnerCoreSpec } from 'src/partner-app-spec';

const result = validatePartnerAppSpec(fusePartnerCoreSpec);

assert.equal(
  result.valid,
  true,
  result.issues.map((issue) => issue.message).join('\n'),
);

assert.deepEqual(fusePartnerCoreSpec.taxonomy.programMechanics, [
  ...FUSE_PROGRAM_MECHANICS,
]);

assert.deepEqual(fusePartnerCoreSpec.taxonomy.commercialModels, [
  ...FUSE_COMMERCIAL_MODELS,
]);

assert.equal(fusePartnerCoreSpec.standardObjectExtensions.length, 3);
assert.equal(fusePartnerCoreSpec.customObjects.length, 3);
assert.equal(fusePartnerCoreSpec.views.length, 3);
assert.equal(fusePartnerCoreSpec.navigationMenuItems.length, 4);
assert.equal(fusePartnerCoreSpec.seedData.length, 3);

console.log('Fuse Partner Core spec validation passed.');
