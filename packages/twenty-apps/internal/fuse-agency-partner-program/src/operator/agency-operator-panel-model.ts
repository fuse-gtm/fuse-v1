export const AGENCY_OPERATOR_ROUTES = {
  approveApplication: '/agency/applications/approve',
  rejectApplication: '/agency/applications/reject',
  repairReferralRollups: '/agency/referrals/repair-rollups',
} as const;

export type AgencyApplicationReviewRecord = {
  id: string;
  name: string;
  status: string;
  applicantEmail?: string;
  riskState?: string;
};

export type AgencyPerformanceRollupRecord = {
  id: string;
  name: string;
  scopeType: string;
  leadCount: number;
  saleCount: number;
  revenueCents: number;
};

export type PanelState<T> =
  | { status: 'loading'; records: [] }
  | { status: 'error'; records: []; message: string }
  | { status: 'empty'; records: [] }
  | { status: 'ready'; records: T[] };

export const buildPanelState = <T>({
  records,
  isLoading,
  error,
}: {
  records: T[];
  isLoading: boolean;
  error?: Error | null;
}): PanelState<T> => {
  if (isLoading) {
    return { status: 'loading', records: [] };
  }

  if (error) {
    return { status: 'error', records: [], message: error.message };
  }

  if (records.length === 0) {
    return { status: 'empty', records: [] };
  }

  return { status: 'ready', records };
};

export const getApplicationReviewActions = (applicationId: string) => ({
  approve: {
    path: AGENCY_OPERATOR_ROUTES.approveApplication,
    body: { applicationId },
  },
  reject: {
    path: AGENCY_OPERATOR_ROUTES.rejectApplication,
    body: { applicationId },
  },
});
