export const STANDARD_OBJECT_IDS = {
  company: '20202020-b374-4779-a561-80086cb2e17f',
  opportunity: '20202020-9549-49dd-b2b2-883999db8938',
  person: '20202020-e674-48e5-a542-72570eee7213',
} as const;

export const STANDARD_FIELD_IDS = {
  opportunity: {
    name: '20202020-8609-4f65-a2d9-44009eb422b5',
  },
  person: {
    name: '20202020-3875-44d5-8c33-a6239011cab8',
    emails: '20202020-3c51-43fa-8b6e-af39e29368ab',
  },
} as const;

export const CORE_OBJECT_IDS = {
  partnerProfile: '59a27eee-9f9f-4555-93b2-11751b3debe0',
} as const;

export const CORE_FIELD_IDS = {
  partnerProfile: {
    name: '88c55e8d-cab8-4d72-a373-dd5e710e0464',
    partnerType: '90369038-9e46-40d4-a9cb-c840b95d777a',
    status: 'a2cdbc67-d9b6-4bff-a961-01a2b5957449',
  },
  person: {
    isPartnerContact: '54bf01de-274f-4a86-9269-3a7f54fd403c',
    partnerRole: '8ca8afef-c8ac-42a7-9629-1be71ae8459d',
  },
} as const;
