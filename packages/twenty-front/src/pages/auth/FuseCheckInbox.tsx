import { FuseAuthLayout } from '@/auth/components/FuseAuthLayout';
import { FuseOnboardingPreview } from '@/auth/components/FuseOnboardingPreview';
import { FooterNote } from '@/auth/sign-in-up/components/FooterNote';
import { useAuth } from '@/auth/hooks/useAuth';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { styled } from '@linaria/react';
import { useLingui } from '@lingui/react/macro';
import { themeCssVariables } from 'twenty-ui/theme-constants';
import { useCallback, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { TextInput } from '@/ui/input/components/TextInput';
import { MainButton } from 'twenty-ui/input';
import { IconMail } from 'twenty-ui/display';

const StyledFormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[4]};
  width: 100%;
`;

const StyledDescription = styled.p`
  color: ${themeCssVariables.font.color.tertiary};
  font-size: ${themeCssVariables.font.size.sm};
  margin: 0;
  margin-bottom: ${themeCssVariables.spacing[4]};
  line-height: 1.5;
`;

const StyledBottomLinks = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  gap: ${themeCssVariables.spacing[2]};
  justify-content: center;
  margin-top: ${themeCssVariables.spacing[4]};
`;

const StyledLinkButton = styled.button`
  background: none;
  border: none;
  font-family: ${themeCssVariables.font.family};
  font-size: ${themeCssVariables.font.size.xs};
  font-weight: ${themeCssVariables.font.weight.regular};
  color: ${themeCssVariables.font.color.tertiary};
  cursor: pointer;
  padding: 0;

  &:hover {
    color: ${themeCssVariables.font.color.secondary};
  }
`;

export const FuseCheckInbox = () => {
  const { t } = useLingui();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') ?? '';
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { enqueueErrorSnackBar } = useSnackBar();

  const { signInWithCredentials } = useAuth();

  const handleSubmit = useCallback(async () => {
    if (!password.trim()) {
      setError(t`Please enter your temporary password`);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await signInWithCredentials(email.toLowerCase().trim(), password);
    } catch {
      setError(t`Invalid password. Please check your email and try again.`);
      enqueueErrorSnackBar({
        message: t`Authentication failed`,
      });
    } finally {
      setIsLoading(false);
    }
  }, [email, password, signInWithCredentials, enqueueErrorSnackBar, t]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <FuseAuthLayout
      title={t`Check your inbox!`}
      subtitle={t`We sent a temporary password to ${email}`}
      footer={<FooterNote />}
      previewContent={<FuseOnboardingPreview variant="welcome" />}
    >
      <StyledFormContainer>
        <StyledDescription>
          {t`Enter the temporary password from your email to continue.`}
        </StyledDescription>
        <TextInput
          label={t`Temporary password`}
          value={password}
          onChange={setPassword}
          onKeyDown={handleKeyDown}
          placeholder={t`Enter password from email`}
          error={error ?? undefined}
          fullWidth
          autoFocus
          type="password"
          RightIcon={IconMail}
        />
        <MainButton
          title={isLoading ? t`Signing in...` : t`Continue`}
          onClick={handleSubmit}
          disabled={isLoading || !password.trim()}
          fullWidth
        />
        <StyledBottomLinks>
          <StyledLinkButton>
            {t`Didn't receive an email? Check spam or try again.`}
          </StyledLinkButton>
        </StyledBottomLinks>
      </StyledFormContainer>
    </FuseAuthLayout>
  );
};
