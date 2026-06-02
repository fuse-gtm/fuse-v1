'use client';

import { styled } from '@linaria/react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { EDITOR_TOKENS } from './TerminalEditor/editorTokens';
import { TERMINAL_TOKENS } from './terminalTokens';
import { TerminalToggle, type TerminalToggleValue } from './TerminalToggle';
import { TerminalTrafficLights } from './TerminalTrafficLights';

type TerminalTopBarProps = {
  onDragStart: (event: ReactPointerEvent<HTMLDivElement>) => void;
  isDragging: boolean;
  onZoomTripleClick?: () => void;
  view?: TerminalToggleValue;
  onViewChange?: (value: TerminalToggleValue) => void;
};

const TopBarRoot = styled.div<{ $isDragging: boolean; $dark?: boolean }>`
  align-items: center;
  background: ${({ $dark }) =>
    $dark ? EDITOR_TOKENS.surface.topBar : 'transparent'};
  border-bottom: 1px solid
    ${({ $dark }) =>
      $dark
        ? EDITOR_TOKENS.surface.topBarBorder
        : TERMINAL_TOKENS.surface.topBarBorder};
  box-sizing: border-box;
  cursor: ${({ $isDragging }) => ($isDragging ? 'grabbing' : 'grab')};
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  height: 48px;
  padding: 0 12px;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease;
  user-select: none;
  width: 100%;
`;

const TopRight = styled.div`
  align-items: center;
  display: flex;
  justify-content: flex-end;
  min-width: 1px;
`;

export const TerminalTopBar = ({
  onDragStart,
  isDragging,
  onZoomTripleClick,
  view,
  onViewChange,
}: TerminalTopBarProps) => {
  const isDark = view === 'editor';
  return (
    <TopBarRoot
      $dark={isDark}
      $isDragging={isDragging}
      onPointerDown={onDragStart}
    >
      <TerminalTrafficLights onZoomTripleClick={onZoomTripleClick} />
      <TerminalToggle
        onChange={onViewChange}
        theme={isDark ? 'dark' : 'light'}
        value={view}
      />
      <TopRight />
    </TopBarRoot>
  );
};
