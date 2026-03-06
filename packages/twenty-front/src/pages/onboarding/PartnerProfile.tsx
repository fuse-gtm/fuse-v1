import { styled } from '@linaria/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { z } from 'zod';

import { OnboardingProgressBar } from '@/auth/components/OnboardingProgressBar';
import { SubTitle } from '@/auth/components/SubTitle';
import { Title } from '@/auth/components/Title';
import { currentWorkspaceMemberState } from '@/auth/states/currentWorkspaceMemberState';
import { CoreObjectNameSingular } from '@/object-metadata/types/CoreObjectNameSingular';
import { useUpdateOneRecord } from '@/object-record/hooks/useUpdateOneRecord';
import { useSetNextOnboardingStatus } from '@/onboarding/hooks/useSetNextOnboardingStatus';
import { Modal } from '@/ui/layout/modal/components/Modal';
import { useMutation } from '@apollo/client';
import { t } from '@lingui/core/macro';
import { Trans } from '@lingui/react/macro';
import { isDefined } from 'twenty-shared/utils';
import {
  Checkbox,
  CheckboxShape,
  LightButton,
  MainButton,
  Toggle,
} from 'twenty-ui/input';
import { TextInput } from '@/ui/input/components/TextInput';
import { themeCssVariables } from 'twenty-ui/theme-constants';
import { SKIP_PARTNER_PROFILE_ONBOARDING_STEP } from '@/onboarding/graphql/mutations/skipPartnerProfileOnboardingStep';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { IconCheck } from 'twenty-ui/display';

const TOTAL_SUB_STEPS = 4;

// Partnership context options
const PARTNER_CONTEXT_OPTIONS = [
  {
    id: 'technology_integrations',
    label: 'Technology Integrations',
    description: 'Build and manage tech partnerships',
  },
  {
    id: 'channel_reseller',
    label: 'Channel / Reseller',
    description: 'Scale through distribution partners',
  },
  {
    id: 'cosell_comarketing',
    label: 'Co-Sell / Co-Marketing',
    description: 'Joint go-to-market motions',
  },
  {
    id: 'strategic_alliances',
    label: 'Strategic Alliances',
    description: 'High-touch executive partnerships',
  },
  {
    id: 'affiliate_referral',
    label: 'Affiliate / Referral',
    description: 'Commission-based partner programs',
  },
] as const;

// Track recommendations mapped from context selections
const TRACK_CONFIG: Record<
  string,
  { id: string; name: string; description: string; views: string[] }
> = {
  technology_integrations: {
    id: 'integration_partners',
    name: 'Integration Partners',
    description: 'Track and manage technology partnerships',
    views: ['Partner Profiles', 'Integration Status'],
  },
  channel_reseller: {
    id: 'channel_partners',
    name: 'Channel Partners',
    description: 'Manage reseller pipeline and deal registration',
    views: ['Reseller Pipeline', 'Deal Registration'],
  },
  cosell_comarketing: {
    id: 'cosell_partners',
    name: 'Co-Sell Partners',
    description: 'Coordinate joint opportunities and campaigns',
    views: ['Joint Opportunities', 'Campaign Tracker'],
  },
  strategic_alliances: {
    id: 'strategic_partners',
    name: 'Strategic Partners',
    description: 'High-touch partnerships with executive sponsors',
    views: ['Executive Sponsors', 'QBR Tracker'],
  },
  affiliate_referral: {
    id: 'referral_partners',
    name: 'Referral Partners',
    description: 'Commission-based referral tracking',
    views: ['Referral Leads', 'Commission Tracker'],
  },
};

// Styled components
const StyledContentContainer = styled.div`
  width: 100%;
`;

const StyledButtonRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: ${themeCssVariables.spacing[8]};
  width: 100%;
`;

const StyledHelperText = styled.p`
  font-size: ${themeCssVariables.font.size.xs};
  color: ${themeCssVariables.font.color.tertiary};
  margin-top: ${themeCssVariables.spacing[3]};
  text-align: center;
`;

const StyledCheckboxRow = styled.div<{ isSelected: boolean }>`
  display: flex;
  align-items: center;
  gap: ${themeCssVariables.spacing[3]};
  padding: ${themeCssVariables.spacing[3]} ${themeCssVariables.spacing[4]};
  border: 1px solid
    ${({ isSelected }) =>
      isSelected
        ? themeCssVariables.color.blue
        : themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    border-color: ${themeCssVariables.color.blue};
  }

  & + & {
    margin-top: ${themeCssVariables.spacing[2]};
  }
