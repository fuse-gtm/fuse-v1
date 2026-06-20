type OptionColor =
  | 'green'
  | 'turquoise'
  | 'sky'
  | 'blue'
  | 'purple'
  | 'pink'
  | 'red'
  | 'orange'
  | 'yellow'
  | 'gray';

type FieldOption = {
  id: string;
  value: string;
  label: string;
  color: OptionColor;
  position: number;
};

export const PARTNER_TYPE_OPTIONS: FieldOption[] = [
  {
    id: '6022a4cf-1f1f-425f-9b51-1dae06f41d22',
    value: 'AGENCY',
    label: 'Agency',
    color: 'blue',
    position: 0,
  },
  {
    id: 'd6fd0ba5-27ff-40a8-9a87-5cedfefce391',
    value: 'SYSTEMS_INTEGRATOR',
    label: 'Systems Integrator',
    color: 'purple',
    position: 1,
  },
  {
    id: 'f7e76991-d042-4d45-9ca4-2bfff3dfdf1f',
    value: 'ISV',
    label: 'ISV',
    color: 'green',
    position: 2,
  },
  {
    id: '370270d9-0eef-4314-9b8d-52e8f975684a',
    value: 'MSP',
    label: 'MSP',
    color: 'turquoise',
    position: 3,
  },
  {
    id: '62947e46-4ae4-4210-a000-b5da56bf4af0',
    value: 'RESELLER',
    label: 'Reseller',
    color: 'orange',
    position: 4,
  },
  {
    id: '3c983498-2e2a-4842-9309-153332fe5620',
    value: 'CONSULTING',
    label: 'Consulting',
    color: 'sky',
    position: 5,
  },
  {
    id: 'e98fda37-aca9-4be8-8610-7400218b0703',
    value: 'VC_PE',
    label: 'VC/PE',
    color: 'pink',
    position: 6,
  },
  {
    id: 'f00af122-bc61-4df5-8ed5-d21fa26d59d1',
    value: 'PROFESSIONAL_SERVICES',
    label: 'Professional Services',
    color: 'gray',
    position: 7,
  },
];

export const PROGRAM_MECHANIC_OPTIONS: FieldOption[] = [
  {
    id: '44678c0a-dd3b-4b72-85d1-a940c49560cc',
    value: 'REFERRAL',
    label: 'Referral',
    color: 'green',
    position: 0,
  },
  {
    id: '7003fa21-140e-4a05-bf8f-250331cea69d',
    value: 'SERVICES',
    label: 'Services',
    color: 'blue',
    position: 1,
  },
  {
    id: 'c782e0c8-c05c-48bc-9508-61d8ef6c2a0a',
    value: 'MARKETPLACE',
    label: 'Marketplace',
    color: 'purple',
    position: 2,
  },
  {
    id: 'a53f8ead-1509-4c1c-8873-48b26a8ced9f',
    value: 'TECHNOLOGY',
    label: 'Technology',
    color: 'turquoise',
    position: 3,
  },
  {
    id: 'b5da5af0-ff4f-43f8-8af9-bd04b64166d4',
    value: 'RESELLER',
    label: 'Reseller',
    color: 'orange',
    position: 4,
  },
];

export const COMMERCIAL_MODEL_OPTIONS: FieldOption[] = [
  {
    id: '60973188-e550-4396-a293-181433101940',
    value: 'COMMISSION',
    label: 'Commission',
    color: 'green',
    position: 0,
  },
  {
    id: '3a5b3559-6789-431e-88fc-eb266f970222',
    value: 'FLAT_FEE',
    label: 'Flat Fee',
    color: 'blue',
    position: 1,
  },
  {
    id: '01c06158-e73f-454d-b05d-07cf1be5cc51',
    value: 'WARRANT',
    label: 'Warrant',
    color: 'purple',
    position: 2,
  },
  {
    id: '6a0dc556-6de7-4c48-81da-2e8443b434d7',
    value: 'REVENUE_SHARE',
    label: 'Revenue Share',
    color: 'turquoise',
    position: 3,
  },
  {
    id: '9ecaec38-f0c5-40d3-9301-ce336ebb6a13',
    value: 'MARGIN',
    label: 'Margin',
    color: 'orange',
    position: 4,
  },
  {
    id: 'c3c7f832-28cf-4fa6-9c43-6d6d2748e75f',
    value: 'CO_MARKETING',
    label: 'Co-Marketing',
    color: 'pink',
    position: 5,
  },
  {
    id: '6c19b589-dafb-436f-b8bf-23f70cf7ac80',
    value: 'PRODUCT_BENEFITS',
    label: 'Product Benefits',
    color: 'yellow',
    position: 6,
  },
  {
    id: 'b890b319-682d-45d1-be29-5f228d3c8c12',
    value: 'CERTIFICATIONS',
    label: 'Certifications',
    color: 'gray',
    position: 7,
  },
];

