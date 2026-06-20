import { createHmac, timingSafeEqual } from 'node:crypto';

export type AgencyReferralEventType = 'lead' | 'sale';

export type AgencyReferralEventInput = {
  eventId?: string;
  eventType?: AgencyReferralEventType | string;
  signature?: string;
  partnerProfileId?: string;
  agencyGroupId?: string;
  enrollmentId?: string;
  customerId?: string;
  invoiceId?: string;
  amountCents?: number;
  occurredAt?: string;
  payload?: Record<string, unknown>;
};

export type AgencyReferralIdempotencyContext = {
  eventIds?: string[];
  invoiceIds?: string[];
  customerEnrollmentKeys?: string[];
};

export type AgencyReferralAcceptedEvent = Required<
  Pick<
    AgencyReferralEventInput,
    'eventId' | 'eventType' | 'enrollmentId' | 'customerId' | 'occurredAt'
  >
> & {
  amountCents: number;
  invoiceId?: string;
  partnerProfileId?: string;
  agencyGroupId?: string;
};

export type AgencyReferralAttributionErrorCode =
  | 'MISSING_REQUIRED_FIELD'
  | 'INVALID_SIGNATURE'
  | 'UNSUPPORTED_EVENT_TYPE';

export class AgencyReferralAttributionError extends Error {
  constructor(
    readonly code: AgencyReferralAttributionErrorCode,
    readonly field: string,
    message: string,
  ) {
    super(message);
    this.name = 'AgencyReferralAttributionError';
  }
}

const requireString = (
  value: string | undefined,
  field: string,
): string => {
  const normalizedValue = value?.trim();

  if (!normalizedValue) {
    throw new AgencyReferralAttributionError(
      'MISSING_REQUIRED_FIELD',
      field,
      `${field} is required.`,
    );
  }

  return normalizedValue;
};

export const canonicalizeReferralEvent = (
  input: Omit<AgencyReferralEventInput, 'signature'>,
) =>
  JSON.stringify(
    Object.entries(input)
      .filter(([, value]) => value !== undefined)
      .sort(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey))
      .reduce<Record<string, unknown>>((acc, [key, value]) => {
        acc[key] = value;

        return acc;
      }, {}),
  );

export const signAgencyReferralEvent = (
  input: Omit<AgencyReferralEventInput, 'signature'>,
  secret: string,
) =>
  createHmac('sha256', secret)
    .update(canonicalizeReferralEvent(input))
    .digest('hex');

const assertValidSignature = (
  input: AgencyReferralEventInput,
  secret: string,
) => {
  const signature = requireString(input.signature, 'signature');
  const unsignedInput = { ...input };

  delete unsignedInput.signature;

  const expectedSignature = signAgencyReferralEvent(unsignedInput, secret);
  const actual = Buffer.from(signature, 'hex');
  const expected = Buffer.from(expectedSignature, 'hex');

  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) {
    throw new AgencyReferralAttributionError(
      'INVALID_SIGNATURE',
      'signature',
      'signature does not match the event payload.',
    );
  }
};

const normalizeEvent = (
  input: AgencyReferralEventInput,
): AgencyReferralAcceptedEvent => {
  const eventId = requireString(input.eventId, 'eventId');
  const enrollmentId = requireString(input.enrollmentId, 'enrollmentId');
  const customerId = requireString(input.customerId, 'customerId');
  const occurredAt = input.occurredAt ?? new Date().toISOString();

  if (input.eventType !== 'lead' && input.eventType !== 'sale') {
    throw new AgencyReferralAttributionError(
      'UNSUPPORTED_EVENT_TYPE',
      'eventType',
      'eventType must be lead or sale.',
    );
  }

  if (input.eventType === 'sale') {
    requireString(input.invoiceId, 'invoiceId');
  }

  return {
    eventId,
    eventType: input.eventType,
    enrollmentId,
    customerId,
    invoiceId: input.invoiceId,
    amountCents: input.eventType === 'sale' ? (input.amountCents ?? 0) : 0,
    occurredAt,
    partnerProfileId: input.partnerProfileId,
    agencyGroupId: input.agencyGroupId,
  };
};

