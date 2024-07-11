export type FundInfoCard = {
  info: {
    shortCode: string;
    nameTh: string;
    investmentStrategy: string;
    riskSpectrum: string;
    fundFactSheetUrl: string;
    shortDescription: string;
    categoryThName: string;
    broadCategoryThName: string;
    isFinnnoPick: boolean;
    fundTaxType: string | null;
  };
  performance: {
    return3m: number | null;
    return6m: number | null;
    return1y: number | null;
    return3y: number | null;
    return5y: number | null;
    sharpeRatio1y: number | null;
    sharpeRatio3y: number | null;
    sharpeRatio5y: number | null;
    netAsset: number | null;
  };
  fee: FundFee;
  tsfRecommendation: {
    isRecommended: boolean;
    comment: string | null;
  };
  fundQuoteLink: string;
};

export type FundFee = {
  frontEnd: string;
  backEnd: string;
  management: string;
};