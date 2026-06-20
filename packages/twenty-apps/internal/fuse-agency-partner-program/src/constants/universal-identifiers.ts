export const APPLICATION_UNIVERSAL_IDENTIFIER =
  'c9fbba14-ff4f-48b9-88d8-a9f117347075';

export const DEFAULT_ROLE_UNIVERSAL_IDENTIFIER =
  'c239c4f0-148b-4c17-9051-8893cf3a3b8e';

export const POST_INSTALL_UNIVERSAL_IDENTIFIER =
  '0537f797-6ea8-42b4-b487-8e19f3d86caf';

export const LIFECYCLE_LOGIC_FUNCTION_IDS = {
  submitApplication: 'a8ec70bf-82fc-4f3f-8fc7-ea67b98d0bc9',
  approveApplication: 'c6b3b938-7de3-48a4-8880-fc45c5df7353',
  rejectApplication: '62f3cd49-4bb5-4cd5-af75-426d627c333c',
} as const;

export const FRONT_COMPONENT_UNIVERSAL_IDENTIFIER =
  '7e871e07-1387-4692-9334-dfe5b132f7b8';

export const PAGE_LAYOUT_IDS = {
  partnerProfile: 'dab5072a-1e69-4adf-923c-36a2ab00339c',
  overviewTab: 'e05fe618-904e-4258-922f-3c01bd02e4af',
  overviewWidget: 'f6af09ed-b790-4f3d-9746-56cd1e7111d2',
} as const;

export const OBJECT_IDS = {
  agencyApplication: 'c16062d1-c708-4b63-a4bc-8da880749dff',
  agencyServiceCapability: '15674de5-4c14-48e4-8d06-359054111c53',
  agencyResource: '4288afa9-8b85-4a66-9006-b68ea36521ba',
  agencyAttribution: '1fd4c7f2-9564-4400-ae47-da5d4f7a13a8',
  agencyTask: 'd813ebd6-e5e4-4e9a-9d8f-4dcaf1bf9c6a',
  agencyGroup: '44fa1a1c-ea5b-4a0e-97c3-db2407f46ade',
  agencyReviewEvent: 'd3487013-6c21-4298-839f-6466769ea320',
} as const;

