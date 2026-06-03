'use client';

import { styled } from '@linaria/react';
import {
  IconArrowBackUp,
  IconChevronDown,
  IconChevronRight,
  IconChevronUp,
} from '@tabler/icons-react';
import { useState } from 'react';
import { CHAT_TIMINGS } from './animationTiming';

const ROW_STAGGER_MS = 24;
const ROW_BASE_DELAY_MS = 40;
const COLLAPSED_RESULT_COUNT = 3;

const RESULTS = [
  {
    label: 'Northstar Cloud',
    meta: 'Technology partner',
    score: '92',
  },
  {
    label: 'Mira Kapoor',
    meta: 'Agency operator',
    score: '88',
  },
  {
    label: 'AtlasPay',
    meta: 'Marketplace partner',
    score: '87',
  },
  {
    label: 'Brightlayer',
    meta: 'Channel partner',
    score: '83',
  },
  {
    label: 'Leo Martin',
    meta: 'Creator partner',
    score: '81',
  },
] as const;

const CardRoot = styled.div`
  animation: chatCardRise ${CHAT_TIMINGS.fileCardEnterMs}ms
    cubic-bezier(0.22, 1, 0.36, 1) both;
  background: #f7f6f2;
  border: 1px solid #dad9d5;
  border-radius: 10px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
  overflow: hidden;
  width: 100%;

  @keyframes chatCardRise {
    from {
      opacity: 0;
      transform: translateY(4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const Header = styled.div`
  align-items: center;
  background: #ffffff;
  display: flex;
  gap: 8px;
  padding: 10px 14px;
`;

const HeaderTitle = styled.div`
  align-items: center;
  color: rgba(0, 0, 0, 0.72);
  display: flex;
  flex: 1 1 auto;
  font-family: 'Inter', sans-serif;
  font-size: 12.5px;
  font-weight: 500;
  gap: 6px;
`;

const Score = styled.span`
  color: rgba(0, 0, 0, 0.8);
  font-family: 'Geist Mono', ui-monospace, 'SF Mono', Menlo, monospace;
  font-size: 11px;
  font-weight: 600;
`;

const UndoButton = styled.button`
  align-items: center;
  background: transparent;
  border: none;
  border-radius: 4px;
  color: rgba(0, 0, 0, 0.55);
  cursor: pointer;
  display: inline-flex;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 500;
  gap: 3px;
  padding: 3px 6px;
  transition:
    background-color 0.14s ease,
    color 0.14s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.04);
    color: rgba(0, 0, 0, 0.8);
  }
`;

const ResultList = styled.div`
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
`;

const ResultRow = styled.div<{ $delay: string }>`
  animation: chatResultRowFade 240ms ease-out both;
  animation-delay: ${({ $delay }) => $delay};
  align-items: center;
  display: grid;
  gap: 10px;
  grid-template-columns: minmax(0, 1fr) auto auto auto;
  padding: 9px 14px;
  transition: background-color 0.14s ease;

  & + & {
    border-top: 1px solid rgba(0, 0, 0, 0.04);
  }

  &:hover {
    background: rgba(0, 0, 0, 0.02);
  }

  @keyframes chatResultRowFade {
    from {
      opacity: 0;
      transform: translateY(3px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const ResultText = styled.span`
  color: rgba(0, 0, 0, 0.78);
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 500;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ResultMeta = styled.span`
  color: rgba(0, 0, 0, 0.46);
  font-family: 'Inter', sans-serif;
  font-size: 11.5px;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Chevron = styled.span`
  align-items: center;
  color: rgba(0, 0, 0, 0.3);
  display: inline-flex;
  flex: 0 0 auto;
`;

const SeeMoreButton = styled.button`
  align-items: center;
  background: transparent;
  border: none;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  color: rgba(0, 0, 0, 0.48);
  cursor: pointer;
  display: inline-flex;
  font-family: 'Inter', sans-serif;
  font-size: 11.5px;
  font-weight: 500;
  gap: 4px;
  justify-content: flex-start;
  letter-spacing: 0.1px;
  padding: 8px 14px;
  transition: color 0.14s ease;
  width: 100%;

  &:hover {
    color: rgba(0, 0, 0, 0.72);
  }
`;

const SeeMoreChevron = styled.span`
  align-items: center;
  color: currentColor;
  display: inline-flex;
  flex: 0 0 auto;
`;

type ChangesSummaryCardProps = {
  onUndo?: () => void;
};

export const ChangesSummaryCard = ({ onUndo }: ChangesSummaryCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hiddenCount = Math.max(
    RESULTS.length - COLLAPSED_RESULT_COUNT,
    0,
  );
  const visibleResults =
    isExpanded || hiddenCount === 0
      ? RESULTS
      : RESULTS.slice(0, COLLAPSED_RESULT_COUNT);

  return (
    <CardRoot>
      <Header>
        <HeaderTitle>
          <span>{RESULTS.length} scored results</span>
        </HeaderTitle>
        <UndoButton onClick={onUndo} type="button">
          Reset
          <IconArrowBackUp size={12} stroke={2} />
        </UndoButton>
      </Header>
      <ResultList>
        {visibleResults.map((result, index) => (
          <ResultRow
            $delay={`${ROW_BASE_DELAY_MS + index * ROW_STAGGER_MS}ms`}
            key={`${result.label}-${index}`}
          >
            <ResultText>{result.label}</ResultText>
            <ResultMeta>{result.meta}</ResultMeta>
            <Score>{result.score}</Score>
            <Chevron>
              <IconChevronRight size={14} stroke={1.8} />
            </Chevron>
          </ResultRow>
        ))}
      </ResultList>
      {hiddenCount > 0 && (
        <SeeMoreButton
          onClick={() => setIsExpanded((current) => !current)}
          type="button"
        >
          <SeeMoreChevron aria-hidden>
            {isExpanded ? (
              <IconChevronUp size={12} stroke={2} />
            ) : (
              <IconChevronDown size={12} stroke={2} />
            )}
          </SeeMoreChevron>
          {isExpanded ? 'See less' : `See ${hiddenCount} more`}
        </SeeMoreButton>
      )}
    </CardRoot>
  );
};
