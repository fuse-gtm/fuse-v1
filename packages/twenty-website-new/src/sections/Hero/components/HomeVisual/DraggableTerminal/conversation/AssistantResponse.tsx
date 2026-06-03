'use client';

import { styled } from '@linaria/react';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { TERMINAL_TOKENS } from '../terminalTokens';
import { CHAT_TIMINGS } from './animationTiming';
import { ChangesSummaryCard } from './ChangesSummaryCard';
import { StreamingText, type StreamingSegment } from './StreamingText';
import { ThinkingIndicator } from './ThinkingIndicator';

// Delay between one paragraph finishing its stream and the next starting —
// gives the reader a beat before new text appears.
const BETWEEN_PARAGRAPHS_MS = 320;
// Extra breath after each object paragraph, so the sidebar pop-in has a
// moment to settle before the next object's paragraph begins streaming.
const AFTER_OBJECT_BEAT_MS = 520;
// Delay before the diff card slides in after the prose is done.
const BEFORE_CARD_MS = 420;
// Delay after the card lands before we signal the chat is finished.
const AFTER_CARD_REVEAL_MS = 180;

const ResponseRoot = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 100%;
`;

const Paragraph = styled.p`
  color: ${TERMINAL_TOKENS.text.prompt};
  font-family: ${TERMINAL_TOKENS.font.ui};
  font-size: 13px;
  line-height: 20px;
  margin: 0;
`;

const InlineCode = styled.span`
  background: rgba(0, 0, 0, 0.045);
  border-radius: 3px;
  color: rgba(0, 0, 0, 0.78);
  font-family: ${TERMINAL_TOKENS.font.mono};
  font-size: 12px;
  padding: 1px 5px;
