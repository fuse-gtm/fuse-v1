import * as RadixDialog from '@radix-ui/react-dialog';

import { RootStackingContextZIndices } from '@/ui/layout/constants/RootStackingContextZIndices';
import { ModalComponentInstanceContext } from '@/ui/layout/modal/contexts/ModalComponentInstanceContext';
import { useModalContainer } from '@/ui/layout/modal/contexts/ModalContainerContext';
import { isModalOpenedComponentState } from '@/ui/layout/modal/states/isModalOpenedComponentState';

import { useModal } from '@/ui/layout/modal/hooks/useModal';
import { useIsMobile } from '@/ui/utilities/responsive/hooks/useIsMobile';
import { useAtomComponentStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomComponentStateValue';
import { styled } from '@linaria/react';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useContext, useRef } from 'react';
import { isDefined } from 'twenty-shared/utils';
import { themeCssVariables } from 'twenty-ui/theme-constants';
import { ThemeContext } from 'twenty-ui/theme';

const StyledModalDivBase = styled.div<{
  size?: ModalSize;
  padding?: ModalPadding;
  isMobile: boolean;
  modalVariant: ModalVariants;
}>`
  display: flex;
  flex-direction: column;
  box-shadow: ${({ modalVariant }) =>
    modalVariant === 'primary'
      ? themeCssVariables.boxShadow.superHeavy
      : modalVariant === 'transparent'
        ? 'none'
        : themeCssVariables.boxShadow.strong};
  background: ${({ modalVariant }) =>
    modalVariant === 'transparent'
      ? 'transparent'
      : themeCssVariables.background.primary};
  color: ${themeCssVariables.font.color.primary};
  border-radius: ${({ isMobile, modalVariant }) => {
    if (isMobile || modalVariant === 'transparent') return `0`;
    return themeCssVariables.border.radius.md;
  }};
  overflow-x: hidden;
  overflow-y: auto;
  z-index: ${RootStackingContextZIndices.RootModal}; // should be higher than Backdrop's z-index

  width: ${({ isMobile, size }) => {
    if (isMobile)
      return themeCssVariables.modal.size.fullscreen.width ?? 'auto';
    switch (size) {
      case 'small':
        return themeCssVariables.modal.size.sm.width ?? 'auto';
      case 'medium':
        return themeCssVariables.modal.size.md.width ?? 'auto';
      case 'large':
        return themeCssVariables.modal.size.lg.width ?? 'auto';
      case 'extraLarge':
        return themeCssVariables.modal.size.xl.width ?? 'auto';
      default:
        return 'auto';
    }
  }};

  padding: ${({ padding }) => {
    switch (padding) {
      case 'none':
        return themeCssVariables.spacing[0];
      case 'small':
        return themeCssVariables.spacing[2];
      case 'medium':
        return themeCssVariables.spacing[4];
      case 'large':
        return themeCssVariables.spacing[6];
      default:
        return 'auto';
    }
  }};
  height: ${({ isMobile, size }) => {
    if (isMobile)
      return themeCssVariables.modal.size.fullscreen.height ?? 'auto';

    switch (size) {
      case 'extraLarge':
        return themeCssVariables.modal.size.xl.height ?? 'auto';
      default:
        return 'auto';
    }
  }};
  max-height: ${({ isMobile }) => (isMobile ? 'none' : '90dvh')};
`;
const StyledModalDiv = motion.create(StyledModalDivBase);

const StyledHeader = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  height: 60px;
  overflow: hidden;
  padding: ${themeCssVariables.spacing[5]};
`;

const StyledContent = styled.div<{
  isVerticalCentered?: boolean;
  isHorizontalCentered?: boolean;
}>`
  display: flex;
  flex: 1;
  flex: 1 1 0%;
  flex-direction: column;
  padding: ${themeCssVariables.spacing[10]};
  align-items: ${({ isVerticalCentered }) =>
    isVerticalCentered ? 'center' : 'stretch'};
  justify-content: ${({ isHorizontalCentered }) =>
    isHorizontalCentered ? 'center' : 'flex-start'};
`;

const StyledFooter = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  height: 60px;
  overflow: hidden;
  padding: ${themeCssVariables.spacing[5]};
`;

const StyledBackDropBase = styled.div<{
  modalVariant: ModalVariants;
  isInContainer?: boolean;
}>`
  align-items: center;
  background: ${({ modalVariant, isInContainer }) =>
    isInContainer
      ? themeCssVariables.background.overlayTertiary
      : modalVariant === 'primary' || modalVariant === 'transparent'
        ? themeCssVariables.background.overlayPrimary
        : modalVariant === 'secondary'
          ? themeCssVariables.background.overlaySecondary
          : themeCssVariables.background.overlayTertiary};
  display: flex;
  height: 100%;
  justify-content: center;
  left: 0;
  pointer-events: auto;
  position: ${({ isInContainer }) => (isInContainer ? 'absolute' : 'fixed')};
  top: 0;
  width: 100%;
  z-index: ${RootStackingContextZIndices.RootModalBackDrop};
  user-select: none;
`;
const StyledBackDrop = motion.create(StyledBackDropBase);

type ModalHeaderProps = React.PropsWithChildren & {
  className?: string;
};

const ModalHeader = ({ children, className }: ModalHeaderProps) => (
  <StyledHeader className={className}>{children}</StyledHeader>
);