`;

const StyledCheckboxLabel = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const StyledCheckboxTitle = styled.span`
  font-size: ${themeCssVariables.font.size.md};
  font-weight: ${themeCssVariables.font.weight.medium};
  color: ${themeCssVariables.font.color.primary};
`;

const StyledCheckboxDescription = styled.span`
  font-size: ${themeCssVariables.font.size.sm};
  color: ${themeCssVariables.font.color.tertiary};
`;

const StyledTwoColumnLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${themeCssVariables.spacing[6]};
  width: 100%;
  margin-top: ${themeCssVariables.spacing[4]};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const StyledTrackToggle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${themeCssVariables.spacing[3]} 0;
  border-bottom: 1px solid ${themeCssVariables.border.color.light};
`;

const StyledTrackInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledTrackName = styled.span`
  font-size: ${themeCssVariables.font.size.md};
  font-weight: ${themeCssVariables.font.weight.medium};
  color: ${themeCssVariables.font.color.primary};
`;

const StyledTrackDescription = styled.span`
  font-size: ${themeCssVariables.font.size.xs};
  color: ${themeCssVariables.font.color.tertiary};
`;

const StyledDashboardPreview = styled.div`
  background: ${themeCssVariables.background.secondary};
  border-radius: ${themeCssVariables.border.radius.md};
  padding: ${themeCssVariables.spacing[4]};
  min-height: 200px;
`;

const StyledPreviewTitle = styled.div`
  font-size: ${themeCssVariables.font.size.sm};
  font-weight: ${themeCssVariables.font.weight.medium};
  color: ${themeCssVariables.font.color.secondary};
  margin-bottom: ${themeCssVariables.spacing[3]};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const StyledPreviewItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${themeCssVariables.spacing[2]};
  padding: ${themeCssVariables.spacing[2]} ${themeCssVariables.spacing[3]};
  font-size: ${themeCssVariables.font.size.sm};
  color: ${themeCssVariables.font.color.primary};
  border-radius: ${themeCssVariables.border.radius.sm};
  background: ${themeCssVariables.background.primary};
  margin-bottom: ${themeCssVariables.spacing[1]};
`;

const StyledSetupContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${themeCssVariables.spacing[4]};
  padding: ${themeCssVariables.spacing[8]} 0;
`;

const StyledSetupItem = styled.div<{ isComplete: boolean }>`
  display: flex;
  align-items: center;
  gap: ${themeCssVariables.spacing[3]};
  font-size: ${themeCssVariables.font.size.md};
  color: ${themeCssVariables.font.color.primary};
  opacity: ${({ isComplete }) => (isComplete ? 1 : 0.4)};
  transition: opacity 0.3s ease;
`;

const StyledSetupCheckmark = styled.div<{ isComplete: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ isComplete }) =>
    isComplete ? themeCssVariables.color.blue : themeCssVariables.background.quaternary};
  color: white;
  font-size: 12px;
  transition: background 0.3s ease;
`;

const StyledRoleInputContainer = styled.div`
  margin-top: ${themeCssVariables.spacing[4]};
  width: 100%;
`;

// Role validation schema
const roleValidationSchema = z.object({
  partnerRole: z.string().min(1, { message: 'Role is required' }),
});

type RoleForm = z.infer<typeof roleValidationSchema>;

