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
    return fundsRanking;
  } catch (error) {
    console.error('Error fetching fund ranking:', error);
    throw new Error('error: fetching fund ranking');
  }
}

async function fetchFundRankingApi(
  input: FundFilterInput,
): Promise<FundInfoCard[]> {
  const fundApiBaseUrl = Config.fundApi.baseUrl;

  try {
    let fundRankingUrl = path.join(fundApiBaseUrl, '/filter');

    const queryParameters = [];

    if (input.period) {
      queryParameters.push(`sort=${input.period},${input.order}`);
    }
    if (input.category) {
      queryParameters.push(`where[]=category,=,${input.category}`);
    }
    if (input.types) {
      input.types.forEach((type) => {
        queryParameters.push(`where[]=type,=,${type}`);
      });
    }

    if (queryParameters.length > 0) {
      fundRankingUrl += '?' + queryParameters.join('&');
    }

    const response = await axios.get(fundRankingUrl);
    return response.data.data.funds;
  } catch (error) {
    console.error('Error: making fund filter api call', error);
    throw new Error('error: making fund filter api call');
  }
}
