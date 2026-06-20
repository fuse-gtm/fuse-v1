export const APPLICATION_UNIVERSAL_IDENTIFIER =
  '47b88821-1483-4d05-983a-d45f09f79571';

export const DEFAULT_ROLE_UNIVERSAL_IDENTIFIER =
  '40ece5dd-9e13-4444-a2cb-069b402f0399';

export const POST_INSTALL_UNIVERSAL_IDENTIFIER =
  '00adfa48-62c4-4dac-ae7c-452983bfed53';

export const FIELD_IDS = {
  company: {
    isPartner: '288d5db9-57ef-4d1c-8e22-43069378c667',
    partnerType: '8d61c519-4415-4df8-a191-747a3f9e9b7b',
    programMechanics: 'b299b911-b4da-4391-8d88-998370418a39',
    commercialModels: 'f2648b1a-cd7e-4f76-a012-789d03a0b7b3',
    partnerStatus: 'a147a3c8-f603-46e3-aac8-b09c0d5cde8f',
    partnerProfiles: 'd26ed9aa-f796-4e3e-83c6-27e5fa56b016',
  },
  person: {
    isPartnerContact: '54bf01de-274f-4a86-9269-3a7f54fd403c',
    partnerRole: '8ca8afef-c8ac-42a7-9629-1be71ae8459d',
    partnerProfiles: '04307172-4dc3-4241-87e1-79276b5c3ff7',
  },
  opportunity: {
    partnerSource: '08ddcb78-23ac-481f-81ae-71338a5db17c',
    attributionStatus: 'd0218515-b523-4a13-9d48-a87b997a0078',
    attributionNotes: '354e49b0-0733-4400-a617-291552651084',
    sourcedPartnerProfile: 'c304bfb0-9460-449e-aed4-ef8c0b551a34',
  },
  partnerProfile: {
    name: '88c55e8d-cab8-4d72-a373-dd5e710e0464',
    primaryDomain: '7c729417-9490-4e4a-8fa3-edd98e54b8f7',
    partnerType: '90369038-9e46-40d4-a9cb-c840b95d777a',
    partnerSubtypes: '8dadc48b-fe68-4f79-a55d-bde530fa5368',
    programMechanics: '30de5626-11a0-4930-afbb-13e40a2d5a98',
    commercialModels: '3ab650ac-877e-45e0-9f30-f671e904df41',
    status: 'a2cdbc67-d9b6-4bff-a961-01a2b5957449',
    company: 'a1a20c92-4f80-4767-938a-d4a03b30346a',
    primaryContact: 'cbb4c682-31e5-4c8b-89f4-7bc8ae26ce8d',
    enrollments: 'eb1b5764-e661-4c3d-a55c-9af40afcdc19',
    sourcedOpportunities: 'cf68a36b-6ec0-4b0c-87ba-80bb7eb03c8d',
  },
  partnerProgram: {
    name: '7d3ef0e8-c3c5-4e07-9a6f-f6a1908cbdd1',
    mechanic: 'f0860deb-4cec-431c-b13e-2327b4f1f18b',
    ecosystem: '6a855fc2-8b1c-4329-b9be-c7fba9b49d6b',
    brand: 'd774a269-e4f8-42da-a0ed-470f274e90d6',
    commercialModels: '4b09ca5d-752d-462f-9b52-2559868472bb',
    tier: '3c08aab2-0ebf-40b1-a632-a5b44a51f12d',
    enrollments: '2340d06e-2aa1-49a7-8e80-e66ef2dd95ab',
  },
  partnerEnrollment: {
    name: 'ed362793-cc8e-455d-8a3e-d0d4eaaa74be',
    status: 'daa0c75a-4e08-4767-a0fd-c9b5ebe75cb8',
    startedAt: '970bf98e-419d-4384-b8ab-1c9ee0125aba',
    notes: '2ff56242-d0fa-4074-b0ee-240cd5741b62',
    partnerProfile: 'e3d4f590-d94b-41a4-a372-d53150c3628c',
    partnerProgram: '0bb22ec5-1d4f-4f7e-9d8a-0ff2e79771b2',
  },
} as const;

export const OBJECT_IDS = {
  partnerProfile: '59a27eee-9f9f-4555-93b2-11751b3debe0',
  partnerProgram: '5e387a82-6819-4851-8b65-0a59e1a14e20',
  partnerEnrollment: '5fa030e3-6782-4bb9-bee2-98a8f22efdb7',
} as const;

export const VIEW_IDS = {
  partnerProfiles: '8cc35fc6-b5bd-4d39-9d16-d29597244e6a',
  activeEnrollments: 'b4dfa78c-ffe8-40d3-8aa8-40214dae2440',
  partnerPrograms: 'db9a94c4-b43b-4d7b-909c-ca1a58dbfda9',
} as const;

export const NAVIGATION_IDS = {
  folder: '5f9fbbe0-2b9a-4082-b496-53428b2fd720',
  partnerProfiles: '1b650e45-0a9e-457c-8962-651f7600f46d',
  activeEnrollments: '12098453-fd94-4f76-af0e-d501abce2a41',
  partnerPrograms: 'd6f4e8a8-a3ef-45be-a5d7-7911c4c4f2f9',
} as const;

export const VIEW_FIELD_IDS = [
  '11edb472-f5ea-4c42-bbf8-6d07164b1f79',
  '28d0081a-646b-404d-aba2-4df0027dfe9f',
  'bea72147-0bce-4b11-8db1-8901e2e88302',
  'a2d62462-e4ef-4b5e-b143-46a4144a51c9',
  'a2d4465d-e48b-470b-ae95-5e4efc646297',
  '06d120a2-3d93-49fa-9590-0538820ede0d',
  'e75e95ca-6327-494d-ae5f-41f8ec76c21b',
  '450149ac-6638-4f3f-abeb-8fe18ecad079',
  'b5a87724-403a-48dc-b0bf-e11ae7780e3b',
  '5bd51adb-659b-469a-b973-1d25e4b6b34c',
  '4523b641-218c-48fc-afcb-68bd3b3488a9',
] as const;

export const VIEW_SORT_IDS = {
  partnerProfiles: '521bdef7-b490-4367-922c-993194a853eb',
  activeEnrollments: 'b5b4a28c-dd16-4380-aaa2-9f12d0e2b303',
  partnerPrograms: '7d369945-d0f1-4c5f-a796-8b5f0a73e5a2',
} as const;

export const SEED_DATA_IDS = {
  partnerPrograms: '0ad4dcc2-2232-403d-a646-67cb7b1b210d',
  partnerProfiles: '70007900-cb11-4fb3-9e0e-cd29013d6752',
  partnerEnrollments: '0ca1ae23-7cbf-4f7f-a495-2a7f32e30df9',
} as const;
