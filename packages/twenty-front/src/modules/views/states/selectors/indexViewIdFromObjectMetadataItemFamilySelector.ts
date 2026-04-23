import { coreViewsSelector } from '@/views/states/selectors/coreViewsSelector';
import { ViewKey } from '@/views/types/ViewKey';
import { convertCoreViewToView } from '@/views/utils/convertCoreViewToView';
import { createAtomFamilySelector } from '@/ui/utilities/state/jotai/utils/createAtomFamilySelector';

export const coreIndexViewIdFromObjectMetadataItemFamilySelector =
  createAtomFamilySelector<
    string | undefined,
    { objectMetadataItemId: string }
  >({
    key: 'coreIndexViewIdFromObjectMetadataItemFamilySelector',
    get:
      ({ objectMetadataItemId }) =>
      ({ get }) => {
        const coreViews = get(coreViewsSelector);
        const views = coreViews.map(convertCoreViewToView);
        return views?.find(
          (view) =>
            view.objectMetadataId === objectMetadataItemId &&
            view.key === ViewKey.Index,
        )?.id;
      },
  });

// Dead-symbol stub: never committed / missing canonical. Returns undefined.
export const indexViewIdFromObjectMetadataItemFamilySelector = (..._args: unknown[]): unknown => undefined;
