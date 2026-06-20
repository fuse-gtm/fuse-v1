import assert from 'node:assert/strict';
import {
  AGENCY_OPERATOR_ROUTES,
  buildPanelState,
  getApplicationReviewActions,
} from 'src/operator/agency-operator-panel-model';
import {
  AGENCY_PROGRAM_OPERATOR_AGENT_PROMPT,
  AGENCY_PROGRAM_OPERATOR_SKILL_CONTENT,
} from 'src/operator/agency-program-operator-content';
import { classifyAgencyOperatorTerm } from 'src/operator/agency-operator-taxonomy';

{
  const loadingState = buildPanelState({
    records: [],
    isLoading: true,
    error: null,
  });

  assert.equal(loadingState.status, 'loading');
}

{
  const errorState = buildPanelState({
    records: [],
    isLoading: false,
    error: new Error('Route failed'),
  });

  assert.equal(errorState.status, 'error');
  assert.equal(errorState.message, 'Route failed');
}

{
  const readyState = buildPanelState({
    records: [{ id: 'application-id', name: 'Acme Application' }],
    isLoading: false,
    error: null,
  });

  assert.equal(readyState.status, 'ready');
  assert.equal(readyState.records.length, 1);
}

{
  const actions = getApplicationReviewActions('application-id');

  assert.equal(actions.approve.path, AGENCY_OPERATOR_ROUTES.approveApplication);
  assert.equal(actions.reject.path, AGENCY_OPERATOR_ROUTES.rejectApplication);
  assert.deepEqual(actions.approve.body, { applicationId: 'application-id' });
}

{
  assert.deepEqual(classifyAgencyOperatorTerm('agency'), {
    axis: 'partner_type',
    value: 'agency',
  });
  assert.deepEqual(classifyAgencyOperatorTerm('referral'), {
    axis: 'program_mechanic',
    value: 'referral',
  });
  assert.deepEqual(classifyAgencyOperatorTerm('affiliate'), {
    axis: 'invalid_partner_type',
    value: 'affiliate',
  });
}

{
  assert.match(
    AGENCY_PROGRAM_OPERATOR_SKILL_CONTENT,
    /Affiliate is not an Axis 1 partner type/,
  );
  assert.match(
    AGENCY_PROGRAM_OPERATOR_AGENT_PROMPT,
    /referral can be the program mechanic/,
  );
}

console.log('Fuse Agency operator panel and prompt validation passed.');
