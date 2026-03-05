import * as RadixDialog from '@radix-ui/react-dialog';
import { styled } from '@linaria/react';
import { motion } from 'framer-motion';

import { RootStackingContextZIndices } from '@/ui/layout/constants/RootStackingContextZIndices';
import React from 'react';
import { isDefined } from 'twenty-shared/utils';
import { Button } from 'twenty-ui/input';
import { themeCssVariables } from 'twenty-ui/theme-constants';

const StyledDialogOverlayBase = styled.div`
  align-items: center;
  background: ${themeCssVariables.background.overlayPrimary};
  display: flex;
  height: 100dvh;
  justify-content: center;
  left: 0;
  position: fixed;
  top: 0;
  width: 100vw;
  z-index: ${RootStackingContextZIndices.Dialog};
`;
const StyledDialogOverlay = motion.create(StyledDialogOverlayBase);

const StyledDialogContainerBase = styled.div`
  background: ${themeCssVariables.background.primary};
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  max-width: 320px;
  padding: 2em;
  position: relative;
  width: 100%;
`;
const StyledDialogContainer = motion.create(StyledDialogContainerBase);

const StyledDialogTitle = styled.span`
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.md};
  font-weight: ${themeCssVariables.font.weight.semiBold};
  margin-bottom: ${themeCssVariables.spacing[6]};
  text-align: center;
`;

const StyledDialogMessage = styled.span`
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.sm};
  font-weight: ${themeCssVariables.font.weight.regular};
  margin-bottom: ${themeCssVariables.spacing[6]};
  text-align: center;
`;

const StyledDialogButton = styled(Button)`
  justify-content: center;
  margin-bottom: ${themeCssVariables.spacing[2]};
`;

export type DialogButtonOptions = Omit<
  React.ComponentProps<typeof Button>,
  'fullWidth'
> & {
  onClick?: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent> | KeyboardEvent,
  ) => void;
  role?: 'confirm';
};

export type DialogProps = React.ComponentPropsWithoutRef<typeof motion.div> & {
  title?: string;
  message?: string;
  buttons?: DialogButtonOptions[];
  children?: React.ReactNode;
  className?: string;
  onClose?: () => void;
};

export const Dialog = ({
  title,
  message,
  buttons = [],
  children,
  className,
  onClose,
  id,
}: DialogProps) => {
  const dialogVariants = {
    open: { opacity: 1 },
    closed: { opacity: 0 },
  };

  const containerVariants = {
    open: { y: 0 },
    closed: { y: '50vh' },
  };

  // Handle Enter key to trigger the confirm button
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      const confirmButton = buttons.find((button) => button.role === 'confirm');
      if (isDefined(confirmButton)) {
        event.preventDefault();
        confirmButton?.onClick?.(event.nativeEvent);
        onClose?.();
      }
    }
  };

  // Radix Dialog handles focus trap, Escape, and click-outside natively.
  // The Dialog is always rendered open (it's shown by the dialog manager),
  // so we use open={true} and onOpenChange to handle dismissal.
  return (
    <RadixDialog.Root
      open={true}
      onOpenChange={(open) => {
        if (!open) {
          onClose?.();
        }
      }}
    >
      <RadixDialog.Portal forceMount>
        <RadixDialog.Overlay asChild>
          <StyledDialogOverlay
            variants={dialogVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className={className}
          >
            <RadixDialog.Content
              asChild
              onOpenAutoFocus={(e) => e.preventDefault()}
              onCloseAutoFocus={(e) => e.preventDefault()}
              onKeyDown={handleKeyDown}
            >
              <StyledDialogContainer
                variants={containerVariants}
                transition={{ damping: 15, stiffness: 100 }}
                id={id}
              >
                {title && (
                  <RadixDialog.Title asChild>
                    <StyledDialogTitle>{title}</StyledDialogTitle>
                  </RadixDialog.Title>
                )}
                {message && (
                  <RadixDialog.Description asChild>
                    <StyledDialogMessage>{message}</StyledDialogMessage>
                  </RadixDialog.Description>
                )}
                {children}
                {buttons.map(
                  ({ accent, onClick, role, title: key, variant }) => (
                    <StyledDialogButton
                      onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                        onClose?.();
                        onClick?.(event);
                      }}
                      fullWidth={true}
                      variant={variant ?? 'secondary'}
                      title={key}
                      {...{ accent, key, role }}
                    />
                  ),
                )}
              </StyledDialogContainer>
            </RadixDialog.Content>
          </StyledDialogOverlay>
        </RadixDialog.Overlay>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
};
