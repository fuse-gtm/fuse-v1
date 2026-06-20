import { type CSSProperties, useEffect, useState } from 'react';
import { CoreApiClient } from 'twenty-client-sdk/core';
import { defineFrontComponent } from 'twenty-sdk/define';
import {
  buildPanelState,
  getApplicationReviewActions,
  type AgencyApplicationReviewRecord,
} from 'src/operator/agency-operator-panel-model';
import { callAgencyAppRoute } from 'src/utils/call-agency-app-route';
import { FRONT_COMPONENT_IDS } from 'src/constants/universal-identifiers';

const containerStyle = {
  display: 'grid',
  gap: '12px',
  padding: '16px',
  fontFamily:
    'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
  color: '#172033',
} satisfies CSSProperties;

const buttonStyle = {
  border: '1px solid #cfd7e6',
  borderRadius: '6px',
  background: '#ffffff',
  color: '#172033',
  cursor: 'pointer',
  fontSize: '13px',
  padding: '8px 10px',
} satisfies CSSProperties;

export const AgencyApplicationReviewPanel = () => {
  const [applications, setApplications] = useState<
    AgencyApplicationReviewRecord[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const client = new CoreApiClient() as any;
        const response = await client.query({
          agencyApplications: {
            id: true,
            name: true,
            status: true,
            applicantEmail: true,
            riskState: true,
          },
        } as any);

        setApplications(response.agencyApplications ?? []);
      } catch (caughtError) {
        setError(
          caughtError instanceof Error
            ? caughtError
            : new Error('Unable to load agency applications.'),
        );
      } finally {
        setIsLoading(false);
      }
    };

    void fetchApplications();
  }, []);

  const state = buildPanelState({ records: applications, isLoading, error });

  if (state.status === 'loading') {
    return <div style={containerStyle}>Loading agency applications...</div>;
  }

  if (state.status === 'error') {
    return <div style={containerStyle}>{state.message}</div>;
  }

  if (state.status === 'empty') {
    return <div style={containerStyle}>No agency applications pending.</div>;
  }

  return (
    <div style={containerStyle}>
      {state.records.map((application) => {
        const actions = getApplicationReviewActions(application.id);

        return (
          <section
            key={application.id}
            style={{
              border: '1px solid #d9dee7',
              borderRadius: '8px',
              display: 'grid',
              gap: '10px',
              padding: '14px',
            }}
          >
            <div>
              <div style={{ fontSize: '14px', fontWeight: 650 }}>
                {application.name}
              </div>
              <div style={{ color: '#526078', fontSize: '13px' }}>
                {application.applicantEmail ?? 'No applicant email'} -{' '}
                {application.status} - {application.riskState ?? 'clear'}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                style={buttonStyle}
                type="button"
                onClick={() =>
                  void callAgencyAppRoute(actions.approve.path, {
                    ...actions.approve.body,
                    agencyName: application.name.replace(/ Application$/, ''),
                  })
                }
              >
                Approve
              </button>
              <button
                style={buttonStyle}
                type="button"
                onClick={() =>
                  void callAgencyAppRoute(actions.reject.path, {
                    ...actions.reject.body,
                    agencyName: application.name.replace(/ Application$/, ''),
                    reason: 'Rejected from Agency Application Review panel.',
                  })
                }
              >
                Reject
              </button>
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default defineFrontComponent({
  universalIdentifier: FRONT_COMPONENT_IDS.applicationReview,
  name: 'agency-application-review-panel',
  description: 'Agency application review panel with route-backed actions',
  component: AgencyApplicationReviewPanel,
});
