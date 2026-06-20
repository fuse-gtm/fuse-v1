export type AgencyOperatorTermClassification =
  | { axis: 'partner_type'; value: 'agency' }
  | { axis: 'program_mechanic'; value: 'referral' | 'services' }
  | { axis: 'invalid_partner_type'; value: 'affiliate' }
  | { axis: 'unknown'; value: string };

export const classifyAgencyOperatorTerm = (
  term: string,
): AgencyOperatorTermClassification => {
  const normalizedTerm = term.trim().toLowerCase().replace(/\s+/g, '_');

  if (normalizedTerm === 'agency') {
    return { axis: 'partner_type', value: 'agency' };
  }

  if (normalizedTerm === 'referral') {
    return { axis: 'program_mechanic', value: 'referral' };
  }

  if (normalizedTerm === 'services') {
    return { axis: 'program_mechanic', value: 'services' };
  }

  if (normalizedTerm === 'affiliate') {
    return { axis: 'invalid_partner_type', value: 'affiliate' };
  }

  return { axis: 'unknown', value: normalizedTerm };
};
