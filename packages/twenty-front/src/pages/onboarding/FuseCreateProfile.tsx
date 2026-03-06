import { FuseAuthLayout } from '@/auth/components/FuseAuthLayout';
import { FuseOnboardingPreview } from '@/auth/components/FuseOnboardingPreview';
import { FooterNote } from '@/auth/sign-in-up/components/FooterNote';
import { currentUserState } from '@/auth/states/currentUserState';
import { currentWorkspaceMemberState } from '@/auth/states/currentWorkspaceMemberState';
import { CoreObjectNameSingular } from '@/object-metadata/types/CoreObjectNameSingular';
import { useUpdateOneRecord } from '@/object-record/hooks/useUpdateOneRecord';
import { useSetNextOnboardingStatus } from '@/onboarding/hooks/useSetNextOnboardingStatus';
import { WorkspaceMemberPictureUploader } from '@/settings/workspace-member/components/WorkspaceMemberPictureUploader';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { TextInput } from '@/ui/input/components/TextInput';
import { useAtomState } from '@/ui/utilities/state/jotai/hooks/useAtomState';
import { useSetAtomState } from '@/ui/utilities/state/jotai/hooks/useSetAtomState';
import styled from '@emotion/styled';
import { ApolloError } from '@apollo/client';
import { i18n } from '@lingui/core';
import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react/macro';
import { useCallback, useState } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { isDefined } from 'twenty-shared/utils';
import { H2Title } from 'twenty-ui/display';
import { MainButton } from 'twenty-ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const StyledContentContainer = styled.div`
  width: 100%;
`;

const StyledSectionContainer = styled.div`
  margin-top: ${({ theme }) => theme.spacing(6)};
`;

const StyledComboInputContainer = styled.div`
  display: flex;
  flex-direction: row;
  > * + * {
    margin-left: ${({ theme }) => theme.spacing(4)};
  }
`;

const StyledButtonContainer = styled.div`
  margin-top: ${({ theme }) => theme.spacing(8)};
`;

const firstNameErrorMessage = msg`First name can not be empty`;
const lastNameErrorMessage = msg`Last name can not be empty`;

const validationSchema = z
  .object({
    firstName: z.string().min(1, {
      error: i18n._(firstNameErrorMessage),
    }),
    lastName: z.string().min(1, {
      error: i18n._(lastNameErrorMessage),
    }),
  })
  .required();

type Form = z.infer<typeof validationSchema>;

export const FuseCreateProfile = () => {
  const { t } = useLingui();
  const setNextOnboardingStatus = useSetNextOnboardingStatus();
  const { enqueueErrorSnackBar } = useSnackBar();
  const [currentWorkspaceMember, setCurrentWorkspaceMember] = useAtomState(
    currentWorkspaceMemberState,
  );
  const setCurrentUser = useSetAtomState(currentUserState);
  const { updateOneRecord } = useUpdateOneRecord();

  const {
    control,
    handleSubmit,
    formState: { isValid, isSubmitting },
    getValues,
  } = useForm<Form>({
    mode: 'onChange',
    defaultValues: {
      firstName: currentWorkspaceMember?.name?.firstName ?? '',
      lastName: currentWorkspaceMember?.name?.lastName ?? '',
    },
    resolver: zodResolver(validationSchema),
  });

  const onSubmit: SubmitHandler<Form> = useCallback(
    async (data) => {
      try {
        if (!currentWorkspaceMember?.id) {
          throw new Error('User is not logged in');
        }
        if (!data.firstName || !data.lastName) {
          throw new Error('First name or last name is missing');
        }

        await updateOneRecord({
          objectNameSingular: CoreObjectNameSingular.WorkspaceMember,
          idToUpdate: currentWorkspaceMember?.id,
          updateOneRecordInput: {
            name: {
              firstName: data.firstName,
              lastName: data.lastName,
            },
            colorScheme: 'System',
          },
        });

        setCurrentWorkspaceMember((current) => {
          if (isDefined(current)) {
            return {
              ...current,
              name: {
                firstName: data.firstName,
                lastName: data.lastName,
              },
              colorScheme: 'System',
            };
          }
          return current;
        });

        setCurrentUser((current) => {
          if (isDefined(current)) {
            return {
              ...current,
              firstName: data.firstName,
              lastName: data.lastName,
            };
          }
          return current;
        });

        setNextOnboardingStatus();
      } catch (error: unknown) {
        enqueueErrorSnackBar({
          apolloError: error instanceof ApolloError ? error : undefined,
        });
      }
    },
    [
      currentWorkspaceMember?.id,
      setNextOnboardingStatus,
      enqueueErrorSnackBar,
      setCurrentWorkspaceMember,
      setCurrentUser,
      updateOneRecord,
    ],
  );

  const [isEditingMode, setIsEditingMode] = useState(false);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && isEditingMode) {
      onSubmit(getValues());
    }
  };

  return (
    <FuseAuthLayout
      title={t`Create your profile`}
      subtitle={t`How you'll be identified in the app.`}
      stepNumber={1}
      totalSteps={5}
      footer={<FooterNote />}
      previewContent={<FuseOnboardingPreview variant="profile" />}
    >
      <StyledContentContainer>
        <StyledSectionContainer>
          <H2Title title={t`Picture`} />
          {currentWorkspaceMember?.id && (
            <WorkspaceMemberPictureUploader
              workspaceMemberId={currentWorkspaceMember.id}
            />
          )}
        </StyledSectionContainer>
        <StyledSectionContainer>
          <H2Title
            title={t`Name`}
            description={t`Your name as it will be displayed on the app`}
          />
          <StyledComboInputContainer onKeyDown={handleKeyDown}>
            <Controller
              name="firstName"
              control={control}
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
              }) => (
                <TextInput
                  autoFocus
                  label={t`First Name`}
                  value={value}
                  onFocus={() => setIsEditingMode(true)}
                  onBlur={() => {
                    onBlur();
                    setIsEditingMode(false);
                  }}
                  onChange={onChange}
                  placeholder={t`Tim`}
                  error={error?.message}
                  fullWidth
                />
              )}
            />
            <Controller
              name="lastName"
              control={control}
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
              }) => (
                <TextInput
                  label={t`Last Name`}
                  value={value}
                  onFocus={() => setIsEditingMode(true)}
                  onBlur={() => {
                    onBlur();
                    setIsEditingMode(false);
                  }}
                  onChange={onChange}
                  placeholder={t`Cook`}
                  error={error?.message}
                  fullWidth
                />
              )}
            />
          </StyledComboInputContainer>
        </StyledSectionContainer>
      </StyledContentContainer>
      <StyledButtonContainer>
        <MainButton
          title={t`Continue`}
          onClick={handleSubmit(onSubmit)}
          disabled={!isValid || isSubmitting}
          fullWidth
        />
      </StyledButtonContainer>
    </FuseAuthLayout>
  );
};
