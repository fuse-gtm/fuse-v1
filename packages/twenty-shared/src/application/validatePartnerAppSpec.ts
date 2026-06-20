import {
  FUSE_COMMERCIAL_MODELS,
  FUSE_PARTNER_TYPES,
  FUSE_PROGRAM_MECHANICS,
  type PartnerAppSpec,
  type PartnerAppSpecValidationIssue,
  type PartnerAppSpecValidationResult,
} from '@/application/partnerAppSpecType';

const forbiddenPartnerTypeValues = new Set([
  ...FUSE_PROGRAM_MECHANICS,
  'affiliate',
]);

const forbiddenProgramMechanicValues = new Set([
  ...FUSE_PARTNER_TYPES,
  'affiliate',
]);

const hasOwn = (value: object, key: string) =>
  Object.prototype.hasOwnProperty.call(value, key);

const addIssue = (
  issues: PartnerAppSpecValidationIssue[],
  issue: PartnerAppSpecValidationIssue,
) => {
  issues.push(issue);
};

const isAllowedValue = <T extends readonly string[]>(
  allowedValues: T,
  value: unknown,
): value is T[number] =>
  typeof value === 'string' && allowedValues.includes(value);

const collectUniversalIdentifier = (
  issues: PartnerAppSpecValidationIssue[],
  seen: Map<string, string>,
  path: string,
  universalIdentifier: unknown,
) => {
  if (typeof universalIdentifier !== 'string' || universalIdentifier === '') {
    return;
  }

  const previousPath = seen.get(universalIdentifier);

  if (previousPath !== undefined) {
    addIssue(issues, {
      code: 'DUPLICATE_UNIVERSAL_IDENTIFIER',
      path,
      message: `Universal identifier "${universalIdentifier}" is already used at ${previousPath}.`,
    });

    return;
  }

  seen.set(universalIdentifier, path);
};

const collectEntityListIdentifiers = (
  issues: PartnerAppSpecValidationIssue[],
  seen: Map<string, string>,
  path: string,
  entities: Array<{ universalIdentifier?: unknown }> | undefined,
) => {
  if (!Array.isArray(entities)) {
    return;
  }

  entities.forEach((entity, index) => {
    collectUniversalIdentifier(
      issues,
      seen,
      `${path}[${index}].universalIdentifier`,
      entity.universalIdentifier,
    );
  });
};

const collectApplicationVariableIdentifiers = (
  issues: PartnerAppSpecValidationIssue[],
  seen: Map<string, string>,
  spec: PartnerAppSpec,
) => {
  const variables = {
    ...spec.application.applicationVariables,
    ...spec.applicationVariables,
  };

  Object.entries(variables).forEach(([name, variable]) => {
    collectUniversalIdentifier(
      issues,
      seen,
      `applicationVariables.${name}.universalIdentifier`,
      variable.universalIdentifier,
    );
  });
};

const validateTaxonomy = (
  issues: PartnerAppSpecValidationIssue[],
  spec: PartnerAppSpec,
) => {
  const partnerType = spec.taxonomy.partnerType;

  if (!isAllowedValue(FUSE_PARTNER_TYPES, partnerType)) {
    addIssue(issues, {
      code: forbiddenPartnerTypeValues.has(partnerType)
        ? 'AXIS_CONFLATION'
        : 'INVALID_PARTNER_TYPE',
      path: 'taxonomy.partnerType',
      message:
        'Partner type must be a scalar Axis 1 value. Referral and affiliate are program mechanics or labels, not partner types.',
    });
  }

  spec.taxonomy.programMechanics.forEach((programMechanic, index) => {
    if (!isAllowedValue(FUSE_PROGRAM_MECHANICS, programMechanic)) {
      addIssue(issues, {
        code: forbiddenProgramMechanicValues.has(programMechanic)
          ? 'AXIS_CONFLATION'
          : 'INVALID_PROGRAM_MECHANIC',
        path: `taxonomy.programMechanics[${index}]`,
        message:
          'Program mechanic must be an Axis 2 value. Agency is a partner type; referral is the mechanic.',
      });
    }
  });

  spec.taxonomy.commercialModels.forEach((commercialModel, index) => {
    if (!isAllowedValue(FUSE_COMMERCIAL_MODELS, commercialModel)) {
      addIssue(issues, {
        code: 'INVALID_COMMERCIAL_MODEL',
        path: `taxonomy.commercialModels[${index}]`,
        message:
          'Commercial model must describe value exchange separately from partner type and program mechanic.',
      });
    }
  });
};