export const FIELD_IDS = {
  agencyApplication: {
    name: '751b2865-61b3-4b37-85ed-c56ccd53721b',
    status: '893a5736-3e5c-489a-a7e6-3e4a8a7353af',
    submittedAt: '3732bd83-93ec-4bc3-bb2f-0d2c7baafa29',
    website: 'e8053fc6-db9f-4b2c-9ccf-8905986ef234',
    applicantName: '96f623b3-d32d-4a1d-b858-d604a62df7ad',
    applicantEmail: 'a4f8341d-ee25-40be-8099-1ac2c899e715',
    normalizedDomain: 'd149985c-929a-4d3b-a8dc-c65513c1fc02',
    duplicateKey: 'bd73b5f7-1646-40f7-a138-6144cf876ee4',
    riskState: 'ec934d63-e851-45a5-bd1f-aa57cc5493e2',
    reviewedAt: 'becf14ad-2a4a-4027-8007-88969b80b83a',
    serviceBuckets: 'e05fbef4-5cc0-47b2-8881-95e87105e43d',
    monthlyLeadVolumeBand: '2ef2e4ec-95ab-4ed4-8f25-5ccc52d0f1b2',
    reviewDecisionReason: 'f5accc40-912a-4cce-b82f-6c7c7461338e',
    partnerProfile: 'dc3db1eb-f8f7-408e-a788-e3201cd2a403',
    company: '9693f440-d173-4ab5-af91-6ed29dd58eef',
    person: '50faef7b-17f3-4af8-bbce-58b46acac7e4',
    agencyGroup: 'b3c2ae15-4d67-4957-9b1d-66c3582ab2ff',
    reviewEvents: '845b05b3-4fef-43e8-9a83-ab0cfa8fed9b',
  },
  agencyServiceCapability: {
    name: '3bcc0804-3d00-4c60-b052-320da0eac93c',
    serviceBucket: 'ac312d3e-c4a2-45a4-bd43-65c3a4ea47a1',
    platformFocus: '16dd1c75-e264-4c07-8db9-f3d00d5e951b',
    certifications: '40dd88bf-2960-4d8a-b81f-bd3d2f6150cd',
    capacityBand: 'f89b6447-25dc-4d96-850e-2c42b9af3210',
    partnerProfile: 'bc1c30e4-dbf8-42cc-b36c-ebfb73aaed81',
  },
  agencyResource: {
    name: '500393f8-c40b-4702-a74e-b96004da3fdf',
    resourceType: 'd1a67be0-bdb1-4ec3-9dc7-cf43239b5b57',
    url: '279f17c8-fed9-4945-b4f9-95b4c7bb2b83',
    status: '5207593d-1f08-4dd5-a29d-30d933f925d8',
    partnerProfile: '46a0a84f-d5c3-4aaf-b613-7c1e725e79ac',
  },
  agencyAttribution: {
    name: 'a5fb2631-c7b2-4401-a5da-d6e3366dec3b',
    attributionType: '94097e8f-0831-4f3f-915b-1eacc464ca75',
    sourceEventId: 'befae369-f418-41dd-9431-df18c443fe82',
    amountCents: 'd202fc41-85e4-4fef-afd3-fca8557878f4',
    status: '08a21482-a479-4635-84c2-15b1ad264292',
    partnerProfile: '36e94332-0c6f-41ff-b60f-9ccfebca6c6a',
    opportunity: 'f76ecae4-0cf4-4810-91fd-180f2e88d6fb',
  },
  agencyTask: {
    name: '41772d33-0661-4305-97ed-154c38c0a646',
    taskType: '388a48a1-bbdf-458c-aef8-de62ca7f401d',
    status: '43f0bcdf-3d58-4d73-94ba-b3da236e0dc8',
    dueAt: 'e12f8248-d466-4f95-af74-64d1229c5e1f',
    partnerProfile: 'c249341e-0723-4792-a842-f41e2dfd9879',
  },
  agencyGroup: {
    name: '745fd009-f944-43b6-8add-278a897d7246',
    tier: '6815ff70-1299-44b6-ad2b-6bb147759fb2',
    status: 'e12c96a9-5695-4d56-8fc6-ab8fa790105f',
    partnerProfile: 'c470f82f-260c-4755-902a-1722f12a6092',
    applications: '639321a0-dc7e-4804-b2e3-cc63237c3cee',
    reviewEvents: 'd4433a49-0e17-47bc-a3dc-03d946e64578',
  },
  agencyReviewEvent: {
    name: '172269fd-34df-432c-bef5-d6c95b05ed67',
    action: '74e9e212-5a3e-4e18-8a7a-c2d4ad524ee5',
    reason: '0f6ab384-4677-4d8e-8312-5e85acc79f67',
    evidenceJson: '9f2b2fac-ca2c-4e5a-8d47-f24b65f977e1',
    occurredAt: '6d4e7ce2-8009-40d0-bb3d-23c62b3a4bd9',
    application: '1fc6709d-654a-455f-b0f2-b017359cda90',
    partnerProfile: '6ae08959-50a5-4209-8b10-ac07d41f5a2c',
    agencyGroup: 'c5f0a93a-f308-482b-b72b-1213dce8c3e4',
  },
  partnerProfile: {
    agencyApplications: 'a5307e4b-273a-4da5-bce1-d70969ce4773',
    serviceCapabilities: 'fdbdcdb5-c939-4c5c-9dc4-20b3ec605eea',
    resources: '0f3b085b-dadb-4799-a92e-4c8c1d80d54e',
    attributions: 'c4faf7b9-a9d2-4ec6-be25-6687a627eef9',
    agencyTasks: '24ee9a0b-5a2e-41c9-87a7-c972a3da6d97',
    agencyGroups: '2c3778af-c0ce-4260-b84c-04a0917a30bd',
    reviewEvents: '5b95452a-3ae5-46b3-8e53-a33b3181ea4e',
  },
  company: {
    agencyApplications: 'fccc842f-4c60-453a-a2ed-59495d8cba6c',
  },
  person: {
    agencyApplications: 'a788e969-7c8c-43a9-9fa9-0c59e1ed4c6a',
  },
  opportunity: {
    agencyAttributions: 'df140414-295c-45d0-8077-be7804e894fd',
  },
} as const;

export const VIEW_IDS = {
  applications: '1a59c2f9-8640-44cf-a130-a18ed3c7f795',
  activeAgencies: '224257cb-33f9-45cc-9bce-13a0a7d549b0',
  serviceCapabilities: '46fff27b-5d3e-42f9-b736-51a8e1feb16d',
  agencyContacts: '63b927a9-bea1-43ad-922b-cff1674c8b12',
  resources: 'df1efa3e-1ecc-4fe1-b3eb-8cfe82b0a0eb',
  attribution: 'b9892ebd-4721-4c02-89a2-d5cd8b2c3c7e',
  tasks: 'b74fc04e-61e7-4ba2-bbe0-245593e63073',
  agencyGroups: '2d248d6c-373a-4d15-b342-72e357552ddb',
  reviewEvents: 'e39f35b0-0313-4c55-ae91-6937a4b68f1e',
} as const;

