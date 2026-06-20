import { defineRole } from 'twenty-sdk/define';
import {
  DEFAULT_ROLE_UNIVERSAL_IDENTIFIER,
  OBJECT_IDS,
} from 'src/constants/universal-identifiers';

export default defineRole({
  universalIdentifier: DEFAULT_ROLE_UNIVERSAL_IDENTIFIER,
  label: 'Fuse partner operator',
  description:
    'Default operator role for shared Fuse partner profiles, programs, and enrollments.',
  icon: 'IconAffiliate',
  canReadAllObjectRecords: true,
  canUpdateAllObjectRecords: false,
  canSoftDeleteAllObjectRecords: false,
  canDestroyAllObjectRecords: false,
  canBeAssignedToUsers: true,
  objectPermissions: [
    {
      objectUniversalIdentifier: OBJECT_IDS.partnerProfile,
      canReadObjectRecords: true,
      canUpdateObjectRecords: true,
      canSoftDeleteObjectRecords: true,
      canDestroyObjectRecords: false,
    },
    {
      objectUniversalIdentifier: OBJECT_IDS.partnerProgram,
      canReadObjectRecords: true,
      canUpdateObjectRecords: true,
      canSoftDeleteObjectRecords: true,
      canDestroyObjectRecords: false,
    },
    {
      objectUniversalIdentifier: OBJECT_IDS.partnerEnrollment,
      canReadObjectRecords: true,
      canUpdateObjectRecords: true,
      canSoftDeleteObjectRecords: true,
      canDestroyObjectRecords: false,
    },
  ],
});
