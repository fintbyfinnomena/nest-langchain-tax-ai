import axios from 'axios';
import Config from '../../config/tax.chat.config';
import path from 'path';
import { FundInfoCard } from '../../types/fundInfo.types';
import { FundFilterInput } from '../../types/fundRanking.types';

export async function getFundRanking(
  input: FundFilterInput,
): Promise<FundInfoCard[]> {
  try {
    const fundsRanking = await fetchFundRankingApi(input);
    return fundsRanking as FundInfoCard[];
  } catch (error) {
    console.error(error);
  }
}

async function fetchFundRankingApi(
  input: FundFilterInput,
): Promise<FundInfoCard[]> {
  const fundApiBaseUrl = Config.fundApi.baseUrl;

  try {
    var fundRankingUrl = path.join(fundApiBaseUrl, '/filter');

    if (input.period) {
      fundRankingUrl = fundRankingUrl + `?sort=${input.period},${input.order}`;
    }
    if (input.category) {
      fundRankingUrl = fundRankingUrl + `&where[]=category,=,${input.category}`;
    }
    if (input.types) {
      for (let i = 0; i < input.types.length; i++) {
        const type = input.types[i];
        fundRankingUrl = fundRankingUrl + `&where[]=type,=,${type}`;
      }
    }

    const response = await axios.get(fundRankingUrl);
    const fundsRanking: FundInfoCard[] = response.data.data.funds;

    return fundsRanking;
  } catch (error) {
    throw error;
  }
}