export const PartnerProfile = () => {
  const [currentSubStep, setCurrentSubStep] = useState(0);
  const [partnerContext, setPartnerContext] = useState<string[]>([]);
  const [selectedTracks, setSelectedTracks] = useState<string[]>([]);
  const [setupItems, setSetupItems] = useState<boolean[]>([
    false,
    false,
    false,
  ]);
  const [setupComplete, setSetupComplete] = useState(false);

  const currentWorkspaceMember = useAtomStateValue(
    currentWorkspaceMemberState,
  );
  const setNextOnboardingStatus = useSetNextOnboardingStatus();
  const { enqueueErrorSnackBar } = useSnackBar();
  const { updateOneRecord } = useUpdateOneRecord();
  const [skipPartnerProfileMutation] = useMutation(
    SKIP_PARTNER_PROFILE_ONBOARDING_STEP,
  );

  const {
    control,
    handleSubmit,
    formState: { isValid: isRoleValid },
  } = useForm<RoleForm>({
    mode: 'onChange',
    defaultValues: { partnerRole: '' },
    resolver: zodResolver(roleValidationSchema),
  });

  // Derive recommended tracks from partner context selections
  const recommendedTracks = useMemo(
    () =>
      partnerContext
        .map((contextId) => TRACK_CONFIG[contextId])
        .filter(isDefined),
    [partnerContext],
  );

  // Initialize selected tracks when moving to step 2
  useEffect(() => {
    if (currentSubStep === 2) {
      setSelectedTracks(recommendedTracks.map((track) => track.id));
    }
  }, [currentSubStep, recommendedTracks]);

  // Setup animation for step 3
  useEffect(() => {
    if (currentSubStep !== 3) return;

    const timers = [
      setTimeout(() => setSetupItems([true, false, false]), 600),
      setTimeout(() => setSetupItems([true, true, false]), 1200),
      setTimeout(() => {
        setSetupItems([true, true, true]);
        setSetupComplete(true);
      }, 1800),
    ];

    return () => timers.forEach(clearTimeout);
  }, [currentSubStep]);

  const togglePartnerContext = (id: string) => {
    setPartnerContext((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const toggleTrack = (trackId: string) => {
    setSelectedTracks((prev) =>
      prev.includes(trackId)
        ? prev.filter((id) => id !== trackId)
        : [...prev, trackId],
    );
  };

  const handleNext = async () => {
    if (currentSubStep === 0) {
      if (partnerContext.length === 0) return;
      setCurrentSubStep(1);
      return;
    }
    if (currentSubStep === 1) {
      // Save role via form submit
      return;
    }
    if (currentSubStep === 2) {
      setCurrentSubStep(3);
      return;
    }
    if (currentSubStep === 3 && setupComplete) {
      setNextOnboardingStatus();
    }
  };

  const handleBack = () => {
    if (currentSubStep > 0) {
      setCurrentSubStep((prev) => prev - 1);
    }
  };

  const handleSkip = async () => {
    try {
      await skipPartnerProfileMutation();
      setNextOnboardingStatus();
    } catch {
      enqueueErrorSnackBar({});
    }
  };

  const onRoleSubmit: SubmitHandler<RoleForm> = useCallback(
    async (data) => {
      try {
        if (!currentWorkspaceMember?.id) {
          throw new Error('User is not logged in');
        }

        await updateOneRecord({
          objectNameSingular: CoreObjectNameSingular.WorkspaceMember,
          idToUpdate: currentWorkspaceMember.id,
          updateOneRecordInput: {
            partnerRole: data.partnerRole,
          },
        });

        setCurrentSubStep(2);
      } catch {
        enqueueErrorSnackBar({});
      }
    },
    [currentWorkspaceMember?.id, updateOneRecord, enqueueErrorSnackBar],
  );

  // Active preview views based on selected tracks
  const previewViews = useMemo(() => {
    return selectedTracks
      .map((trackId) => {
        const trackEntry = Object.values(TRACK_CONFIG).find(
          (t) => t.id === trackId,
        );
        return trackEntry ? { name: trackEntry.name, views: trackEntry.views } : null;
      })
      .filter(isDefined);
  }, [selectedTracks]);

  const canProceed =
    (currentSubStep === 0 && partnerContext.length > 0) ||
    (currentSubStep === 1 && isRoleValid) ||
    currentSubStep === 2 ||
    (currentSubStep === 3 && setupComplete);

  const subStepTitles = [
    t`What do you partner on?`,
    t`What's your role?`,
    t`Recommended partner tracks`,
    t`Setting up your partner workspace`,
  ];

  const subStepSubtitles = [
    t`This helps us calibrate your partnership workspace`,
    t`We'll use this to calibrate your partnerships experience`,
    t`Based on your focus, we suggest starting with these`,
    t`Configuring views, fields, and recommended workflows`,
  ];

  return (
    <Modal.Content isVerticalCentered isHorizontalCentered>
      <OnboardingProgressBar
        totalSteps={TOTAL_SUB_STEPS}
        currentStep={currentSubStep}
      />
      <Title noMarginTop>{subStepTitles[currentSubStep]}</Title>
      <SubTitle>{subStepSubtitles[currentSubStep]}</SubTitle>

      <StyledContentContainer>
        {/* Sub-step 0: Partnership context selection */}
        {currentSubStep === 0 && (
          <>
            {PARTNER_CONTEXT_OPTIONS.map((option) => {
              const isSelected = partnerContext.includes(option.id);
              return (
                <StyledCheckboxRow
                  key={option.id}
                  isSelected={isSelected}
                  onClick={() => togglePartnerContext(option.id)}
                >
                  <Checkbox
                    checked={isSelected}
                    shape={CheckboxShape.Squared}
                  />
                  <StyledCheckboxLabel>
                    <StyledCheckboxTitle>{option.label}</StyledCheckboxTitle>
                    <StyledCheckboxDescription>
                      {option.description}
                    </StyledCheckboxDescription>
                  </StyledCheckboxLabel>
                </StyledCheckboxRow>
              );
            })}
          </>
        )}

        {/* Sub-step 1: Role input */}
        {currentSubStep === 1 && (
          <StyledRoleInputContainer>
            <Controller
              name="partnerRole"
              control={control}
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
              }) => (
                <TextInput
                  autoFocus
                  label={t`Your role`}
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  placeholder={t`e.g. Head of Partnerships`}
                  error={error?.message}
                  fullWidth
                />
              )}
            />
            <StyledHelperText>
              <Trans>
                This will appear on your profile and in partner communications
              </Trans>
            </StyledHelperText>
          </StyledRoleInputContainer>
        )}

        {/* Sub-step 2: Track selection with preview */}
        {currentSubStep === 2 && (
          <StyledTwoColumnLayout>
            <div>
              {recommendedTracks.map((track) => {
                const isEnabled = selectedTracks.includes(track.id);
                return (
                  <StyledTrackToggle key={track.id}>
                    <StyledTrackInfo>
                      <StyledTrackName>{track.name}</StyledTrackName>
                      <StyledTrackDescription>
                        {track.description}
                      </StyledTrackDescription>
                    </StyledTrackInfo>
                    <Toggle
                      value={isEnabled}
                      onChange={() => toggleTrack(track.id)}
                    />
                  </StyledTrackToggle>
                );
              })}
            </div>
            <StyledDashboardPreview>
              <StyledPreviewTitle>
                <Trans>Your workspace views</Trans>
              </StyledPreviewTitle>
              {previewViews.map((trackPreview) =>
                trackPreview.views.map((viewName) => (
                  <StyledPreviewItem key={viewName}>
                    {viewName}
                  </StyledPreviewItem>
                )),
              )}
              {previewViews.length === 0 && (
                <StyledCheckboxDescription>
                  <Trans>Toggle tracks to see your workspace preview</Trans>
                </StyledCheckboxDescription>
              )}
            </StyledDashboardPreview>
          </StyledTwoColumnLayout>
        )}

        {/* Sub-step 3: Setup animation */}
        {currentSubStep === 3 && (
          <StyledSetupContainer>
            <StyledSetupItem isComplete={setupItems[0]}>
              <StyledSetupCheckmark isComplete={setupItems[0]}>
                {setupItems[0] && <IconCheck size={12} />}
              </StyledSetupCheckmark>
              <Trans>Partner tracks configured</Trans>
            </StyledSetupItem>
            <StyledSetupItem isComplete={setupItems[1]}>
              <StyledSetupCheckmark isComplete={setupItems[1]}>
                {setupItems[1] && <IconCheck size={12} />}
              </StyledSetupCheckmark>
              <Trans>Custom views created</Trans>
            </StyledSetupItem>
            <StyledSetupItem isComplete={setupItems[2]}>
              <StyledSetupCheckmark isComplete={setupItems[2]}>
                {setupItems[2] && <IconCheck size={12} />}
              </StyledSetupCheckmark>
              <Trans>Partner scoring enabled</Trans>
            </StyledSetupItem>
          </StyledSetupContainer>
        )}
      </StyledContentContainer>

      <StyledButtonRow>
        {currentSubStep > 0 && currentSubStep < 3 ? (
          <LightButton title={t`Previous`} onClick={handleBack} />
        ) : currentSubStep === 0 ? (
          <LightButton title={t`Skip`} onClick={handleSkip} />
        ) : (
          <div />
        )}
        {currentSubStep === 1 ? (
          <MainButton
            title={t`Continue`}
            onClick={handleSubmit(onRoleSubmit)}
            disabled={!canProceed}
          />
        ) : (
          <MainButton
            title={
              currentSubStep === 3
                ? t`Get started`
                : t`Continue`
            }
            onClick={handleNext}
            disabled={!canProceed}
          />
        )}
      </StyledButtonRow>

      {currentSubStep < 3 && (
        <StyledHelperText>
          <Trans>You can always change this later in Settings</Trans>
        </StyledHelperText>
      )}
    </Modal.Content>
  );
};
