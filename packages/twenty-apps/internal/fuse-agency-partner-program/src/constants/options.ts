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

export const AGENCY_SERVICE_BUCKET_OPTIONS: FieldOption[] = [
  {
    id: 'd5af1dd4-1fc1-4488-ac1a-efc6497b04ec',
    value: 'revenue_acceleration',
    label: 'Revenue Acceleration',
    color: 'green',
    position: 0,
  },
  {
    id: '4ab9d133-3810-4ea8-9ed4-17c1f1ada1ef',
    value: 'revenue_ops',
    label: 'Revenue Ops',
    color: 'blue',
    position: 1,
  },
  {
    id: 'd347dce8-7056-4f48-a167-ca08c6942ced',
    value: 'technology_implementation',
    label: 'Technology Implementation',
    color: 'purple',
    position: 2,
  },
  {
    id: '51d8c2de-449d-4706-a088-779296c3b965',
    value: 'digital_experience',
    label: 'Digital Experience',
    color: 'turquoise',
    position: 3,
  },
  {
    id: 'e324df6a-6061-4cb2-aee7-6ccf8c54b104',
    value: 'brand_creative',
    label: 'Brand & Creative',
    color: 'pink',
    position: 4,
  },
];

export const AGENCY_APPLICATION_STATUS_OPTIONS: FieldOption[] = [
  {
    id: '6359625b-f50e-4eea-a056-c16b47c95889',
    value: 'submitted',
    label: 'Submitted',
    color: 'blue',
    position: 0,
  },
  {
    id: 'd3364bd1-a466-4dba-9191-add725528a62',
    value: 'needs_review',
    label: 'Needs Review',
    color: 'yellow',
    position: 1,
  },
  {
    id: 'f5686e5e-d10d-4937-9bad-818ade18a04a',
    value: 'approved',
    label: 'Approved',
    color: 'green',
    position: 2,
  },
  {
    id: '4b08f25c-d428-4a6c-8cbd-eddbc3f61f8f',
    value: 'rejected',
    label: 'Rejected',
    color: 'red',
    position: 3,
  },
  {
    id: 'cd8ee40c-5d5e-46e5-a26c-15a4639e49d5',
    value: 'fraud_review',
    label: 'Fraud Review',
    color: 'orange',
    position: 4,
  },
  {
    id: '397f0ecf-b076-4f78-ab40-1df4e608b53c',
    value: 'withdrawn',
    label: 'Withdrawn',
    color: 'gray',
    position: 5,
  },
];

export const AGENCY_RISK_STATE_OPTIONS: FieldOption[] = [
  {
    id: 'de322ce8-6a66-4b19-93fc-6ac8daefc2be',
    value: 'clear',
    label: 'Clear',
    color: 'green',
    position: 0,
  },
  {
    id: '4e04eb19-c56c-480f-9751-4e43be56bc2e',
    value: 'needs_review',
    label: 'Needs Review',
    color: 'yellow',
    position: 1,
  },
  {
    id: '674258e4-9a51-44e5-82ea-aad6a6dddcff',
    value: 'fraud_review',
    label: 'Fraud Review',
    color: 'orange',
    position: 2,
  },
  {
    id: 'd4e110f5-1649-4ec8-a028-195d194857ca',
    value: 'blocked',
    label: 'Blocked',
    color: 'red',
    position: 3,
  },
];

export const AGENCY_GROUP_TIER_OPTIONS: FieldOption[] = [
  {
    id: '3dad4c58-4beb-4a5c-a422-1f03fe2d47c7',
    value: 'standard',
    label: 'Standard',
    color: 'blue',
    position: 0,
  },
  {
    id: '9fa7102f-2adf-426b-bc94-088f7dd8af8d',
    value: 'premier',
    label: 'Premier',
    color: 'purple',
    position: 1,
  },
  {
    id: '64a5e72a-5595-49b0-ada8-04e1d2836f10',
    value: 'strategic',
    label: 'Strategic',
    color: 'green',
    position: 2,
  },
];