export const PARTNER_STATUS_OPTIONS: FieldOption[] = [
  {
    id: '48969f9c-0475-4b68-84e4-af03d6781c0f',
    value: 'CANDIDATE',
    label: 'Candidate',
    color: 'yellow',
    position: 0,
  },
  {
    id: '4af2bdb9-4f1e-4159-ab0c-3265408209d2',
    value: 'ACTIVE',
    label: 'Active',
    color: 'green',
    position: 1,
  },
  {
    id: '2c3470b1-0969-4727-8883-c0e03e5df24e',
    value: 'PAUSED',
    label: 'Paused',
    color: 'orange',
    position: 2,
  },
  {
    id: '2ad43f4c-0463-47d7-a889-ccd6a7baa4fb',
    value: 'INACTIVE',
    label: 'Inactive',
    color: 'gray',
    position: 3,
  },
];

export const PERSON_ROLE_OPTIONS: FieldOption[] = [
  {
    id: 'd5fdc966-c7ed-4896-b514-b7a67866ed20',
    value: 'EXECUTIVE_SPONSOR',
    label: 'Executive Sponsor',
    color: 'purple',
    position: 0,
  },
  {
    id: '8f1eb6ce-d734-4a00-a94e-cf8e84826a33',
    value: 'PARTNER_MANAGER',
    label: 'Partner Manager',
    color: 'blue',
    position: 1,
  },
  {
    id: '2730f30a-5fdd-4e08-b10e-606b44e87946',
    value: 'TECHNICAL_CONTACT',
    label: 'Technical Contact',
    color: 'turquoise',
    position: 2,
  },
  {
    id: '225432af-13ab-40df-aa8d-93d55610b8db',
    value: 'SALES_CONTACT',
    label: 'Sales Contact',
    color: 'green',
    position: 3,
  },
  {
    id: 'd0f023eb-2430-487f-bcb5-2b5ef86c3016',
    value: 'MARKETING_CONTACT',
    label: 'Marketing Contact',
    color: 'pink',
    position: 4,
  },
];

export const OPPORTUNITY_SOURCE_OPTIONS: FieldOption[] = [
  {
    id: '78b33a01-3ff0-4877-8819-2fff44f4b7e3',
    value: 'PARTNER_REFERRED',
    label: 'Partner Referred',
    color: 'green',
    position: 0,
  },
  {
    id: '520c457a-5596-4232-897d-fd7ce65f007a',
    value: 'PARTNER_INFLUENCED',
    label: 'Partner Influenced',
    color: 'blue',
    position: 1,
  },
  {
    id: '115c537c-bb0d-48a3-9299-fea9dce11557',
    value: 'CO_SELL',
    label: 'Co-Sell',
    color: 'purple',
    position: 2,
  },
  {
    id: 'ccbd2839-f257-4efe-963a-2bb3d84bf2cd',
    value: 'MARKETPLACE',
    label: 'Marketplace',
    color: 'turquoise',
    position: 3,
  },
];

export const ATTRIBUTION_STATUS_OPTIONS: FieldOption[] = [
  {
    id: '2327d21f-ea59-4baf-bf19-9bb43653898d',
    value: 'PENDING',
    label: 'Pending',
    color: 'yellow',
    position: 0,
  },
  {
    id: '97480ca5-d755-4e77-9e73-809565f04790',
    value: 'ACCEPTED',
    label: 'Accepted',
    color: 'green',
    position: 1,
  },
  {
    id: '09893abd-36e6-4d1d-bc10-92735ec5313a',
    value: 'REJECTED',
    label: 'Rejected',
    color: 'red',
    position: 2,
  },
  {
    id: 'ad5b32a9-df11-4b6a-82d3-9857ebe11c9d',
    value: 'PAID',
    label: 'Paid',
    color: 'blue',
    position: 3,
  },
];

export const ENROLLMENT_STATUS_OPTIONS: FieldOption[] = [
  {
    id: '2bbd8741-774f-45d5-a7cf-54f83087d369',
    value: 'APPLIED',
    label: 'Applied',
    color: 'yellow',
    position: 0,
  },
  {
    id: '7f40d58e-d9a9-45b7-bb3a-76fbc38d0bb1',
    value: 'ACTIVE',
    label: 'Active',
    color: 'green',
    position: 1,
  },
  {
    id: '27c77630-7742-4371-be3d-e5b4f4e4a8a5',
    value: 'PAUSED',
    label: 'Paused',
    color: 'orange',
    position: 2,
  },
  {
    id: '9846d47c-9f1e-4edd-9ce5-75aa8a87d0e7',
    value: 'ENDED',
    label: 'Ended',
    color: 'gray',
    position: 3,
  },
];

export const PARTNER_SUBTYPE_OPTIONS: FieldOption[] = [
  {
    id: '4f36cbaf-c85d-49d6-9b07-58f37b02af7a',
    value: 'REVENUE_OPS',
    label: 'Revenue Ops',
    color: 'blue',
    position: 0,
  },
  {
    id: '05c47047-9183-4399-b6d2-785ff44c5b6e',
    value: 'TECHNOLOGY_IMPLEMENTATION',
    label: 'Technology Implementation',
    color: 'purple',
    position: 1,
  },
  {
    id: '3c22203d-0e22-46c3-984f-773b30a2d07d',
    value: 'MANAGED_SERVICES',
    label: 'Managed Services',
    color: 'turquoise',
    position: 2,
  },
  {
    id: '41e04ba6-5a74-4444-a173-a0bb5ebbeea4',
    value: 'ADVISORY',
    label: 'Advisory',
    color: 'green',
    position: 3,
  },
];
