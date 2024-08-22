import { DynamicTool, DynamicStructuredTool } from '@langchain/core/tools';

import { z } from 'zod';
import * as Type from 'src/types/tax-saving-fund/portfolioAllocationn.types';
import * as FundRankingType from 'src/types/fundRanking.types';
import { suggestPortfolioAllocation } from 'src/utils/tools/tax-saving-fund/portfolioAllocation.tools';
import { ltfKnowledge } from 'src/utils/tools/tax-saving-fund/ltf.tool';
import { eventAndPromotion } from 'src/utils/tools/eventAndPromotion.tools';
import { TaxSavingFundType, RiskLevel } from 'src/types/tax-saving-fund/enum.prompts';
import {
  getFundInformation,
  getFundFussySearch,
} from 'src/utils/tools/fundInfo.tools';
import { getTaxSavingFundSuggestedList } from 'src/utils/tools/tax-saving-fund/suggestedFundList.tools';
import { getFundRanking } from 'src/utils/tools/fundRanking.tools';

export const suggestPortProfileAllocationTool = new DynamicStructuredTool({
  name: 'suggest-port-profile-allocation',
  description:
    'useful for create or suggest proper tax saving funds allocation and allocate you port.',
  schema: z.object({
    age: z.number().describe('age / อายุ'),
    annualIncome: z.number().describe('annual income / รายได้ประจำปี'),
    alternativeRetirementFund: z
      .number()
      .describe(
        `sum of the investment in "กองทุนสำรองเลี้ยงชีพ", "กองทุนสงเคราะห์ครู" this year`,
      ),
    govPensionFund: z.number().describe('investment in "กบข." this year'),
    nationalSavingFund: z
      .number()
      .describe('investment in "กองทุนการออมแห่งชาติ" this year'),
    pensionInsurance: z
      .number()
      .describe('investment in "ประกันบำนาญ" this year'),
    riskLevel: z.nativeEnum(RiskLevel).describe('investor risk level.'),
    desiredAmount: z.number().describe('the desired amount'),
  }),
  func: async ({
    age,
    annualIncome,
    alternativeRetirementFund,
    govPensionFund,
    nationalSavingFund,
    pensionInsurance,
    riskLevel,
    desiredAmount,
  }) => {
    // console.log("\x1b[46m%s\x1b[0m","--> suggestPortProfileAllocationTool doing!!")
    const input: Type.ComboAllocationInput = {
      age: age,
      annualIncome: annualIncome,
      alternativeRetirementFund: alternativeRetirementFund,
      govPensionFund: govPensionFund,
      nationalSavingFund: nationalSavingFund,
      pensionInsurance: pensionInsurance,
      riskLevel: riskLevel,
      desiredAmount: desiredAmount,
    };
    const result = await suggestPortfolioAllocation(input);
    return JSON.stringify(result);
  },
});

export const fundInformationTool = new DynamicStructuredTool({
  name: 'fund-information',
  description:
    'useful for answer the fund questions , give the fund information or whatever user need to know about fund from Finnomena',
  schema: z.object({
    fundName: z
      .string()
      .describe(
        'fund name, fund code or whatever for identity the fund. it should be english language , and not a sentence',
      ),
  }),
  func: async ({ fundName }) => {
    // console.log("\x1b[46m%s\x1b[0m","--> fundInformationTool doing!!")
    // console.log('\x1b[36m%s\x1b[0m', '--> send request : ', fundName);
    const result = await getFundInformation(fundName);
    return JSON.stringify(result);
  },
});

export const fundNameFussySearch = new DynamicStructuredTool({
  name: 'fund-name-fussy-search',
  description:
    'useful for finding the name of the fund from the user input, it will return the list of fund name that closely match the input using fussy match algorithm',
  schema: z.object({
    fundName: z
      .string()
      .describe(
        'fund name, fund code or whatever for identity the fund. it should be english language , and not a sentence',
      ),
  }),
  func: async ({ fundName }) => {
    // console.log("\x1b[46m%s\x1b[0m","--> fundNameFussySearch doing!!")
    const result = await getFundFussySearch(fundName);
    return JSON.stringify(result);
  },
});

export const taxSavingFundSuggestedListTool = new DynamicStructuredTool({
  name: 'tax-saving-fund-suggested-list',
  description:
    'useful for to give a suggested list on each type of tax saving fund from Finnomena this year',
  schema: z.object({
    type: z.nativeEnum(TaxSavingFundType).nullable().describe('Type of tax saving fund, Should be english and can be empty'),
    risk: z.nativeEnum(RiskLevel).nullable().describe('risk level of fund ( "สูง"/"high", "กลาง"/"medium", "ต่ำ"/"low" ,"ต่ำมาก"/"safe" ), Should be english and can be empty'),
    category: z.string().describe('category of fund, can be category ("หุ้น","อสังหา","พันธบัตร","ผสม","ทองคำ") , specific country or area ("จีน","เวียดนาม","เอเชีย",etc) , industry ("เทคโนโลยี","healthcare",etc). Should be thai and can be empty'),
  }),
  func: async ({
    type,
    risk,
    category,
  }) => {
    // console.log("\x1b[46m%s\x1b[0m","--> taxSavingFundSuggestedListTool doing!!")
    const input = {
      type: type,
      risk: risk,
      category: category,
    };
    const result = await getTaxSavingFundSuggestedList(input);
    return JSON.stringify(result);
  },
});

export const completeOrEscalate = new DynamicTool({
  name: 'complete-or-escalate',
  description:
    "A tool to mark the current task as completed and/or to escalate control of the dialog to the main assistant, who can re-route the dialog based on the user's needs.",
  func: async () => {
    // console.log("\x1b[46m%s\x1b[0m","--> completeOrEscalate doing!!")
    const schema_extra = {
      example: {
        cancel: true,
        reason: 'User changed their mind about the current task.',
      },
      'example 2': {
        cancel: true,
        reason: 'I have fully completed the task.',
      },
      'example 3': {
        cancel: false,
        reason: 'I need to search in the another agent for more information.',
      },
    };
    return JSON.stringify(schema_extra);
  },
});

export const ltfKnowledgeTool = new DynamicStructuredTool({
  name: 'ltf-knowledge',
  description: 'useful for get information about LTF fund',
  schema: z.object({}),
  func: async ({}) => {
    // console.log("\x1b[46m%s\x1b[0m","--> ltfKnowledgeTool doing!!")
    return ltfKnowledge();
  },
});

export const eventAndPromotionTool = new DynamicStructuredTool({
  name: 'event-promotion',
  description:
    'useful for get information about tax saving fund event and promotion from Finnomena',
  schema: z.object({}),
  func: async ({}) => {
    // console.log("\x1b[46m%s\x1b[0m","--> eventAndPromotionTool doing!!")
    return eventAndPromotion();
  },
});

export const fundRankingTool = new DynamicStructuredTool({
  name: 'fund-ranking',
  description:
    'useful for get ranking of funds based on return, period, category and type',
  schema: z.object({
    category: z.string().describe('fund category'),
    types: z.string().array().describe('fund types'),
    period: z.string().describe('sorting of period'),
    order: z.string().describe('ordering of returns'),
  }),
  func: async ({ category, types, period, order }) => {
    const input: FundRankingType.FundFilterInput = {
      category: category,
      types: types,
      period: period,
      order: order,
    };
    const result = await getFundRanking(input);
    return JSON.stringify(result);
  },
});