export const AGENCY_GROUP_STATUS_OPTIONS: FieldOption[] = [
  {
    id: '7c3d8b0e-4a33-4e17-ac9f-61d710f6dd9a',
    value: 'active',
    label: 'Active',
    color: 'green',
    position: 0,
  },
  {
    id: 'fb655900-468e-438b-98fb-ee21276945c2',
    value: 'paused',
    label: 'Paused',
    color: 'orange',
    position: 1,
  },
  {
    id: '872d0892-a94c-48ff-b95b-404f5fa14f82',
    value: 'archived',
    label: 'Archived',
    color: 'gray',
    position: 2,
  },
];

export const AGENCY_REVIEW_ACTION_OPTIONS: FieldOption[] = [
  {
    id: 'dc8741b2-11ee-4cf7-8aeb-992f47501db8',
    value: 'submitted',
    label: 'Submitted',
    color: 'blue',
    position: 0,
  },
  {
    id: '4842eb01-2aa7-4818-9816-0c94875a9aa6',
    value: 'approved',
    label: 'Approved',
    color: 'green',
    position: 1,
  },
  {
    id: '65a11950-701e-4c9a-8228-50ea60e480d5',
    value: 'rejected',
    label: 'Rejected',
    color: 'red',
    position: 2,
  },
  {
    id: '1446b2ae-77fa-44c4-91c2-6c4138a12caa',
    value: 'duplicate_detected',
    label: 'Duplicate Detected',
    color: 'orange',
    position: 3,
  },
];

export const MONTHLY_LEAD_VOLUME_OPTIONS: FieldOption[] = [
  {
    id: 'c521706c-6f58-41b1-89f1-08eebdb214ae',
    value: 'zero_to_ten',
    label: '0-10',
    color: 'gray',
    position: 0,
  },
  {
    id: '2b142795-52d7-4d97-88bd-38d2cea74db0',
    value: 'eleven_to_fifty',
    label: '11-50',
    color: 'blue',
    position: 1,
  },
  {
    id: 'd5272ce5-69c1-4d24-ae35-1bfb7821881f',
    value: 'fifty_one_to_two_hundred',
    label: '51-200',
    color: 'green',
    position: 2,
  },
  {
    id: '424ee10f-a44b-4c0a-88f9-6354fe191d56',
    value: 'two_hundred_plus',
    label: '200+',
    color: 'purple',
    position: 3,
  },
];

export const PLATFORM_FOCUS_OPTIONS: FieldOption[] = [
  {
    id: '73bfadf9-0167-478f-bacb-428066343ca5',
    value: 'hubspot',
    label: 'HubSpot',
    color: 'orange',
    position: 0,
  },
  {
    id: 'af0a3f2b-20a9-4349-98bb-14aacddfe2ff',
    value: 'shopify',
    label: 'Shopify',
    color: 'green',
    position: 1,
  },
  {
    id: 'ec7f407a-d3c7-4feb-bbc6-0b943d00909f',
    value: 'salesforce',
    label: 'Salesforce',
    color: 'blue',
    position: 2,
  },
  {
    id: 'd47bee29-1db5-46b2-819e-22a90d911f8d',
    value: 'partnervue',
    label: 'PartnerVue',
    color: 'purple',
    position: 3,
  },
  {
    id: 'ebdef10a-b376-4eed-83de-909adacaffcb',
    value: 'other',
    label: 'Other',
    color: 'gray',
    position: 4,
  },
];

