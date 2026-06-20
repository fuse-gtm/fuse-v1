import assert from 'node:assert/strict';
import {
  AgencyReferralAttributionError,
  createAgencyReferralEventPlan,
  repairAgencyReferralRollups,
  signAgencyReferralEvent,
  type AgencyReferralEventInput,
} from 'src/lifecycle/agency-referral-attribution';

const secret = 'test-secret';
const baseEvent = {
  eventId: 'evt-lead-1',
  eventType: 'lead',
  enrollmentId: 'enrollment-1',
  customerId: 'customer-1',
  partnerProfileId: 'partner-profile-1',
  agencyGroupId: 'agency-group-1',
  occurredAt: '2026-06-20T12:00:00.000Z',
  payload: { source: 'unit-test' },
} satisfies Omit<AgencyReferralEventInput, 'signature'>;

const withSignature = (
  event: Omit<AgencyReferralEventInput, 'signature'>,
) => ({
  ...event,
  signature: signAgencyReferralEvent(event, secret),
});

{
  const plan = createAgencyReferralEventPlan(withSignature(baseEvent), secret);

  assert.equal(plan.accepted, true);
  assert.equal(plan.eventData.status, 'accepted');
  assert.equal(plan.eventData.eventType, 'lead');
  assert.equal(plan.attributionData?.attributionType, 'referral');
  assert.deepEqual(plan.rollupDelta, {
    leadCount: 1,
    saleCount: 0,
    revenueCents: 0,
  });
}

{
  const saleEvent = withSignature({
    ...baseEvent,
    eventId: 'evt-sale-1',
    eventType: 'sale',
    invoiceId: 'invoice-1',
    amountCents: 9900,
  });
  const plan = createAgencyReferralEventPlan(saleEvent, secret);

  assert.equal(plan.accepted, true);
  assert.equal(plan.attributionData?.amountCents, 9900);
  assert.deepEqual(plan.rollupDelta, {
    leadCount: 0,
    saleCount: 1,
    revenueCents: 9900,
  });
}

{
  const plan = createAgencyReferralEventPlan(
    withSignature(baseEvent),
    secret,
    {
      eventIds: ['evt-lead-1'],
    },
  );

  assert.equal(plan.accepted, false);
  assert.equal(plan.duplicateReason, 'event_id');
  assert.equal(plan.attributionData, null);
}

{
  const saleEvent = withSignature({
    ...baseEvent,
    eventId: 'evt-sale-duplicate',
    eventType: 'sale',
    invoiceId: 'invoice-duplicate',
    amountCents: 12000,
  });
  const plan = createAgencyReferralEventPlan(saleEvent, secret, {
    invoiceIds: ['invoice-duplicate'],
  });

  assert.equal(plan.accepted, false);
  assert.equal(plan.duplicateReason, 'invoice_id');
}

{
  const missingEnrollmentEvent = {
    ...baseEvent,
    enrollmentId: undefined,
  };

  assert.throws(
    () =>
      createAgencyReferralEventPlan(
        withSignature(missingEnrollmentEvent),
        secret,
      ),
    (error) =>
      error instanceof AgencyReferralAttributionError &&
      error.code === 'MISSING_REQUIRED_FIELD' &&
      error.field === 'enrollmentId',
  );
}

{
  assert.throws(
    () =>
      createAgencyReferralEventPlan(
        {
          ...baseEvent,
          signature: 'bad-signature',
        },
        secret,
      ),
    (error) =>
      error instanceof AgencyReferralAttributionError &&
      error.code === 'INVALID_SIGNATURE',
  );
}

{
  const rollups = repairAgencyReferralRollups([
    {
      ...baseEvent,
      eventId: 'evt-lead-1',
      eventType: 'lead',
      amountCents: 0,
      occurredAt: '2026-06-20T12:00:00.000Z',
    },
    {
      ...baseEvent,
      eventId: 'evt-sale-1',
      eventType: 'sale',
      invoiceId: 'invoice-1',
      amountCents: 9900,
      occurredAt: '2026-06-20T12:05:00.000Z',
    },
  ]);

  const enrollmentRollup = rollups.find(
    (rollup) => rollup.scopeType === 'enrollment',
  );

  assert.equal(enrollmentRollup?.leadCount, 1);
  assert.equal(enrollmentRollup?.saleCount, 1);
  assert.equal(enrollmentRollup?.revenueCents, 9900);
  assert.equal(enrollmentRollup?.repairStatus, 'repaired');
}

console.log('Fuse Agency referral attribution validation passed.');
