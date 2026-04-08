// TODO: upstream cherry-pick stub - wrapper that renames createManyCoreViewGroups to createManyViewGroups
import { createManyCoreViewGroups } from 'test/integration/metadata/suites/view-group/utils/create-many-core-view-groups.util';

import { type CreateViewGroupInput } from 'src/engine/metadata-modules/view-group/dtos/inputs/create-view-group.input';
import { type ViewGroupEntity } from 'src/engine/metadata-modules/view-group/entities/view-group.entity';

export const createManyViewGroups = async ({
  inputs,
  gqlFields,
  expectToFail,
}: {
  inputs: CreateViewGroupInput[];
  gqlFields?: string;
  expectToFail?: boolean;
}): Promise<{
  data: { createManyViewGroups: ViewGroupEntity[] };
  errors?: any;
}> => {
  const result = await createManyCoreViewGroups({
    inputs,
    gqlFields,
    expectToFail,
  });

  return {
    data: {
      createManyViewGroups: (result.data as any)?.createManyCoreViewGroups ?? [],
    },
    errors: result.errors,
  };
};