export const CAPACITY_BAND_OPTIONS: FieldOption[] = [
  {
    id: '08064bc5-5021-4dcd-a38d-82ac6a10d44a',
    value: 'micro',
    label: 'Micro',
    color: 'gray',
    position: 0,
  },
  {
    id: '40202452-2f96-453c-b39d-98fcfc6485d5',
    value: 'boutique',
    label: 'Boutique',
    color: 'blue',
    position: 1,
  },
  {
    id: 'cd80c49d-1e3e-4c76-8a14-4fe84dfde301',
    value: 'mid_market',
    label: 'Mid-Market',
    color: 'green',
    position: 2,
  },
  {
    id: '5feef585-bc40-4858-a07e-78ee42e4092b',
    value: 'enterprise',
    label: 'Enterprise',
    color: 'purple',
    position: 3,
  },
];

export const RESOURCE_TYPE_OPTIONS: FieldOption[] = [
  {
    id: '13341c5b-9010-489f-87c4-a533018d57ff',
    value: 'playbook',
    label: 'Playbook',
    color: 'blue',
    position: 0,
  },
  {
    id: 'f8d1f49b-70ec-4a66-8335-ad554b766fa1',
    value: 'case_study',
    label: 'Case Study',
    color: 'green',
    position: 1,
  },
  {
    id: '10e97ab9-7208-4f2b-a9ef-fb7b9639c003',
    value: 'one_pager',
    label: 'One-Pager',
    color: 'sky',
    position: 2,
  },
  {
    id: 'a228cf06-5195-4071-84eb-906e178712f3',
    value: 'brand_asset',
    label: 'Brand Asset',
    color: 'purple',
    position: 3,
  },
  {
    id: 'b577c9d0-625f-44cb-bb79-9c91909a5e4e',
    value: 'training',
    label: 'Training',
    color: 'orange',
    position: 4,
  },
];

export const RESOURCE_STATUS_OPTIONS: FieldOption[] = [
  {
    id: '6a8b54bb-99ad-44cd-947d-49599050136f',
    value: 'draft',
    label: 'Draft',
    color: 'gray',
    position: 0,
  },
  {
    id: '0b93c5bf-cefa-4b07-8948-f95bfa365d50',
    value: 'active',
    label: 'Active',
    color: 'green',
    position: 1,
  },
  {
    id: 'b6a86e33-873e-436c-84cb-f42e96be7fc4',
    value: 'archived',
    label: 'Archived',
    color: 'orange',
    position: 2,
  },
];

export const ATTRIBUTION_TYPE_OPTIONS: FieldOption[] = [
  {
    id: 'd38538ec-5041-4dae-b38f-63dcfe5e3789',
    value: 'referral',
    label: 'Referral',
    color: 'green',
    position: 0,
  },
  {
    id: 'a643e530-80bd-489b-afd1-64570453a047',
    value: 'services_influence',
    label: 'Services Influence',
    color: 'blue',
    position: 1,
  },
  {
    id: '297e2920-321e-4413-a470-2894cb7e54a9',
    value: 'co_sell',
    label: 'Co-Sell',
    color: 'purple',
    position: 2,
  },
  {
    id: 'ef661f2e-b61b-42d6-be53-15051891816f',
    value: 'marketplace',
    label: 'Marketplace',
    color: 'orange',
    position: 3,
  },
];

export const ATTRIBUTION_STATUS_OPTIONS: FieldOption[] = [
  {
    id: 'e92bc0b1-84a9-4413-8c04-f1f5c17a26fc',
    value: 'pending',
    label: 'Pending',
    color: 'yellow',
    position: 0,
  },
  {
    id: 'e213c976-2722-4540-8842-4a69c7aacabe',
    value: 'accepted',
    label: 'Accepted',
    color: 'green',
    position: 1,
  },
  {
    id: 'f978ce2e-ffe3-4dc3-b87d-8ee979cdd4ce',
    value: 'rejected',
    label: 'Rejected',
    color: 'red',
    position: 2,
  },
  {
    id: 'f0b7b434-2055-4d1c-b80a-95410ee9b4f2',
    value: 'paid',
    label: 'Paid',
    color: 'blue',
    position: 3,
  },
];

