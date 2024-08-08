import { RecommendedFund } from '../../../types/tax-saving-fund/recommend.types';
import {
  TaxSavingFundType,
  RiskLevel,
} from '../../../types/tax-saving-fund/enum.prompts';
import Config from '../../../config/tax.chat.config';

export function getTaxSavingFundSuggestedList(): RecommendedFund[] {
  const singleFundRecommendedList = Config.tsf.recommendedFund;

  const result = [];
  for (const f of singleFundRecommendedList) {
    result.push({
      fund: f.fund,
      type: f.type as TaxSavingFundType,
      risk: f.risk as RiskLevel,
      category: f.category,
      fundComment: f['fund_comment'],
    });
  }

  return result;
}
