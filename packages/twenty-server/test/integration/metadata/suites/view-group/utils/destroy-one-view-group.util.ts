// TODO: upstream cherry-pick stub - wrapper that renames destroyOneCoreViewGroup to destroyOneViewGroup
import { destroyOneCoreViewGroup } from 'test/integration/metadata/suites/view-group/utils/destroy-one-core-view-group.util';

import { type DestroyViewGroupInput } from 'src/engine/metadata-modules/view-group/dtos/inputs/destroy-view-group.input';
import { type ViewGroupEntity } from 'src/engine/metadata-modules/view-group/entities/view-group.entity';

export const destroyOneViewGroup = async ({
  input,
  gqlFields,
  expectToFail,
}: {
  input: DestroyViewGroupInput;
  gqlFields?: string;
  expectToFail?: boolean;
}): Promise<{
  data: { destroyViewGroup: ViewGroupEntity };
  errors?: any;
}> => {
  const result = await destroyOneCoreViewGroup({
    input,
    gqlFields,
    expectToFail,
  });

  return {
    data: {
      destroyViewGroup: (result.data as any)?.destroyCoreViewGroup,
    },
    errors: result.errors,
  };
};