type ModalContentProps = React.PropsWithChildren & {
  className?: string;
  isVerticalCentered?: boolean;
  isHorizontalCentered?: boolean;
};

const ModalContent = ({
  children,
  className,
  isVerticalCentered,
  isHorizontalCentered,
}: ModalContentProps) => (
  <StyledContent
    className={className}
    isVerticalCentered={isVerticalCentered}
    isHorizontalCentered={isHorizontalCentered}
  >
    {children}
  </StyledContent>
);
type ModalFooterProps = React.PropsWithChildren & {
  className?: string;
};

const ModalFooter = ({ children, className }: ModalFooterProps) => (
  <StyledFooter className={className}>{children}</StyledFooter>
);

export type ModalSize = 'small' | 'medium' | 'large' | 'extraLarge';
export type ModalPadding = 'none' | 'small' | 'medium' | 'large';
export type ModalVariants =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'transparent';

export type ModalProps = React.PropsWithChildren & {
  modalId: string;
  size?: ModalSize;
  padding?: ModalPadding;
  className?: string;
  onEnter?: () => void;
  modalVariant?: ModalVariants;
  dataGloballyPreventClickOutside?: boolean;
  shouldCloseModalOnClickOutsideOrEscape?: boolean;
  ignoreContainer?: boolean;
} & (
    | { isClosable: true; onClose?: () => void }
    | { isClosable?: false; onClose?: never }
  );

const modalAnimation = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

export const Modal = ({
  modalId,
  children,
  size = 'medium',
  padding = 'medium',
  className,
  onEnter,
  isClosable = false,
  onClose,
  modalVariant = 'primary',
  dataGloballyPreventClickOutside = false,
  shouldCloseModalOnClickOutsideOrEscape = true,
  ignoreContainer = false,
}: ModalProps) => {
  const isMobile = useIsMobile();
  const modalRef = useRef<HTMLDivElement>(null);
  const { container } = useModalContainer();
  const effectiveContainer = ignoreContainer
    ? isDefined(document)
      ? document.body
      : null
    : container;
  const isInContainer = isDefined(container) && !ignoreContainer;

  const { theme } = useContext(ThemeContext);

  const isModalOpened = useAtomComponentStateValue(
    isModalOpenedComponentState,
    modalId,
  );

  const { closeModal } = useModal();

  const handleClose = () => {
    onClose?.();
    if (shouldCloseModalOnClickOutsideOrEscape) closeModal(modalId);
  };

  // Handle Enter key on the modal content
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && isDefined(onEnter)) {
      onEnter();
    }
  };

  // Radix Dialog handles focus trap, Escape, and click-outside natively.
  // We bridge the Jotai atom state to Radix's open prop,
  // and use onOpenChange to sync dismissal back to Jotai.
  return (
    <RadixDialog.Root
      open={isModalOpened}
      onOpenChange={(open) => {
        if (!open && isClosable) {
          handleClose();
        }
      }}
    >
      <AnimatePresence mode="wait">
        {isModalOpened && (
          <RadixDialog.Portal
            container={effectiveContainer ?? undefined}
            forceMount
          >
            <ModalComponentInstanceContext.Provider
              value={{
                instanceId: modalId,
              }}
            >
              <RadixDialog.Overlay asChild>
                <StyledBackDrop
                  data-testid="modal-backdrop"
                  modalVariant={modalVariant}
                  isInContainer={isInContainer}
                >
                  <RadixDialog.Content
                    asChild
                    // Preserve existing focus behavior during transition
                    onOpenAutoFocus={(e) => e.preventDefault()}
                    onCloseAutoFocus={(e) => e.preventDefault()}
                    // Disable Radix's built-in Escape/click-outside when not closable
                    onEscapeKeyDown={(e) => {
                      if (!isClosable) e.preventDefault();
                    }}
                    onPointerDownOutside={(e) => {
                      if (!isClosable || dataGloballyPreventClickOutside) {
                        e.preventDefault();
                      }
                    }}
                    onInteractOutside={(e) => {
                      if (
                        !shouldCloseModalOnClickOutsideOrEscape ||
                        !isClosable
                      ) {
                        e.preventDefault();
                      }
                    }}
                  >
                    <StyledModalDiv
                      ref={modalRef}
                      size={size}
                      padding={padding}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      layout
                      modalVariant={modalVariant}
                      variants={modalAnimation}
                      transition={{
                        duration: theme.animation.duration.normal,
                      }}
                      className={className}
                      isMobile={isMobile}
                      onKeyDown={handleKeyDown}
                      data-globally-prevent-click-outside={
                        dataGloballyPreventClickOutside
                      }
                    >
                      {/* Visually hidden title for screen readers */}
                      <RadixDialog.Title className="sr-only">
                        Modal
                      </RadixDialog.Title>
                      {children}
                    </StyledModalDiv>
                  </RadixDialog.Content>
                </StyledBackDrop>
              </RadixDialog.Overlay>
            </ModalComponentInstanceContext.Provider>
          </RadixDialog.Portal>
        )}
      </AnimatePresence>
    </RadixDialog.Root>
  );
};

Modal.Header = ModalHeader;
Modal.Content = ModalContent;
Modal.Footer = ModalFooter;
Modal.Backdrop = StyledBackDrop;
