import { defineFrontComponent } from 'twenty-sdk/define';
import { FRONT_COMPONENT_UNIVERSAL_IDENTIFIER } from 'src/constants/universal-identifiers';

export const AgencyOverview = () => (
  <div
    style={{
      display: 'grid',
      gap: '16px',
      padding: '20px',
      fontFamily:
        'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
      color: '#172033',
    }}
  >
    <section
      style={{
        border: '1px solid #d9dee7',
        borderRadius: '8px',
        padding: '16px',
        background: '#ffffff',
      }}
    >
      <div
        style={{
          color: '#526078',
          fontSize: '12px',
          fontWeight: 600,
          letterSpacing: 0,
          textTransform: 'uppercase',
        }}
      >
        Agency partner
      </div>
      <h2
        style={{
          margin: '6px 0 8px',
          fontSize: '18px',
          lineHeight: 1.3,
          fontWeight: 650,
        }}
      >
        Operating overview
      </h2>
      <p style={{ margin: 0, color: '#526078', fontSize: '14px' }}>
        Review active services, enablement resources, attribution status, and
        open partner tasks from the connected agency records.
      </p>
    </section>

    <section
      style={{
        display: 'grid',
        gap: '12px',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
      }}
    >
      {[
        ['Services', 'Capabilities and platform focus'],
        ['Attribution', 'Referral and services influence'],
        ['Resources', 'Enablement assets'],
        ['Tasks', 'Review and follow-up work'],
      ].map(([title, description]) => (
        <div
          key={title}
          style={{
            border: '1px solid #e2e7f0',
            borderRadius: '8px',
            padding: '14px',
            background: '#f8fafc',
          }}
        >
          <div style={{ fontSize: '14px', fontWeight: 650 }}>{title}</div>
          <div style={{ marginTop: '6px', color: '#526078', fontSize: '13px' }}>
            {description}
          </div>
        </div>
      ))}
    </section>
  </div>
);

export default defineFrontComponent({
  universalIdentifier: FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
  name: 'agency-overview',
  description: 'Agency partner profile overview panel',
  component: AgencyOverview,
});