export const createAgencyReferralEventPlan = (
  input: AgencyReferralEventInput,
  secret: string,
  idempotency: AgencyReferralIdempotencyContext = {},
) => {
  const signingSecret = requireString(secret, 'AGENCY_EVENT_SIGNING_SECRET');

  assertValidSignature(input, signingSecret);

  const event = normalizeEvent(input);
  const customerEnrollmentKey = `${event.enrollmentId}:${event.customerId}`;
  const duplicateReason =
    idempotency.eventIds?.includes(event.eventId)
      ? 'event_id'
      : event.invoiceId && idempotency.invoiceIds?.includes(event.invoiceId)
        ? 'invoice_id'
        : idempotency.customerEnrollmentKeys?.includes(customerEnrollmentKey)
          ? 'customer_enrollment'
          : null;

  if (duplicateReason) {
    return {
      accepted: false,
      duplicateReason,
      eventData: {
        name: `${event.eventType}:${event.eventId}`,
        eventId: event.eventId,
        eventType: event.eventType,
        signature: input.signature,
        customerId: event.customerId,
        invoiceId: event.invoiceId,
        enrollmentId: event.enrollmentId,
        amountCents: event.amountCents,
        status: 'duplicate',
        occurredAt: event.occurredAt,
        payloadJson: JSON.stringify(input.payload ?? {}),
        partnerProfileId: event.partnerProfileId,
        agencyGroupId: event.agencyGroupId,
      },
      attributionData: null,
      rollupDelta: { leadCount: 0, saleCount: 0, revenueCents: 0 },
    };
  }

  return {
    accepted: true,
    duplicateReason: null,
    eventData: {
      name: `${event.eventType}:${event.eventId}`,
      eventId: event.eventId,
      eventType: event.eventType,
      signature: input.signature,
      customerId: event.customerId,
      invoiceId: event.invoiceId,
      enrollmentId: event.enrollmentId,
      amountCents: event.amountCents,
      status: 'accepted',
      occurredAt: event.occurredAt,
      payloadJson: JSON.stringify(input.payload ?? {}),
      partnerProfileId: event.partnerProfileId,
      agencyGroupId: event.agencyGroupId,
    },
    attributionData: {
      name: `${event.eventType}:${event.eventId}`,
      attributionType:
        event.eventType === 'lead' ? 'referral' : 'services_influence',
      sourceEventId: event.eventId,
      amountCents: event.amountCents,
      status: 'accepted',
      partnerProfileId: event.partnerProfileId,
    },
    rollupDelta: {
      leadCount: event.eventType === 'lead' ? 1 : 0,
      saleCount: event.eventType === 'sale' ? 1 : 0,
      revenueCents: event.eventType === 'sale' ? event.amountCents : 0,
    },
  };
};

export const repairAgencyReferralRollups = (
  events: AgencyReferralAcceptedEvent[],
) => {
  const rollups = new Map<
    string,
    {
      name: string;
      scopeType: 'partner_profile' | 'agency_group' | 'enrollment';
      scopeId: string;
      leadCount: number;
      saleCount: number;
      revenueCents: number;
      lastEventAt: string;
      repairStatus: 'repaired';
      partnerProfileId?: string;
      agencyGroupId?: string;
    }
  >();

  const applyEventToScope = (
    event: AgencyReferralAcceptedEvent,
    scopeType: 'partner_profile' | 'agency_group' | 'enrollment',
    scopeId: string | undefined,
  ) => {
    if (!scopeId) {
      return;
    }

    const key = `${scopeType}:${scopeId}`;
    const current =
      rollups.get(key) ??
      ({
        name: key,
        scopeType,
        scopeId,
        leadCount: 0,
        saleCount: 0,
        revenueCents: 0,
        lastEventAt: event.occurredAt,
        repairStatus: 'repaired',
        partnerProfileId: event.partnerProfileId,
        agencyGroupId: event.agencyGroupId,
      });

    current.leadCount += event.eventType === 'lead' ? 1 : 0;
    current.saleCount += event.eventType === 'sale' ? 1 : 0;
    current.revenueCents +=
      event.eventType === 'sale' ? event.amountCents : 0;
    current.lastEventAt =
      event.occurredAt > current.lastEventAt
        ? event.occurredAt
        : current.lastEventAt;

    rollups.set(key, current);
  };

  for (const event of events) {
    applyEventToScope(event, 'partner_profile', event.partnerProfileId);
    applyEventToScope(event, 'agency_group', event.agencyGroupId);
    applyEventToScope(event, 'enrollment', event.enrollmentId);
  }

  return [...rollups.values()];
};
