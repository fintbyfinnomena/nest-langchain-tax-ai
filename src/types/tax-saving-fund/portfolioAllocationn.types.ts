import { RiskLevel, TaxSavingFundType } from './enum.prompts';

export type ComboAllocationInput = {
  ageAbove45: boolean;
  annualIncome: number;
  alternativeRetirementFund: number; // กองทุนสำรองเลี้ยงชีพ, กองทุนสงเคราะห์ครูฯ
  govPensionFund: number; // กบข.
  nationalSavingFund: number; // กองทุนการออมแห่งชาติ
  pensionInsurance: number; // ประกันบำนาญ
  riskLevel: RiskLevel;
  desiredAmount?: number;
};

export type FundAllocation = {
  type: TaxSavingFundType;
  risk: RiskLevel;
  fund: string;
  proportion: number;
  amount: number;
};

export type FundTypeAllocation = {
  type: TaxSavingFundType;
  risk: RiskLevel;
  amount: number;
  description: string;
  funds: FundAllocation[];
};

export type ComboAllocation = {
  allocation: FundTypeAllocation[];
  note: string;
};

export type MaximumAllowAmountEachType = {
  tesg: number;
  ssf: number;
  rmf: number;
  ssfAndRmf: number;
  all: number;
};

export type ModelFundAllocation = {
  type: TaxSavingFundType;
  risk: RiskLevel;
  fund: string;
  proportion: number;
};
