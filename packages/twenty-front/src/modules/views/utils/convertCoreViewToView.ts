import { type View } from '@/views/types/View';
import { type ViewWithRelations } from '@/views/types/ViewWithRelations';

// Compatibility shim: Fuse consumers expected a Core -> View conversion function.
// Since CoreView is a structural alias of View (planned Fuse partner-os naming
// that was never committed), conversion is identity.
//
// TODO(wave-3-cleanup): inline the identity at consumer sites.

export const convertCoreViewToView = (view: ViewWithRelations): View => view;
