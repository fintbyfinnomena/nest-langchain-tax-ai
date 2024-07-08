import { TaxSavingFundType, RiskLevel } from './enum.prompts';

export type RecommendedFund = {
  fund: string;
  type: TaxSavingFundType;
  risk: RiskLevel;
  category: string;
  fundComment: string;
};
