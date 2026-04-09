import { FuseAuthLayout } from '@/auth/components/FuseAuthLayout';
import { FuseOnboardingPreview } from '@/auth/components/FuseOnboardingPreview';
import { FooterNote } from '@/auth/sign-in-up/components/FooterNote';
import { Logo } from '@/auth/components/Logo';
import { SubTitle } from '@/auth/components/SubTitle';
import { Title } from '@/auth/components/Title';
import { currentWorkspaceState } from '@/auth/states/currentWorkspaceState';
import { useSetNextOnboardingStatus } from '@/onboarding/hooks/useSetNextOnboardingStatus';
import { WorkspaceLogoUploader } from '@/settings/workspace/components/WorkspaceLogoUploader';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { useLoadCurrentUser } from '@/users/hooks/useLoadCurrentUser';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { styled } from '@linaria/react';
import { CombinedGraphQLErrors } from '@apollo/client/errors';
import { themeCssVariables } from 'twenty-ui/theme-constants';
import { Trans, useLingui } from '@lingui/react/macro';
import { isNonEmptyString } from '@sniptt/guards';
import { motion } from 'framer-motion';
import { useCallback, useState } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { isDefined } from 'twenty-shared/utils';
import { H2Title } from 'twenty-ui/display';
import { Loader } from 'twenty-ui/feedback';
import { MainButton } from 'twenty-ui/input';
import { TextInput } from '@/ui/input/components/TextInput';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@apollo/client/react';
import { ActivateWorkspaceDocument } from '~/generated-metadata/graphql';

const StyledContentContainer = styled.div`
  width: 100%;
`;

const StyledSectionContainer = styled.div`
  margin-top: ${themeCssVariables.spacing[6]};
`;

const StyledButtonContainer = styled.div`
  margin-top: ${themeCssVariables.spacing[8]};
`;

const StyledLoaderContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[4]};
  justify-content: center;
  padding: ${themeCssVariables.spacing[10]} 0;
  width: 100%;
`;

const StyledPendingCreationLoader = styled(motion.div)`
  align-items: center;
  display: flex;
  justify-content: center;
  width: 100%;
`;

enum PendingCreationLoaderStep {
  None = 'none',
  Step1 = 'step-1',
  Step2 = 'step-2',
  Step3 = 'step-3',
}

export const FuseCreateWorkspace = () => {
  const { t } = useLingui();
  const { enqueueErrorSnackBar } = useSnackBar();
  const setNextOnboardingStatus = useSetNextOnboardingStatus();
  const { loadCurrentUser } = useLoadCurrentUser();
  const [activateWorkspace] = useMutation(ActivateWorkspaceDocument);
  const [pendingCreationLoaderStep, setPendingCreationLoaderStep] = useState(
    PendingCreationLoaderStep.None,
  );
  const currentWorkspace = useAtomStateValue(currentWorkspaceState);

  const validationSchema = z
    .object({
      name: z.string().min(1, { message: t`Name can not be empty` }),
    })
    .required();

  type Form = z.infer<typeof validationSchema>;

  const {
    control,
    handleSubmit,
    formState: { isValid, isSubmitting },
  } = useForm<Form>({
    mode: 'onChange',
    defaultValues: {
      name: '',
    },
    resolver: zodResolver(validationSchema),
  });

  const onSubmit: SubmitHandler<Form> = useCallback(
    async (data) => {
      try {
        setTimeout(() => {
          setPendingCreationLoaderStep(PendingCreationLoaderStep.Step1);
        }, 500);
        setTimeout(() => {
          setPendingCreationLoaderStep(PendingCreationLoaderStep.Step2);
        }, 2000);
        setTimeout(() => {
          setPendingCreationLoaderStep(PendingCreationLoaderStep.Step3);
        }, 5000);

        const result = await activateWorkspace({
          variables: {
            input: {
              displayName: data.name,
            },
          },
        });

        if (isDefined(result.error)) {
          throw result.error ?? new Error(t`Unknown error`);
        }

        await loadCurrentUser();
        setNextOnboardingStatus();
      } catch (error: unknown) {
        setPendingCreationLoaderStep(PendingCreationLoaderStep.None);

        enqueueErrorSnackBar({
          apolloError: CombinedGraphQLErrors.is(error) ? error : undefined,
        });
      }
    },
    [
      activateWorkspace,
      enqueueErrorSnackBar,
      loadCurrentUser,
      setNextOnboardingStatus,
      t,
    ],
  );

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  const isCreating =
    pendingCreationLoaderStep !== PendingCreationLoaderStep.None;

  return (
    <FuseAuthLayout
      title={isCreating ? undefined : t`Create your workspace`}
      subtitle={
        isCreating
          ? undefined
          : t`A shared environment where you will manage your partner relationships.`
      }
      stepNumber={2}
      totalSteps={5}
      footer={<FooterNote />}
      previewContent={<FuseOnboardingPreview variant="workspace" />}
    >
      {isCreating ? (
        <StyledLoaderContainer>
          <Logo
            primaryLogo={
              isNonEmptyString(currentWorkspace?.logo)
                ? currentWorkspace?.logo
                : undefined
            }
          />
          <Title>
            <Trans>Creating your workspace</Trans>
          </Title>
          <StyledPendingCreationLoader>
            {pendingCreationLoaderStep === PendingCreationLoaderStep.Step1 && (
              <SubTitle>
                <Trans>Setting up your database...</Trans>
              </SubTitle>
            )}
            {pendingCreationLoaderStep === PendingCreationLoaderStep.Step2 && (
              <SubTitle>
                <Trans>Creating your data model...</Trans>
              </SubTitle>
            )}
            {pendingCreationLoaderStep === PendingCreationLoaderStep.Step3 && (
              <SubTitle>
                <Trans>Prefilling your workspace data...</Trans>
              </SubTitle>
            )}
          </StyledPendingCreationLoader>
          <Loader color="gray" />
        </StyledLoaderContainer>
      ) : (
        <>
          <StyledContentContainer>
            <StyledSectionContainer>
              <H2Title title={t`Workspace logo`} />
              <WorkspaceLogoUploader />
            </StyledSectionContainer>
            <StyledSectionContainer>
              <H2Title
                title={t`Workspace name`}
                description={t`The name of your organization`}
              />
              <Controller
                name="name"
                control={control}
                render={({
                  field: { onChange, onBlur, value },
                  fieldState: { error },
                }) => (
                  <TextInput
                    autoFocus
                    value={value}
                    placeholder={t`Apple`}
                    onBlur={onBlur}
                    onChange={onChange}
                    error={error?.message}
                    onKeyDown={handleKeyDown}
                    fullWidth
                  />
                )}
              />
            </StyledSectionContainer>
          </StyledContentContainer>
          <StyledButtonContainer>
            <MainButton
              title={t`Continue`}
              onClick={handleSubmit(onSubmit)}
              disabled={!isValid || isSubmitting}
              Icon={() => (isSubmitting ? <Loader /> : <></>)}
              fullWidth
            />
          </StyledButtonContainer>
        </>
      )}
    </FuseAuthLayout>
  );
};
