import { FuseAuthLayout } from '@/auth/components/FuseAuthLayout';
import { FuseOnboardingPreview } from '@/auth/components/FuseOnboardingPreview';
import { FooterNote } from '@/auth/sign-in-up/components/FooterNote';
import { currentWorkspaceState } from '@/auth/states/currentWorkspaceState';
import { calendarBookingPageIdState } from '@/client-config/states/calendarBookingPageIdState';
import { useSetNextOnboardingStatus } from '@/onboarding/hooks/useSetNextOnboardingStatus';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { TextInput } from '@/ui/input/components/TextInput';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { useCreateWorkspaceInvitation } from '@/workspace-invitation/hooks/useCreateWorkspaceInvitation';
import { styled } from '@linaria/react';
import { Trans, useLingui } from '@lingui/react/macro';
import { themeCssVariables } from 'twenty-ui/theme-constants';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback } from 'react';
import {
  Controller,
  type SubmitHandler,
  useFieldArray,
  useForm,
} from 'react-hook-form';
import { isDefined } from 'twenty-shared/utils';
import { IconCopy, SeparatorLineText } from 'twenty-ui/display';
import { LightButton, MainButton } from 'twenty-ui/input';
import { ClickToActionLink } from 'twenty-ui/navigation';
import { z } from 'zod';
import { useCopyToClipboard } from '~/hooks/useCopyToClipboard';

const StyledEmailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[4]};
  padding: ${themeCssVariables.spacing[4]} 0;
  width: 100%;
`;

const StyledActionLinkContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const StyledButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const StyledSkipContainer = styled.div`
  margin: ${themeCssVariables.spacing[3]} 0 0;
`;

const validationSchema = z.object({
  emails: z.array(z.object({ email: z.union([z.literal(''), z.email()]) })),
});

type FormInput = z.infer<typeof validationSchema>;

export const FuseInviteTeam = () => {
  const { t } = useLingui();
  const { copyToClipboard } = useCopyToClipboard();
  const { enqueueSuccessSnackBar } = useSnackBar();
  const { sendInvitation } = useCreateWorkspaceInvitation();
  const setNextOnboardingStatus = useSetNextOnboardingStatus();
  const currentWorkspace = useAtomStateValue(currentWorkspaceState);
  const calendarBookingPageId = useAtomStateValue(calendarBookingPageIdState);
  const hasCalendarBooking = isDefined(calendarBookingPageId);

  const {
    control,
    handleSubmit,
    watch,
    formState: { isValid, isSubmitting },
  } = useForm<FormInput>({
    mode: 'onChange',
    defaultValues: {
      emails: [{ email: '' }, { email: '' }, { email: '' }],
    },
    resolver: zodResolver(validationSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'emails',
  });

  watch(({ emails }) => {
    if (!emails) {
      return;
    }
    const emailValues = emails.map((email) => email?.email);
    if (emailValues[emailValues.length - 1] !== '') {
      append({ email: '' });
    }
    if (emailValues.length > 3 && emailValues[emailValues.length - 2] === '') {
      remove(emailValues.length - 1);
    }
  });

  const getPlaceholder = (emailIndex: number) => {
    if (emailIndex === 0) {
      return 'tim@apple.com';
    }
    if (emailIndex === 1) {
      return 'phil@apple.com';
    }
    if (emailIndex === 2) {
      return 'jony@apple.com';
    }
    return 'craig@apple.com';
  };

  const copyInviteLink = () => {
    if (isDefined(currentWorkspace?.inviteHash)) {
      const inviteLink = `${window.location.origin}/invite/${currentWorkspace?.inviteHash}`;
      copyToClipboard(inviteLink, t`Link copied to clipboard`);
    }
  };

  const onSubmit: SubmitHandler<FormInput> = useCallback(
    async (data) => {
      const emails = Array.from(
        new Set(
          data.emails
            .map((emailData) => emailData.email.trim())
            .filter((email) => email.length > 0),
        ),
      );
      const result = await sendInvitation({ emails });

      if (isDefined(result.error)) {
        throw result.error;
      }
      if (emails.length > 0) {
        enqueueSuccessSnackBar({
          message: t`Invite link sent to email addresses`,
          options: {
            duration: 2000,
          },
        });
      }

      setNextOnboardingStatus();
    },
    [enqueueSuccessSnackBar, sendInvitation, setNextOnboardingStatus, t],
  );

  const handleSkip = async () => {
    await onSubmit({ emails: [] });
  };

  return (
    <FuseAuthLayout
      title={t`Invite your team`}
      subtitle={t`Get the most out of your workspace by inviting your team.`}
      stepNumber={5}
      totalSteps={5}
      footer={<FooterNote />}
      previewContent={<FuseOnboardingPreview variant="invite" />}
    >
      <StyledEmailsContainer>
        {fields.map((field, index) => (
          <Controller
            key={field.id}
            name={`emails.${index}.email`}
            control={control}
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => (
              <TextInput
                autoFocus={index === 0}
                type="email"
                value={value}
                placeholder={getPlaceholder(index)}
                onBlur={onBlur}
                error={error?.message}
                onChange={onChange}
                noErrorHelper
                fullWidth
              />
            )}
          />
        ))}
        {isDefined(currentWorkspace?.inviteHash) && (
          <>
            <SeparatorLineText>
              <Trans>or</Trans>
            </SeparatorLineText>
            <StyledActionLinkContainer>
              <LightButton
                title={t`Copy invitation link`}
                accent="tertiary"
                onClick={copyInviteLink}
                Icon={IconCopy}
              />
            </StyledActionLinkContainer>
          </>
        )}
      </StyledEmailsContainer>
      <StyledButtonContainer>
        <MainButton
          title={hasCalendarBooking ? t`Continue` : t`Finish`}
          disabled={!isValid || isSubmitting}
          onClick={handleSubmit(onSubmit)}
          fullWidth
        />
      </StyledButtonContainer>
      <StyledSkipContainer>
        <ClickToActionLink onClick={handleSkip}>
          <Trans>Skip</Trans>
        </ClickToActionLink>
      </StyledSkipContainer>
    </FuseAuthLayout>
  );
};