const validateRequiredApplicationVariables = (
  issues: PartnerAppSpecValidationIssue[],
  spec: PartnerAppSpec,
) => {
  const variables = {
    ...spec.application.applicationVariables,
    ...spec.applicationVariables,
  };

  spec.requiredApplicationVariables?.forEach((variableName, index) => {
    if (!hasOwn(variables, variableName)) {
      addIssue(issues, {
        code: 'MISSING_REQUIRED_APPLICATION_VARIABLE',
        path: `requiredApplicationVariables[${index}]`,
        message: `Required application variable "${variableName}" is not declared.`,
      });
    }
  });
};

const validateUniversalIdentifiers = (
  issues: PartnerAppSpecValidationIssue[],
  spec: PartnerAppSpec,
) => {
  const seen = new Map<string, string>();

  collectUniversalIdentifier(
    issues,
    seen,
    'application.universalIdentifier',
    spec.application.universalIdentifier,
  );

  collectApplicationVariableIdentifiers(issues, seen, spec);

  collectEntityListIdentifiers(
    issues,
    seen,
    'standardObjectExtensions.fields',
    spec.standardObjectExtensions.flatMap(({ fields = [] }) => fields),
  );
  collectEntityListIdentifiers(
    issues,
    seen,
    'standardObjectExtensions.views',
    spec.standardObjectExtensions.flatMap(({ views = [] }) => views),
  );
  collectEntityListIdentifiers(
    issues,
    seen,
    'standardObjectExtensions.pageLayouts',
    spec.standardObjectExtensions.flatMap(
      ({ pageLayouts = [] }) => pageLayouts,
    ),
  );
  collectEntityListIdentifiers(
    issues,
    seen,
    'standardObjectExtensions.navigationMenuItems',
    spec.standardObjectExtensions.flatMap(
      ({ navigationMenuItems = [] }) => navigationMenuItems,
    ),
  );

  collectEntityListIdentifiers(
    issues,
    seen,
    'customObjects',
    spec.customObjects,
  );
  collectEntityListIdentifiers(
    issues,
    seen,
    'relationFields',
    spec.relationFields,
  );
  collectEntityListIdentifiers(issues, seen, 'roles', spec.roles);
  collectEntityListIdentifiers(issues, seen, 'views', spec.views);
  collectEntityListIdentifiers(issues, seen, 'pageLayouts', spec.pageLayouts);
  collectEntityListIdentifiers(
    issues,
    seen,
    'navigationMenuItems',
    spec.navigationMenuItems,
  );
  collectEntityListIdentifiers(
    issues,
    seen,
    'frontComponents',
    spec.frontComponents,
  );
  collectEntityListIdentifiers(
    issues,
    seen,
    'logicFunctions',
    spec.logicFunctions,
  );
  collectEntityListIdentifiers(issues, seen, 'skills', spec.skills);
  collectEntityListIdentifiers(issues, seen, 'agents', spec.agents);
  collectEntityListIdentifiers(issues, seen, 'seedData', spec.seedData);
};

export const validatePartnerAppSpec = (
  spec: PartnerAppSpec,
): PartnerAppSpecValidationResult => {
  const issues: PartnerAppSpecValidationIssue[] = [];

  validateTaxonomy(issues, spec);
  validateRequiredApplicationVariables(issues, spec);
  validateUniversalIdentifiers(issues, spec);

  return {
    valid: issues.length === 0,
    issues,
  };
};

export const assertValidPartnerAppSpec = (spec: PartnerAppSpec) => {
  const result = validatePartnerAppSpec(spec);

  if (!result.valid) {
    throw new Error(
      result.issues
        .map(({ path, message }) => `${path}: ${message}`)
        .join('\n'),
    );
  }
};
