import { DynamicTool, DynamicStructuredTool } from "@langchain/core/tools"

import { z } from "zod";
import * as Type from 'src/types/tax-saving-fund/portfolioAllocationn.types'
import { suggestPortfolioAllocation } from 'src/utils/tools/tax-saving-fund/portfolioAllocation.tools'
import { RiskLevel } from 'src/types/tax-saving-fund/enum.prompts'
import { getFundInformation } from 'src/utils/tools/fundInfo.tools'
import { getTaxSavingFundRecommendation } from 'src/utils/tools/tax-saving-fund/recommend.tools'

export const suggestPortProfileAllocationTool = new DynamicStructuredTool({
  name: "suggest-port-profile-allocation",
  description: "suggest port profile allocation and return list of fund. useful for create fund profile and allocate you port",
  schema: z.object({
    ageAbove45: z.boolean().describe("age above 45 year old ?"),
    annualIncome: z.number().describe("annual income"),
    alternativeRetirementFund: z.number().describe("sum of the alternative retirement fund"),
    govPensionFund: z.number().describe("the total of government pension fund"),
    nationalSavingFund: z.number().describe("the total of national saving fund"),
    pensionInsurance: z.number().describe("the total of pension insurance"),
    riskLevel: z.nativeEnum(RiskLevel).describe("personal risk level."),
    desiredAmount: z.number().describe("the desired amount"),
  }),
  func: async ({ ageAbove45, annualIncome, alternativeRetirementFund, govPensionFund, nationalSavingFund, pensionInsurance, riskLevel, desiredAmount }) => {
    const input: Type.ComboAllocationInput = {
      ageAbove45 : ageAbove45,
      annualIncome : annualIncome,
      alternativeRetirementFund : alternativeRetirementFund,
      govPensionFund : govPensionFund,
      nationalSavingFund : nationalSavingFund,
      pensionInsurance : pensionInsurance,
      riskLevel : riskLevel,
      desiredAmount : desiredAmount
    }
    const result = await suggestPortfolioAllocation(input)
    return JSON.stringify(result.allocation)
  },
})

export const fundInformationTool = new DynamicStructuredTool({
  name: "fund-information",
  description: "useful for answer the fund questions , give the fund information or whatever user need to know about fund from finnomena",
  schema: z.object({
    fundName: z.string().describe("fund name, fund code or whatever for identity the fund")
  }),
  func: async ({ fundName }) => {
    const result = await getFundInformation(fundName)
    return JSON.stringify(result)
  },
})

export const taxSavingFundTool = new DynamicTool({
  name: "tax-saving-fund-recommendation",
  description: "useful for to give a tax saving fund recommendation",
  func: async() => {
    const result = await getTaxSavingFundRecommendation()
    return JSON.stringify(result)
  },
})