import axios from 'axios';
import Config from '../../config/tax.chat.config';
import path from 'path';
import { FundInfoCard, FundFee } from '../../types/fundInfo.types';
import Fuse from 'fuse.js';

export async function getFundInformation(
  fundName: string,
): Promise<FundInfoCard | string> {
  const fundApiBaseUrl = Config.fundApi.baseUrl;
  const fundQuoteBaseUrl = Config.fundQuote.baseUrl;

  try {
    // Construct URLs
    const fundInfoUrl = path.join(fundApiBaseUrl, fundName);
    const fundPerformanceUrl = path.join(
      fundApiBaseUrl,
      fundName,
      'performance',
    );
    const fundFeeUrl = path.join(fundApiBaseUrl, `fee?funds[]=${fundName}`);
    const fundPortfolioUrl = path.join(fundApiBaseUrl, fundName, 'portfolio');

    // Make parallel requests
    const [
      fundInfoResponse,
      fundPerformanceResponse,
      fundFeeResponse,
      fundPortfolioResponse,
    ] = await Promise.all([
      axios.get(fundInfoUrl),
      axios.get(fundPerformanceUrl),
      axios.get(fundFeeUrl),
      axios.get(fundPortfolioUrl),
    ]);

    // TODO: To Check
    const fundInfo = fundInfoResponse.data.data;
    const fundPerf = fundPerformanceResponse.data.data;
    const fundFee = fundFeeResponse.data.data[0]['fees'];
    const fundPortfolio = fundPortfolioResponse.data.data;

    const fundFeeExtracted = extractFee(fundFee);

    const result: FundInfoCard = {
      info: {
        shortCode: fundInfo['short_code'],
        nameTh: fundInfo['name_th'],
        investmentStrategy: fundInfo['investment_strategy'],
        riskSpectrum: fundInfo['risk_spectrum'],
        fundFactSheetUrl: fundInfo['fund_fact_sheet'],
        shortDescription: fundInfo['fund_short_desc'],
        categoryThName: fundInfo['aimc_category_name_th'],
        broadCategoryThName: fundInfo['aimc_broad_category_name_th'],
        isFinnnoPick: fundInfo['is_nter_pick'],
        fundTaxType: fundInfo['fund_tax_type'],
      },
      performance: {
        return3m: fundPerf['total_return_3m'],
        return6m: fundPerf['total_return_6m'],
        return1y: fundPerf['total_return_1y'],
        return3y: fundPerf['total_return_3y'],
        return5y: fundPerf['total_return_5y'],
        sharpeRatio1y: fundPerf['sharpe_ratio_1y'],
        sharpeRatio3y: fundPerf['sharpe_ratio_3y'],
        sharpeRatio5y: fundPerf['sharpe_ratio_5y'],
        netAsset: fundPerf['net_assets'],
      },
      topHoldings: fundPortfolio['top_holdings'],
      assetAllocation: fundPortfolio['asset_allocation'],
      fee: {
        frontEnd: fundFeeExtracted.frontEnd,
        backEnd: fundFeeExtracted.backEnd,
        management: fundFeeExtracted.management,
      },
      tsfRecommendation: {
        isRecommended: false,
        comment: null,
      },
      fundQuoteLink: path.join(fundQuoteBaseUrl, fundInfo['short_code']),
    };

    const tsfComment = fetchTSFComment(fundName);
    if (tsfComment) {
      result.tsfRecommendation.isRecommended = true;
      result.tsfRecommendation.comment = tsfComment;
    }

    console.log(tsfComment);

    return result;
  } catch (error) {
    console.error(
      'Error fetching fund information or performance or fees:',
      error,
    );
    return `error: can't find the information for fund ${fundName}`;
  }
}

type FundFussyResult = {
  name: string;
  score: number;
};
export async function getFundFussySearch(
  fundName: string,
): Promise<FundFussyResult[]> {
  const fundListUrl = Config.fundApi.baseUrl;
  try {
    const response = await axios.get(fundListUrl);
    const fundList = response.data.data;

    const fundNames = fundList.map((fund: any) => fund['short_code']);

    const fuse = new Fuse(fundNames, {
      shouldSort: true,
      includeScore: true,
      threshold: 0.5,
    });

    const result = fuse.search(fundName);
    return result.slice(0, 5).map((item) => {
      return {
        name: item.item,
        score: item.score,
      };
    }) as FundFussyResult[];
  } catch (error) {
    console.error('Error fetching fund list:', error);
    return [];
  }
}

function fetchTSFComment(fundName: string): string | null {
  const elem = Config.tsf.recommendedFund.find((i) => i.fund === fundName);
  if (!elem) return null;
  return elem['fund_comment'];
}

function extractFee(fundFeeSecList: any): FundFee {
  const frontEndElem = fundFeeSecList.find((i: any) =>
    i.description.includes('การขายหน่วย'),
  );
  const backendElem = fundFeeSecList.find((i: any) =>
    i.description.includes('การรับซื้อคืน'),
  );
  const mgtElem = fundFeeSecList.find((i: any) =>
    i.description.includes('การจัดการ'),
  );

  return {
    frontEnd: frontEndElem ? frontEndElem['actual_value'] : '',
    backEnd: backendElem ? backendElem['actual_value'] : '',
    management: mgtElem ? mgtElem['actual_value'] : '',
  };
}
