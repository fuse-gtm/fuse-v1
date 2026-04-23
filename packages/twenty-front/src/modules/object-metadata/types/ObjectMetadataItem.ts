// Compatibility shim: @/object-metadata/types/ObjectMetadataItem was renamed to @/object-metadata/types/EnrichedObjectMetadataItem in upstream refactor.
// Fuse consumers still import the old name; this re-export keeps them working.
// TODO(wave-3-cleanup): migrate consumers to the canonical import path.
export * from '@/object-metadata/types/EnrichedObjectMetadataItem';
export { EnrichedObjectMetadataItem as ObjectMetadataItem } from '@/object-metadata/types/EnrichedObjectMetadataItem';