`;

const CardWrap = styled.div<{ $instant: boolean }>`
  animation: ${({ $instant }) =>
    $instant
      ? 'none'
      : 'chatCardRise 420ms cubic-bezier(0.22, 1, 0.36, 1) both'};

  @keyframes chatCardRise {
    from {
      opacity: 0;
      transform: translateY(6px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

// -- Paragraph segment builders --

const text = (value: string, onReveal?: () => void): StreamingSegment => ({
  kind: 'text',
  value,
  onReveal,
});
const node = (
  key: string,
  value: ReactNode,
  onReveal?: () => void,
): StreamingSegment => ({
  kind: 'node',
  value: <span key={key}>{value}</span>,
  onReveal,
});

// Sidebar ids mirror the ones in rocketObject.ts; keep in sync.
const ROCKET_ID = 'rockets';
const LAUNCH_ID = 'launches';
const PAYLOAD_ID = 'payloads';
// Customers re-use the standard Companies object — the chat highlights the
// existing Companies sidebar item instead of creating a new Customer object.
const COMPANIES_ID = 'companies';
const LAUNCH_SITE_ID = 'launch-sites';

const buildIntroAndRocketParagraph = (
  onObjectCreated?: (id: string) => void,
): StreamingSegment[] => [
  text('I found a focused partner universe from your prompt. First view: '),
  node(
    'rocket-chip',
    <InlineCode>Company</InlineCode>,
    onObjectCreated ? () => onObjectCreated(ROCKET_ID) : undefined,
  ),
  text(
    '. It ranks companies by market fit, shared accounts, ecosystem motion, recent signal, and a suggested next move.',
  ),
];

const buildLaunchParagraph = (
  onObjectCreated?: (id: string) => void,
): StreamingSegment[] => [
  text('Next up: '),
  node(
    'launch-chip',
    <InlineCode>Person</InlineCode>,
    onObjectCreated ? () => onObjectCreated(LAUNCH_ID) : undefined,
  ),
  text(
    '. This finds operators, agencies, creators, and channel people with the right audience context and a credible path into the account.',
  ),
];

const buildPayloadParagraph = (
  onObjectCreated?: (id: string) => void,
): StreamingSegment[] => [
  text('Now '),
  node(
    'payload-chip',
    <InlineCode>Fit scoring</InlineCode>,
    onObjectCreated ? () => onObjectCreated(PAYLOAD_ID) : undefined,
  ),
  text(
    '. Fuse keeps the score explainable: why this partner, why now, what evidence supports it, and what would make the score change.',
  ),
];

const buildCustomerParagraph = (
  onObjectCreated?: (id: string) => void,
): StreamingSegment[] => [
  text('For engagement, the result connects to a practical '),
  node(
    'customer-chip',
    <InlineCode>Next move</InlineCode>,
    onObjectCreated ? () => onObjectCreated(COMPANIES_ID) : undefined,
  ),
  text(
    ': intro path, pilot ask, co-marketing angle, or research note. No fake proof, no integration claim, no generic outreach.',
  ),
];

const buildLaunchSiteParagraph = (
  onObjectCreated?: (id: string) => void,
): StreamingSegment[] => [
  text('Last view: '),
  node(
    'launch-site-chip',
    <InlineCode>Evidence trail</InlineCode>,
    onObjectCreated ? () => onObjectCreated(LAUNCH_SITE_ID) : undefined,
  ),
  text(
    '. The recommendation keeps source pages, people, category fit, timing, and notes attached so a teammate can trust the ranking.',
  ),
];

const PINNED_ACTIONS_PARAGRAPH: StreamingSegment[] = [
  text(
    'The app preview now has the two top-level modes requested in the prompt box. ',
  ),
  node('pa-rocket', <InlineCode>Company</InlineCode>),
  text(' and '),
  node('pa-launch', <InlineCode>Person</InlineCode>),
  text(' switch the app table between cached result sets. '),
  node('pa-payload', <InlineCode>Score</InlineCode>),
  text(' and '),
  node('pa-p-book', <InlineCode>Engage</InlineCode>),
  text(' keep the workflow tied to the selected partner.'),
];

const WRAPUP_PARAGRAPH: StreamingSegment[] = [
  text(
    'The landing page can show this immediately because the demo is cached. Live discovery belongs inside the app experience, not public first paint.',
  ),
];

type Stage =
  | 'thinking'
  | 'rocket'
  | 'launch'
  | 'payload'
  | 'customer'
  | 'launchSite'
  | 'actions'
  | 'wrapup'
  | 'card'
  | 'done';

const STAGE_ORDER: Stage[] = [
  'thinking',
  'rocket',
  'launch',
  'payload',
  'customer',
  'launchSite',
  'actions',
  'wrapup',
  'card',
  'done',
];

// Progressive renderer: advances to the next stage once the previous one
// signals completion (via StreamingText's `onComplete`). Every transition
// flows through setTimeout so it's trivial to retime via the constants at the
// top of the file. Each object sentence is its own stage so the sidebar pop-in
// has room to breathe before the next object is mentioned.
type AssistantResponseProps = {
  instantComplete?: boolean;
  onUndo?: () => void;
  onObjectCreated?: (id: string) => void;
  onChatFinished?: () => void;
};

export const AssistantResponse = ({
  instantComplete = false,
  onUndo,
  onObjectCreated,
  onChatFinished,
}: AssistantResponseProps) => {
  const [stage, setStage] = useState<Stage>(
    instantComplete ? 'done' : 'thinking',
  );
  const hasNotifiedChatFinishedRef = useRef(false);
  const advanceTimeoutsRef = useRef<Set<number>>(new Set());
  const objectCreationHandler = undefined;

  useEffect(() => {
    const timeouts = advanceTimeoutsRef.current;
    return () => {
      timeouts.forEach((id) => window.clearTimeout(id));
      timeouts.clear();
    };
  }, []);

  // Segments are rebuilt whenever the caller's onObjectCreated identity
  // changes so each object chip's onReveal is wired to the latest handler.
  // HomeVisual memoizes the handler with useCallback, so segments stay stable
  // during streaming and StreamingText doesn't reset mid-reveal.
  const rocketParagraph = useMemo(
    () => buildIntroAndRocketParagraph(objectCreationHandler),
    [objectCreationHandler],
  );
  const launchParagraph = useMemo(
    () => buildLaunchParagraph(objectCreationHandler),
    [objectCreationHandler],
  );
  const payloadParagraph = useMemo(
    () => buildPayloadParagraph(objectCreationHandler),
    [objectCreationHandler],
  );
  const customerParagraph = useMemo(
    () => buildCustomerParagraph(objectCreationHandler),
    [objectCreationHandler],
  );
  const launchSiteParagraph = useMemo(
    () => buildLaunchSiteParagraph(objectCreationHandler),
    [objectCreationHandler],
  );

  useEffect(() => {
    if (instantComplete) {
      return undefined;
    }
    const id = window.setTimeout(
      () => setStage('rocket'),
      CHAT_TIMINGS.thinkingMs,
    );
    return () => window.clearTimeout(id);
  }, [instantComplete]);

  useEffect(() => {
    if (!instantComplete) {
      return;
    }
    setStage('done');
  }, [instantComplete]);

  useEffect(() => {
    if (
      (stage !== 'card' && stage !== 'done') ||
      hasNotifiedChatFinishedRef.current
    ) {
      return undefined;
    }
    hasNotifiedChatFinishedRef.current = true;
    const id = window.setTimeout(
      () => {
        onChatFinished?.();
      },
      stage === 'done' ? 0 : AFTER_CARD_REVEAL_MS,
    );
    return () => window.clearTimeout(id);
  }, [stage, onChatFinished]);

  const advanceTo = useCallback(
    (next: Stage, delayMs: number) => () => {
      const id = window.setTimeout(() => {
        advanceTimeoutsRef.current.delete(id);
        setStage(next);
      }, delayMs);
      advanceTimeoutsRef.current.add(id);
    },
    [],
  );

  const has = (target: Stage): boolean =>
    STAGE_ORDER.indexOf(stage) >= STAGE_ORDER.indexOf(target);

  return (
    <ResponseRoot>
      {stage === 'thinking' && <ThinkingIndicator />}

      {has('rocket') && (
        <Paragraph>
          <StreamingText
            charDurationMs={CHAT_TIMINGS.textStreamCharMs}
            instant={instantComplete}
            onComplete={
              stage === 'rocket'
                ? advanceTo('launch', AFTER_OBJECT_BEAT_MS)
                : undefined
            }
            segments={rocketParagraph}
          />
        </Paragraph>
      )}

      {has('launch') && (
        <Paragraph>
          <StreamingText
            charDurationMs={CHAT_TIMINGS.textStreamCharMs}
            instant={instantComplete}
            onComplete={
              stage === 'launch'
                ? advanceTo('payload', AFTER_OBJECT_BEAT_MS)
                : undefined
            }
            segments={launchParagraph}
          />
        </Paragraph>
      )}

      {has('payload') && (
        <Paragraph>
          <StreamingText
            charDurationMs={CHAT_TIMINGS.textStreamCharMs}
            instant={instantComplete}
            onComplete={
              stage === 'payload'
                ? advanceTo('customer', AFTER_OBJECT_BEAT_MS)
                : undefined
            }
            segments={payloadParagraph}
          />
        </Paragraph>
      )}

      {has('customer') && (
        <Paragraph>
          <StreamingText
            charDurationMs={CHAT_TIMINGS.textStreamCharMs}
            instant={instantComplete}
            onComplete={
              stage === 'customer'
                ? advanceTo('launchSite', AFTER_OBJECT_BEAT_MS)
                : undefined
            }
            segments={customerParagraph}
          />
        </Paragraph>
      )}

      {has('launchSite') && (
        <Paragraph>
          <StreamingText
            charDurationMs={CHAT_TIMINGS.textStreamCharMs}
            instant={instantComplete}
            onComplete={
              stage === 'launchSite'
                ? advanceTo('actions', BETWEEN_PARAGRAPHS_MS)
                : undefined
            }
            segments={launchSiteParagraph}
          />
        </Paragraph>
      )}

      {has('actions') && (
        <Paragraph>
          <StreamingText
            charDurationMs={CHAT_TIMINGS.textStreamCharMs}
            instant={instantComplete}
            onComplete={
              stage === 'actions'
                ? advanceTo('wrapup', BETWEEN_PARAGRAPHS_MS)
                : undefined
            }
            segments={PINNED_ACTIONS_PARAGRAPH}
          />
        </Paragraph>
      )}

      {has('wrapup') && (
        <Paragraph>
          <StreamingText
            charDurationMs={CHAT_TIMINGS.textStreamCharMs}
            instant={instantComplete}
            onComplete={
              stage === 'wrapup' ? advanceTo('card', BEFORE_CARD_MS) : undefined
            }
            segments={WRAPUP_PARAGRAPH}
          />
        </Paragraph>
      )}

      {has('card') && (
        <CardWrap $instant={instantComplete}>
          <ChangesSummaryCard onUndo={onUndo} />
        </CardWrap>
      )}
    </ResponseRoot>
  );
};
