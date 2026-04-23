// Compatibility shim: Fuse renamed `generatedMockObjectMetadataItems`
// (an auto-generated array) to `getTestEnrichedObjectMetadataItemsMock`
// (a function). Consumers import it as a value, so we call the function
// once at module load and re-export the result.
// TODO(wave-3-cleanup): migrate consumers to call the function directly.
import { getTestEnrichedObjectMetadataItemsMock } from '~/testing/utils/getTestEnrichedObjectMetadataItemsMock';

export const generatedMockObjectMetadataItems = getTestEnrichedObjectMetadataItemsMock();