export const NAVIGATION_IDS = {
  folder: '31709246-4deb-4543-b2e7-780f98e551ba',
  applications: '3851872a-1472-462a-b7bf-513ef9cc10e6',
  activeAgencies: '634d88eb-8865-427d-94f0-a934fffb6f5f',
  serviceCapabilities: '6842dd53-6e58-4e5a-b027-f20c4ce27836',
  agencyContacts: '992fa6c0-71dc-4f74-b416-7107f1b2e00c',
  resources: '0c7f2c9f-a6a6-4639-a89f-310f60f958e4',
  attribution: 'c9b1696b-2ca6-4635-b772-b91ede9d7b4d',
  tasks: '6b1040c6-396c-43d7-aada-632b2149c4a6',
  agencyGroups: 'f08c000b-390a-4cac-b207-dfa7026ce410',
  reviewEvents: '2a02fd00-c31f-42a9-8bf8-a79d3254c0dc',
} as const;

export const VIEW_FIELD_IDS = [
  'dac7272d-35b9-48f0-a015-cc1258197f55',
  '5c21a9d5-8ac7-427a-afd6-df056ee1daa3',
  '80c85c44-3bfe-4393-a532-49cf1a5271f0',
  '25f07769-00fb-40fb-84fb-e9e809c292a5',
  'c7e0ac60-bbed-4f72-a54a-e42bd76add4d',
  'fc9f136a-fe3b-407d-8dee-fe98d3547b1a',
  'ad334eb5-741f-4c3e-8b9b-11db25b648c2',
  '3e1ed033-6a28-4978-be5f-3573fbc9c40e',
  'a419d54b-2d8f-4f6a-b1a1-7df70a2b61ff',
  '637a7494-f7aa-4583-bed3-f09b411d29de',
  '714ded56-8b8d-4827-84b6-67a579eef274',
  '5aa631e1-8e8d-49f2-a217-b9892e46fad0',
  '822c5ee8-a8ce-4d78-a153-7c6c66df612f',
  '59bb32e3-b0ca-48bd-afeb-42d15fdd3965',
  '31d42af0-0bc5-49b9-8742-4fe66a2de177',
  'afe3e432-f2d9-431d-902f-0fb3dc05942e',
  '13c97c69-46f6-42f7-8e3f-6f097030b22d',
  'fa45d048-6472-471a-bfd2-06a8464b29c9',
  '2d3de664-6cdd-49ff-a8c9-aeecd4d98a7d',
  'a0550f51-ed2a-44af-a394-07e0c5abf8dd',
  '00f8918d-e14d-459a-b9a4-99b4f700c6e3',
  '5d38ab37-134b-418d-a595-ef9e8b7cd551',
  'fb9d345f-04a2-4bb2-93a6-d6a55f0069d6',
  'b0bd0531-bb59-4353-9afb-2b5e416e68f1',
  'b4da0e49-4ac2-41e1-8716-45c9257db06d',
  '1ae24fce-8bd1-494a-bb34-2b498e4e3564',
  'bb3df936-80f1-4b44-8069-dbb1cb6b4a6a',
  'b5a7afda-8117-442f-af2f-d8eb77b22511',
  'b009a9ec-8555-4ce0-93de-d5e605d7a65b',
  'f14ba4ab-2045-4638-9259-02dc7559ca2a',
  'b5c6984f-b17c-4d0a-a819-a4c37146cb89',
  'ae209b2a-55d6-4f7c-b3ca-305d473d7f87',
  '1dd71c06-83c8-43e5-bf37-097d1b530795',
  '601ee316-4251-4914-bcb9-c8459c0cd371',
] as const;

export const VIEW_FILTER_IDS = {
  activeAgenciesPartnerType: 'fb3002b3-01c7-43a9-a6a9-6ad526e01823',
  activeAgenciesStatus: '26a79f6b-14bc-4ea3-bb4a-0f9459a2b0e0',
} as const;

export const VIEW_SORT_IDS = {
  applications: 'ba0f1b6b-d958-42de-a2b4-54b9c6499c0c',
  activeAgencies: '487d4ddb-f270-47a2-83e0-855dedda6277',
  serviceCapabilities: 'c1a41317-ae59-4f54-8418-04c36bfee804',
  agencyContacts: 'ec875250-47ac-41aa-94a9-2da5d76d8d48',
  resources: '7e74ec97-eb16-4728-ac15-ad80ea980980',
  attribution: '9ad51f85-3b99-4cfe-8c8d-31df8067f15e',
  tasks: 'c2db3b05-4ee5-4ec5-ab9a-45cfbee23591',
  agencyGroups: 'd2e0a4ab-5443-444d-ad6e-4ddd95b83f33',
  reviewEvents: 'd4ab165f-4330-4321-8895-ac55deee4580',
} as const;

export const SEED_DATA_IDS = {
  applications: '3e7dcc5b-ae96-4392-bc7c-7eaf76a94557',
  serviceCapabilities: '674bf389-ca1a-47eb-8310-d48553d5fed7',
  resources: 'd29c7c5a-de63-4afe-b681-16c6e696c7d9',
  tasks: '98573d72-3924-4007-81ae-f0c1b3e76d64',
  agencyGroups: '068375cc-d45b-4da8-aa06-12af44dfa0ce',
} as const;
