import {
  TaxSavingFundType,
  RiskLevel,
} from '../../../types/tax-saving-fund/enum.prompts';
import Config from '../../../config/tax.chat.config';

const fundRecommended = [];
for (const fund of Config.tsf.recommendedFund) {
  fundRecommended.push({
    fund: fund.fund,
    type: fund.type as TaxSavingFundType,
    risk: fund.risk as RiskLevel,
    category: fund.category,
    fundComment: fund.fund_comment,
  });
}

export async function getTaxSavingFundSuggestedList(input) {
  let tmpFundRecommended: any[] = fundRecommended.slice();
  Object.keys(input).forEach((k)=>{
    if (input[k] != "") {
      if ( input[k] != null ){
        if (k!="category"){
          tmpFundRecommended = tmpFundRecommended.filter(item => item[k].includes(input[k]))
        }else{
          tmpFundRecommended = tmpFundRecommended.filter(item => (item.category.includes(input[k])||item.fundComment.includes(input[k])))
        }
      }
    }
  })
  return tmpFundRecommended
}