export const APPLICATION_UNIVERSAL_IDENTIFIER =
  'c9fbba14-ff4f-48b9-88d8-a9f117347075';

export const DEFAULT_ROLE_UNIVERSAL_IDENTIFIER =
  'c239c4f0-148b-4c17-9051-8893cf3a3b8e';

export const POST_INSTALL_UNIVERSAL_IDENTIFIER =
  '0537f797-6ea8-42b4-b487-8e19f3d86caf';

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
} as const;

export const FIELD_IDS = {
  agencyApplication: {
    name: '751b2865-61b3-4b37-85ed-c56ccd53721b',
    status: '893a5736-3e5c-489a-a7e6-3e4a8a7353af',
    submittedAt: '3732bd83-93ec-4bc3-bb2f-0d2c7baafa29',
    website: 'e8053fc6-db9f-4b2c-9ccf-8905986ef234',
    serviceBuckets: 'e05fbef4-5cc0-47b2-8881-95e87105e43d',
    monthlyLeadVolumeBand: '2ef2e4ec-95ab-4ed4-8f25-5ccc52d0f1b2',
    reviewDecisionReason: 'f5accc40-912a-4cce-b82f-6c7c7461338e',
    partnerProfile: 'dc3db1eb-f8f7-408e-a788-e3201cd2a403',
    company: '9693f440-d173-4ab5-af91-6ed29dd58eef',
    person: '50faef7b-17f3-4af8-bbce-58b46acac7e4',
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
  partnerProfile: {
    agencyApplications: 'a5307e4b-273a-4da5-bce1-d70969ce4773',
    serviceCapabilities: 'fdbdcdb5-c939-4c5c-9dc4-20b3ec605eea',
    resources: '0f3b085b-dadb-4799-a92e-4c8c1d80d54e',
    attributions: 'c4faf7b9-a9d2-4ec6-be25-6687a627eef9',
    agencyTasks: '24ee9a0b-5a2e-41c9-87a7-c972a3da6d97',
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
} as const;

export const SEED_DATA_IDS = {
  applications: '3e7dcc5b-ae96-4392-bc7c-7eaf76a94557',
  serviceCapabilities: '674bf389-ca1a-47eb-8310-d48553d5fed7',
  resources: 'd29c7c5a-de63-4afe-b681-16c6e696c7d9',
  tasks: '98573d72-3924-4007-81ae-f0c1b3e76d64',
} as const;
