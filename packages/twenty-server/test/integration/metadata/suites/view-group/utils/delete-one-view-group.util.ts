// TODO: upstream cherry-pick stub - wrapper that renames deleteOneCoreViewGroup to deleteOneViewGroup
import { deleteOneCoreViewGroup } from 'test/integration/metadata/suites/view-group/utils/delete-one-core-view-group.util';

import { type DeleteViewGroupInput } from 'src/engine/metadata-modules/view-group/dtos/inputs/delete-view-group.input';
import { type ViewGroupEntity } from 'src/engine/metadata-modules/view-group/entities/view-group.entity';

export const deleteOneViewGroup = async ({
  input,
  gqlFields,
  expectToFail,
}: {
  input: DeleteViewGroupInput;
  gqlFields?: string;
  expectToFail?: boolean;
}): Promise<{
  data: { deleteViewGroup: ViewGroupEntity };
  errors?: any;
}> => {
  const result = await deleteOneCoreViewGroup({
    input,
    gqlFields,
    expectToFail,
  });

  return {
    data: {
      deleteViewGroup: (result.data as any)?.deleteCoreViewGroup,
    },
    errors: result.errors,
  };
};