export const REFERRAL_EVENT_TYPE_OPTIONS: FieldOption[] = [
  {
    id: '793ac413-5208-4eba-9663-7736418c9ed5',
    value: 'lead',
    label: 'Lead',
    color: 'blue',
    position: 0,
  },
  {
    id: 'a3873c16-37b2-4ab5-81ce-d886764a5ad9',
    value: 'sale',
    label: 'Sale',
    color: 'green',
    position: 1,
  },
];

export const REFERRAL_EVENT_STATUS_OPTIONS: FieldOption[] = [
  {
    id: '9f748b2b-ef6d-4e1b-a816-5f1ed9c7193a',
    value: 'accepted',
    label: 'Accepted',
    color: 'green',
    position: 0,
  },
  {
    id: '799df785-8050-4552-9ca1-f878a6de84cc',
    value: 'duplicate',
    label: 'Duplicate',
    color: 'orange',
    position: 1,
  },
  {
    id: 'e3ee5b9a-8e54-411c-92dd-2509a5cd61f1',
    value: 'rejected',
    label: 'Rejected',
    color: 'red',
    position: 2,
  },
];

export const REFERRAL_ROLLUP_SCOPE_OPTIONS: FieldOption[] = [
  {
    id: 'e66c5fa1-4d9a-42b5-a4b5-6e98a395900f',
    value: 'partner_profile',
    label: 'Partner Profile',
    color: 'blue',
    position: 0,
  },
  {
    id: '8f2ba098-08c5-4308-808d-e0e966fd7b43',
    value: 'agency_group',
    label: 'Agency Group',
    color: 'purple',
    position: 1,
  },
  {
    id: 'd1c6907c-8071-400d-ac62-a156efdba8f9',
    value: 'enrollment',
    label: 'Enrollment',
    color: 'green',
    position: 2,
  },
];

export const REFERRAL_ROLLUP_REPAIR_STATUS_OPTIONS: FieldOption[] = [
  {
    id: 'e3f1c1a8-308b-4a28-9087-a9b0314bfb3e',
    value: 'fresh',
    label: 'Fresh',
    color: 'green',
    position: 0,
  },
  {
    id: 'bdc2c8b5-384f-4742-818e-8a51c959b487',
    value: 'repaired',
    label: 'Repaired',
    color: 'blue',
    position: 1,
  },
];

export const TASK_TYPE_OPTIONS: FieldOption[] = [
  {
    id: 'd36fc132-5f24-477a-8568-493db26fced0',
    value: 'application_review',
    label: 'Application Review',
    color: 'blue',
    position: 0,
  },
  {
    id: '3d4ea62a-6f58-42ad-a902-cdb938f5cf85',
    value: 'enablement',
    label: 'Enablement',
    color: 'purple',
    position: 1,
  },
  {
    id: '6e6f0773-085f-4981-a896-af3f2d392be7',
    value: 'follow_up',
    label: 'Follow Up',
    color: 'green',
    position: 2,
  },
  {
    id: '0afff68a-81e8-4450-b60f-11779243d166',
    value: 'attribution_review',
    label: 'Attribution Review',
    color: 'orange',
    position: 3,
  },
];

export const TASK_STATUS_OPTIONS: FieldOption[] = [
  {
    id: 'bee4990f-d34d-474e-a941-5889966da4bf',
    value: 'open',
    label: 'Open',
    color: 'blue',
    position: 0,
  },
  {
    id: '9dff34c0-702e-4f80-b9ec-f98459a3673f',
    value: 'in_progress',
    label: 'In Progress',
    color: 'yellow',
    position: 1,
  },
  {
    id: '10bbdce1-3195-4ae6-a780-82e3b0e17666',
    value: 'done',
    label: 'Done',
    color: 'green',
    position: 2,
  },
  {
    id: 'c7c2b5f3-ce46-477b-bbd2-c5b848ea9860',
    value: 'blocked',
    label: 'Blocked',
    color: 'red',
    position: 3,
  },
];
