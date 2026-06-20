import { type MessageDescriptor } from '@lingui/core';
import { msg } from '@lingui/core/macro';
import { type AllMetadataName } from 'twenty-shared/metadata';

import { EMPTY_ORCHESTRATOR_FAILURE_REPORT } from 'src/engine/workspace-manager/workspace-migration/constant/empty-orchestrator-failure-report.constant';
import { WorkspaceMigrationBuilderException } from 'src/engine/workspace-manager/workspace-migration/exceptions/workspace-migration-builder-exception';
import { buildMetadataValidationErrorPayload } from 'src/engine/workspace-manager/workspace-migration/interceptors/utils/build-metadata-validation-error-payload.util';
import { type OrchestratorFailureReport } from 'src/engine/workspace-manager/workspace-migration/types/workspace-migration-orchestrator.type';

const buildFailedValidation = (
  metadataName: AllMetadataName,
  errors: Array<{
    code: string;
    message: string;
    userFriendlyMessage?: MessageDescriptor;
  }>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any => ({
  type: 'create',
  metadataName,
  errors,
  flatEntityMinimalInformation: {},
});

const buildException = (
  partialReport: Partial<OrchestratorFailureReport>,
): WorkspaceMigrationBuilderException =>
  new WorkspaceMigrationBuilderException({
    status: 'fail',
    report: { ...EMPTY_ORCHESTRATOR_FAILURE_REPORT(), ...partialReport },
  });

describe('buildMetadataValidationErrorPayload', () => {
  it('returns an empty errors record and a totalErrors-of-0 summary when no metadata has failures', () => {
    const payload = buildMetadataValidationErrorPayload(buildException({}));

    expect(payload.errors).toEqual({});
    expect(payload.summary).toEqual({ totalErrors: 0 });
    expect(payload.userFriendlyMessage).toEqual(
      msg`Metadata validation failed`,
    );
  });

  it('aggregates per-metadata failure counts into the summary and only exposes metadata buckets that have failures', () => {
    const payload = buildMetadataValidationErrorPayload(
      buildException({
        view: [
          buildFailedValidation('view', [{ code: 'A', message: 'a' }]),
          buildFailedValidation('view', [{ code: 'B', message: 'b' }]),
        ],
        viewGroup: [
          buildFailedValidation('viewGroup', [{ code: 'C', message: 'c' }]),
        ],
      }),
    );

    expect(payload.summary).toEqual({
      totalErrors: 3,
      view: 2,
      viewGroup: 1,
    });
    expect(Object.keys(payload.errors).sort()).toEqual(['view', 'viewGroup']);
  });

  it('uses the failed validation metadataName when it differs from the report bucket', () => {
    const payload = buildMetadataValidationErrorPayload(
      buildException({
        view: [
          buildFailedValidation('viewField', [
            { code: 'VIEW_FIELD_ERROR', message: 'bad view field' },
          ]),
        ],
      }),
    );

    expect(payload.summary).toEqual({
      totalErrors: 1,
      viewField: 1,
    });
    expect(payload.errors.view).toBeUndefined();
    expect(payload.errors.viewField).toHaveLength(1);
  });

  it('returns the generic "Many validation errors" descriptor when more than one failed validation is reported', () => {
    const payload = buildMetadataValidationErrorPayload(
      buildException({
        role: [
          buildFailedValidation('role', [
            {
              code: 'ERR',
              message: 'x',
              userFriendlyMessage: msg`Only error`,
            },
          ]),
          buildFailedValidation('role', [
            {
              code: 'ERR2',
              message: 'y',
              userFriendlyMessage: msg`Other error`,
            },
          ]),
        ],
      }),
    );

    expect(payload.userFriendlyMessage).toEqual(msg`Many validation errors`);
  });

  it("returns the only failure's userFriendlyMessage when exactly one failed validation is reported", () => {
    const userFriendlyMessage = msg`Role name is invalid`;

    const payload = buildMetadataValidationErrorPayload(
      buildException({
        role: [
          buildFailedValidation('role', [
            {
              code: 'ROLE_ERROR',
              message: 'invalid',
              userFriendlyMessage,
            },
          ]),
        ],
      }),
    );

    expect(payload.userFriendlyMessage).toBe(userFriendlyMessage);
  });

  it('returns the fallback descriptor when the only reported failure has no userFriendlyMessage on any of its errors', () => {
    const payload = buildMetadataValidationErrorPayload(
      buildException({
        view: [
          buildFailedValidation('view', [
            { code: 'X', message: 'y' },
            { code: 'Z', message: 'z' },
          ]),
        ],
      }),
    );

    expect(payload.userFriendlyMessage).toEqual(
      msg`Metadata validation failed`,
    );
  });

  it("returns the first error's userFriendlyMessage and skips earlier errors that do not provide one", () => {
    const userFriendlyMessage = msg`First friendly message`;

    const payload = buildMetadataValidationErrorPayload(
      buildException({
        fieldMetadata: [
          buildFailedValidation('fieldMetadata', [
            { code: 'A', message: 'first' },
            { code: 'B', message: 'second', userFriendlyMessage },
            {
              code: 'C',
              message: 'third',
              userFriendlyMessage: msg`Would not reach this`,
            },
          ]),
        ],
      }),
    );

    expect(payload.userFriendlyMessage).toBe(userFriendlyMessage);
  });
});
