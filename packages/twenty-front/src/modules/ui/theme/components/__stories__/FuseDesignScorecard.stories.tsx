import { type Meta, type StoryObj } from '@storybook/react-vite';
import { type ChangeEvent, useMemo, useState } from 'react';
import { ComponentDecorator } from 'twenty-ui/testing';
import { themeCssVariables } from 'twenty-ui/theme-constants';

const DESIGN_OPTIONS = [
  { id: 'twenty-default', label: 'Twenty Default' },
  { id: 'fuse-signal', label: 'Fuse Signal (Cool)' },
  { id: 'fuse-momentum', label: 'Fuse Momentum (Warm)' },
] as const;

type DesignOptionId = (typeof DESIGN_OPTIONS)[number]['id'];

const RUBRIC_CRITERIA = [
  {
    id: 'clarity',
    label: 'First 5-minute clarity',
    prompt: 'Can a new ICP user understand where to start without help?',
    weight: 5,
  },
  {
    id: 'speed',
    label: 'Time to first value',
    prompt: 'Can the user complete one meaningful action quickly?',
    weight: 5,
  },
  {
    id: 'trust',
    label: 'Trust and seriousness',
    prompt: 'Does the UI feel reliable for critical revenue workflows?',
    weight: 4,
  },
  {
    id: 'density',
    label: 'Density without confusion',
    prompt: 'Can the user scan a lot of information with low cognitive load?',
    weight: 4,
  },
  {
    id: 'distinctiveness',
    label: 'Distinctiveness',
    prompt: 'Would this be remembered as Fuse, not generic SaaS?',
    weight: 3,
  },
] as const;

type CriterionId = (typeof RUBRIC_CRITERIA)[number]['id'];

type ScoreMap = Record<CriterionId, number>;
type ScoreMatrix = Record<DesignOptionId, ScoreMap>;

const SCORE_MIN = 1;
const SCORE_MAX = 5;
const DEFAULT_SCORE = 3;
const BLOCKING_SCORE_THRESHOLD = 3;
const STRONG_FIT_SCORE_THRESHOLD = 80;

const TOTAL_WEIGHT = RUBRIC_CRITERIA.reduce(
  (sum, criterion) => sum + criterion.weight,
  0,
);

const clampScore = (rawScore: number) =>
  Math.max(SCORE_MIN, Math.min(SCORE_MAX, rawScore));

const createInitialScores = (): ScoreMatrix => {
  const perOptionEntries = DESIGN_OPTIONS.map(({ id }) => {
    const perCriteriaEntries = RUBRIC_CRITERIA.map((criterion) => [
      criterion.id,
      DEFAULT_SCORE,
    ]);

    return [id, Object.fromEntries(perCriteriaEntries) as ScoreMap];
  });

  return Object.fromEntries(perOptionEntries) as ScoreMatrix;
};

const getWeightedScore = (scoreMap: ScoreMap) =>
  RUBRIC_CRITERIA.reduce(
    (sum, criterion) => sum + scoreMap[criterion.id] * criterion.weight,
    0,
  );

const getWeightedPercent = (weightedScore: number) =>
  (weightedScore / (TOTAL_WEIGHT * SCORE_MAX)) * 100;

const formatPercent = (value: number) => `${value.toFixed(1)}%`;

