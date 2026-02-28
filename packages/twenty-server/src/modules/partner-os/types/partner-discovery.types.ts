export type PartnerCandidateEntityType = 'company' | 'person';

export type GateMode = 'signal' | 'must_pass';

export type CheckStatus = 'Match' | 'No Match' | 'Unclear';

export type GateStatus = 'qualified' | 'disqualified' | 'excluded';

export type RankingSignal = {
  id: string;
  label: string;
  prompt: string;
  weight: number;
  gateMode: GateMode;
};

export type RetrievalCheck = {
  id: string;
  prompt: string;
};

export type CheckEvaluation = {
  checkId: string;
  status: CheckStatus;
  reasoningMd?: string | null;
  sources?: string[];
};

export type CandidateScoreInput = {
  evaluations: CheckEvaluation[];
  signals: RankingSignal[];
  isExcluded: boolean;
};

export type CandidateScore = {
  fitScore: number;
  confidence: number;
  gateStatus: GateStatus;
  gateReason: string | null;
  availableWeight: number;
  totalWeight: number;
  matchedCount: number;
  contributionByCheckId: Record<string, number>;
};

export type ExaSearchCriteria = {
  description: string;
};

export type ExaSearchExclude = {
  value: string;
};

export type ExaSearchPayload = {
  query: string;
  entity: {
    type: PartnerCandidateEntityType;
  };
  criteria: ExaSearchCriteria[];
  exclude: ExaSearchExclude[];
};
