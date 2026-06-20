import assert from 'node:assert/strict';
import { validatePartnerAppSpec } from 'twenty-shared/application';
import { fuseAgencyPartnerProgramSpec } from 'src/partner-app-spec';

const result = validatePartnerAppSpec(fuseAgencyPartnerProgramSpec);

assert.equal(
  result.valid,
  true,
  result.issues.map((issue) => issue.message).join('\n'),
);

assert.equal(fuseAgencyPartnerProgramSpec.taxonomy.partnerType, 'agency');
assert.deepEqual(fuseAgencyPartnerProgramSpec.requiredApplicationVariables, [
  'AGENCY_EVENT_SIGNING_SECRET',
]);
assert.deepEqual(fuseAgencyPartnerProgramSpec.taxonomy.programMechanics, [
  'referral',
  'services',
]);
assert.ok(
  fuseAgencyPartnerProgramSpec.taxonomy.commercialModels.includes(
    'commission',
  ),
);

assert.equal(fuseAgencyPartnerProgramSpec.standardObjectExtensions.length, 3);
assert.equal(fuseAgencyPartnerProgramSpec.customObjects.length, 9);
assert.equal(fuseAgencyPartnerProgramSpec.relationFields.length, 33);
assert.equal(fuseAgencyPartnerProgramSpec.views.length, 11);
assert.equal(fuseAgencyPartnerProgramSpec.pageLayouts.length, 1);
assert.equal(fuseAgencyPartnerProgramSpec.navigationMenuItems.length, 12);
assert.equal(fuseAgencyPartnerProgramSpec.frontComponents.length, 3);
assert.equal(fuseAgencyPartnerProgramSpec.logicFunctions.length, 6);
assert.equal(fuseAgencyPartnerProgramSpec.skills.length, 1);
assert.equal(fuseAgencyPartnerProgramSpec.agents.length, 1);
assert.equal(fuseAgencyPartnerProgramSpec.seedData.length, 5);

console.log('Fuse Agency Partner Program spec validation passed.');