const FuseDesignScorecard = () => {
  const [scenario, setScenario] = useState(
    'Primary user: RevOps lead at a 20-200 person SaaS team evaluating a CRM migration.',
  );
  const [scoresByOption, setScoresByOption] =
    useState<ScoreMatrix>(createInitialScores);

  const weightedPercentByOption = useMemo(
    () =>
      Object.fromEntries(
        DESIGN_OPTIONS.map(({ id }) => [
          id,
          getWeightedPercent(getWeightedScore(scoresByOption[id])),
        ]),
      ) as Record<DesignOptionId, number>,
    [scoresByOption],
  );

  const rankedOptions = useMemo(
    () =>
      [...DESIGN_OPTIONS].sort(
        (left, right) =>
          weightedPercentByOption[right.id] - weightedPercentByOption[left.id],
      ),
    [weightedPercentByOption],
  );

  const leader = rankedOptions[0];
  const runnerUp = rankedOptions[1];
  const hasTie =
    Math.abs(
      weightedPercentByOption[leader.id] - weightedPercentByOption[runnerUp.id],
    ) < 0.01;
  const leaderHasBlockingCriterion = RUBRIC_CRITERIA.some(
    (criterion) =>
      scoresByOption[leader.id][criterion.id] < BLOCKING_SCORE_THRESHOLD,
  );
  const leaderIsStrongFit =
    weightedPercentByOption[leader.id] >= STRONG_FIT_SCORE_THRESHOLD;

  const updateScore = (
    optionId: DesignOptionId,
    criterionId: CriterionId,
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const parsedScore = Number.parseInt(event.target.value, 10);

    if (Number.isNaN(parsedScore)) {
      return;
    }

    const nextScore = clampScore(parsedScore);

    setScoresByOption((current) => ({
      ...current,
      [optionId]: {
        ...current[optionId],
        [criterionId]: nextScore,
      },
    }));
  };

  return (
    <section
      style={{
        maxWidth: '1120px',
        margin: '0 auto',
        padding: '24px',
        color: themeCssVariables.font.color.primary,
        fontFamily: themeCssVariables.font.family,
      }}
    >
      <h1 style={{ margin: 0, fontSize: themeCssVariables.font.size.xl, fontWeight: 600 }}>
        Fuse Design Scorecard
      </h1>
      <p style={{ marginTop: '8px', color: themeCssVariables.font.color.secondary }}>
        Score each direction from 1 to 5 on criteria that predict adoption. This
        is not a taste contest. It is a decision about who gets value fastest.
      </p>

      <label
        htmlFor="fuse-scorecard-scenario"
        style={{
          display: 'block',
          marginTop: '16px',
          marginBottom: '8px',
          fontWeight: themeCssVariables.font.weight.medium,
        }}
      >
        Scenario (be specific about the user and job-to-be-done)
      </label>
      <textarea
        id="fuse-scorecard-scenario"
        value={scenario}
        onChange={(event) => setScenario(event.target.value)}
        rows={2}
        style={{
          width: '100%',
          resize: 'vertical',
          borderRadius: themeCssVariables.border.radius.sm,
          border: `1px solid ${themeCssVariables.border.color.medium}`,
          padding: '10px 12px',
          backgroundColor: themeCssVariables.background.primary,
          color: themeCssVariables.font.color.primary,
        }}
      />

      <div style={{ marginTop: '20px', overflowX: 'auto' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            minWidth: '940px',
            backgroundColor: themeCssVariables.background.primary,
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  textAlign: 'left',
                  padding: '10px',
                  borderBottom: `1px solid ${themeCssVariables.border.color.medium}`,
                }}
              >
                Criterion
              </th>
              <th
                style={{
                  textAlign: 'left',
                  padding: '10px',
                  borderBottom: `1px solid ${themeCssVariables.border.color.medium}`,
                }}
              >
                Weight
              </th>
              {DESIGN_OPTIONS.map((option) => (
                <th
                  key={option.id}
                  style={{
                    textAlign: 'left',
                    padding: '10px',
                    borderBottom: `1px solid ${themeCssVariables.border.color.medium}`,
                  }}
                >
                  {option.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {RUBRIC_CRITERIA.map((criterion) => (
              <tr key={criterion.id}>
                <td
                  style={{
                    verticalAlign: 'top',
                    padding: '10px',
                    borderBottom: `1px solid ${themeCssVariables.border.color.light}`,
                  }}
                >
                  <div style={{ fontWeight: themeCssVariables.font.weight.medium }}>
                    {criterion.label}
                  </div>
                  <div
                    style={{
                      marginTop: '4px',
                      color: themeCssVariables.font.color.secondary,
                      fontSize: themeCssVariables.font.size.sm,
                    }}
                  >
                    {criterion.prompt}
                  </div>
                </td>
                <td
                  style={{
                    verticalAlign: 'top',
                    padding: '10px',
                    borderBottom: `1px solid ${themeCssVariables.border.color.light}`,
                    fontWeight: themeCssVariables.font.weight.medium,
                  }}
                >
                  {criterion.weight}
                </td>
                {DESIGN_OPTIONS.map((option) => {
                  const isLeading = leader.id === option.id && !hasTie;

                  return (
                    <td
                      key={`${criterion.id}-${option.id}`}
                      style={{
                        verticalAlign: 'top',
                        padding: '10px',
                        borderBottom: `1px solid ${themeCssVariables.border.color.light}`,
                        backgroundColor: isLeading
                          ? themeCssVariables.background.transparent.blue
                          : 'transparent',
                      }}
                    >
                      <input
                        type="number"
                        min={SCORE_MIN}
                        max={SCORE_MAX}
                        value={scoresByOption[option.id][criterion.id]}
                        onChange={(event) =>
                          updateScore(option.id, criterion.id, event)
                        }
                        style={{
                          width: '68px',
                          borderRadius: themeCssVariables.border.radius.sm,
                          border: `1px solid ${themeCssVariables.border.color.medium}`,
                          padding: '8px',
                          fontSize: themeCssVariables.font.size.sm,
                          color: themeCssVariables.font.color.primary,
                          backgroundColor: themeCssVariables.background.secondary,
                        }}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
            <tr>
              <td
                style={{
                  padding: '10px',
                  fontWeight: themeCssVariables.font.weight.semiBold,
                }}
              >
                Weighted score
              </td>
              <td />
              {DESIGN_OPTIONS.map((option) => {
                const isLeading = leader.id === option.id && !hasTie;

                return (
                  <td
                    key={`${option.id}-weighted-score`}
                    style={{
                      padding: '10px',
                      fontWeight: themeCssVariables.font.weight.semiBold,
                      backgroundColor: isLeading
                        ? themeCssVariables.background.transparent.blue
                        : 'transparent',
                    }}
                  >
                    {formatPercent(weightedPercentByOption[option.id])}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>

      <div
        style={{
          marginTop: '20px',
          padding: '14px 16px',
          borderRadius: themeCssVariables.border.radius.md,
          border: `1px solid ${themeCssVariables.border.color.medium}`,
          backgroundColor: themeCssVariables.background.secondary,
        }}
      >
        <div style={{ fontWeight: themeCssVariables.font.weight.semiBold }}>
          Decision signal
        </div>
        <p style={{ margin: '8px 0 0', color: themeCssVariables.font.color.secondary }}>
          {hasTie
            ? 'No winner yet. Run 3 customer sessions and score again.'
            : `Leader: ${leader.label} (${formatPercent(weightedPercentByOption[leader.id])}).`}
        </p>
        {!hasTie && leaderHasBlockingCriterion ? (
          <p style={{ margin: '6px 0 0', color: themeCssVariables.font.color.danger }}>
            Blocked: at least one criterion is below 3. Fix that before choosing
            this direction.
          </p>
        ) : null}
        {!hasTie && !leaderHasBlockingCriterion && leaderIsStrongFit ? (
          <p style={{ margin: '6px 0 0', color: themeCssVariables.font.color.secondary }}>
            Ready to ship as default if this holds in live user sessions.
          </p>
        ) : null}
        <p style={{ margin: '10px 0 0', color: themeCssVariables.font.color.secondary }}>
          Current scenario: {scenario}
        </p>
      </div>
    </section>
  );
};

const meta: Meta = {
  title: 'UI/Theme/Fuse Design Scorecard',
  decorators: [ComponentDecorator],
  render: () => <FuseDesignScorecard />,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
