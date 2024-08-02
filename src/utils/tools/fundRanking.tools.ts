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
    console.log(error);
  }
}

async function fetchFundRankingApi(
  input: FundFilterInput,
): Promise<FundInfoCard[]> {
  const fundApiBaseUrl = Config.fundApi.baseUrl;

  try {
    // Construct URLs
    var fundRankingUrl = path.join(fundApiBaseUrl, '/filter');

    if (input.sort) {
      console.log(`Sort: ${input.sort}, Order: ${input.order}`);
      fundRankingUrl = fundRankingUrl + `?sort=${input.sort},${input.order}`;
    }
    if (input.category) {
      console.log(`Category: ${input.category}`);
      fundRankingUrl = fundRankingUrl + `&where[]=category,=,${input.category}`;
    }
    if (input.type) {
      console.log(`Type: ${input.type}`);
      fundRankingUrl = fundRankingUrl + `&where[]=type,=,${input.type}`;
    }

    console.log(fundRankingUrl);

    // Make parallel requests
    const response = await axios.get(fundRankingUrl);

    const fundsRanking: FundInfoCard[] = response.data.data.funds;

    // console.log(fundsRanking);

    return fundsRanking;
  } catch (error) {
    throw error;
  }
}
