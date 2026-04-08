// TODO: upstream cherry-pick stub - wrapper that renames createOneCoreView to createOneView
import { createOneCoreView } from 'test/integration/metadata/suites/view/utils/create-one-core-view.util';

import { type CreateViewInput } from 'src/engine/metadata-modules/view/dtos/inputs/create-view.input';
import { type ViewEntity } from 'src/engine/metadata-modules/view/entities/view.entity';

export const createOneView = async ({
  input,
  gqlFields,
  expectToFail,
}: {
  input: CreateViewInput;
  gqlFields?: string;
  expectToFail?: boolean;
}): Promise<{
  data: { createView: ViewEntity };
  errors?: any;
}> => {
  const result = await createOneCoreView({
    input,
    gqlFields,
    expectToFail,
  });

  return {
    data: {
      createView: (result.data as any)?.createCoreView,
    },
    errors: result.errors,
  };
};
