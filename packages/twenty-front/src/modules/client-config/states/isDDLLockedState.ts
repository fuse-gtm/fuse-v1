import { createAtomState } from '@/ui/utilities/state/jotai/utils/createAtomState';

<<<<<<<< HEAD:packages/twenty-front/src/modules/client-config/states/isDDLLockedState.ts
export const isDDLLockedState = createAtomState<boolean>({
  key: 'isDDLLocked',
========
export const isMinimalMetadataReadyState = createAtomState<boolean>({
  key: 'isMinimalMetadataReadyState',
>>>>>>>> ba9aa41bba (refactor: metadata store cleanup, SSE unification, mock metadata loading & login redirect fix (#18651)):packages/twenty-front/src/modules/metadata-store/states/isMinimalMetadataReadyState.ts
  defaultValue: false,
});
