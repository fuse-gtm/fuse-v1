// Compatibility shim: @/object-metadata/states/objectMetadataItemsState was renamed to @/object-metadata/states/objectMetadataItemsSelector in upstream refactor.
// Fuse consumers still import the old name; this re-export keeps them working.
// TODO(wave-3-cleanup): migrate consumers to the canonical import path.
export * from '@/object-metadata/states/objectMetadataItemsSelector';
export { objectMetadataItemsSelector as objectMetadataItemsState } from '@/object-metadata/states/objectMetadataItemsSelector';
