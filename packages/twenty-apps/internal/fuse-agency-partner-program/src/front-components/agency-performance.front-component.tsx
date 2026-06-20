import { type CSSProperties, useEffect, useState } from 'react';
import { CoreApiClient } from 'twenty-client-sdk/core';
import { defineFrontComponent } from 'twenty-sdk/define';
import {
  AGENCY_OPERATOR_ROUTES,
  buildPanelState,
  type AgencyPerformanceRollupRecord,
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

export const AgencyPerformancePanel = () => {
  const [rollups, setRollups] = useState<AgencyPerformanceRollupRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchRollups = async () => {
      try {
        const client = new CoreApiClient() as any;
        const response = await client.query({
          agencyReferralRollups: {
            id: true,
            name: true,
            scopeType: true,
            leadCount: true,
            saleCount: true,
            revenueCents: true,
          },
        } as any);

        setRollups(response.agencyReferralRollups ?? []);
      } catch (caughtError) {
        setError(
          caughtError instanceof Error
            ? caughtError
            : new Error('Unable to load agency performance.'),
        );
      } finally {
        setIsLoading(false);
      }
    };

    void fetchRollups();
  }, []);

  const state = buildPanelState({ records: rollups, isLoading, error });

  if (state.status === 'loading') {
    return <div style={containerStyle}>Loading agency performance...</div>;
  }

  if (state.status === 'error') {
    return <div style={containerStyle}>{state.message}</div>;
  }

  if (state.status === 'empty') {
    return <div style={containerStyle}>No agency performance data yet.</div>;
  }

  return (
    <div style={containerStyle}>
      <button
        style={{
          border: '1px solid #cfd7e6',
          borderRadius: '6px',
          background: '#ffffff',
          color: '#172033',
          cursor: 'pointer',
          fontSize: '13px',
          justifySelf: 'start',
          padding: '8px 10px',
        }}
        type="button"
        onClick={() =>
          void callAgencyAppRoute(AGENCY_OPERATOR_ROUTES.repairReferralRollups, {
            events: [],
          })
        }
      >
        Repair Rollups
      </button>
      {state.records.map((rollup) => (
        <section
          key={rollup.id}
          style={{
            border: '1px solid #d9dee7',
            borderRadius: '8px',
            display: 'grid',
            gap: '8px',
            padding: '14px',
          }}
        >
          <div style={{ fontSize: '14px', fontWeight: 650 }}>
            {rollup.name}
          </div>
          <div style={{ color: '#526078', fontSize: '13px' }}>
            {rollup.scopeType} - leads {rollup.leadCount} - sales{' '}
            {rollup.saleCount} - revenue ${(rollup.revenueCents / 100).toFixed(2)}
          </div>
        </section>
      ))}
    </div>
  );
};

export default defineFrontComponent({
  universalIdentifier: FRONT_COMPONENT_IDS.performance,
  name: 'agency-performance-panel',
  description: 'Agency referral performance panel with rollup repair action',
  component: AgencyPerformancePanel,
});
