import * as Type from '../../../types/tax-saving-fund/portfolioAllocationn.types';
import {
  RiskLevel,
  TaxSavingFundType,
} from '../../../types/tax-saving-fund/enum.prompts';
import Config from '../../../config/tax.chat.config';

const MAX_NUMBER_INPUT = 9999999999;
const BELOW_45_CONSTRUCTION_LOGIC = `สำหรับผู้เสียภาษีที่อายุ 45 ปีหรือต่ำกว่า  Charlie จะแนะนำให้ลงทุนในกองทุน SSF ให้เต็มสิทธิ์ ก่อนจะลงทุนส่วนที่เหลือในกองทุน RMF และ TESG เนื่องจากตามกฎหมาย กองทุนประเภทนี้ไม่จำเป็นต้องถือถึงอายุ 55 ถึงจะขายกองทุนเหล่านั้นออกมาได้ เพียงแค่ถือเป็นระยะเวลา 10 ปีก็สามารถขายออกมาได้ทันที (ตัวอย่าง ผู้เสียภาษีอายุ 44 ปี สามารถขายกองทุนนำเงินออกมาได้ตั้งแต่อายุ 54 ปี) นอกจากนี้กองทุนประเภท SSF ยังไม่มีเงื่อนไขที่ต้องลงทุนต่อเนื่องทุกปีแบบ RMF อีกด้วย`;
const ABOVE_45_CONSTRUCTION_LOGIC = `สำหรับ ผู้เสียภาษีที่อายุมากกว่า 45 ปี  Charlie จะแนะนำให้ลงทุนในกองทุน RMF ให้เต็มสิทธิ์ ก่อนจะลงทุนส่วนที่เหลือในกองทุน SSF และ TESG เนื่องจากมีโอกาสที่จะขายกองทุนเหล่านี้ออกมาในระยะเวลาที่ต่ำกว่า 10 ปีของ SSF ได้ จากเงื่อนไขอายุที่เข้าใกล้ 55 ปี`;
const FUND_SELECTION_LOGIC = `

สำหรับกอง TESG เราแนะนำไว้ท้ายสุดเนื่องจากเป็นกองทุนที่ไม่มีความยืดหยุ่นในประเภทสินทรัพย์ที่ลงทุนได้

เมื่อ Charlie คำนวณสัดส่วนกองทุนทั้งหมดแล้ว จะทำการเลือกแนะนำกองทุนตามความเสี่ยงที่ผู้เสียภาษีต้องการ โดยกองทุนเหล่านี้ได้มีการคัดเลือกจากผู้เชี่ยวชาญและ Charlie ของทาง FINNOMENA ดูหลักการคัดเลือกกองทุนเต็ม ๆ ที่ https://www.finnomena.com/tumsuphakorn/finnomena-pick/`;

function validNumberInput(x: number): boolean {
  return x >= 0 && x < MAX_NUMBER_INPUT;
}

export function suggestPortfolioAllocation(
  input: Type.ComboAllocationInput,
): Type.ComboAllocation {
  const allocation: Type.FundTypeAllocation[] = [];
  const result = {
    allocation,
    note: '',
    reason: '',
  };

  try {
    validateComboAllocationInput(input);
  } catch (e: any) {
    result.note = e.message;
    return result;
  }

  const maximumAllowAmount = calculateMaximumAllowAmount(
    input.annualIncome,
    input.alternativeRetirementFund,
    input.govPensionFund,
    input.nationalSavingFund,
    input.pensionInsurance,
  );

  let desiredAmount = input.desiredAmount;

  if (desiredAmount) {
    if (desiredAmount > maximumAllowAmount.all) {
      desiredAmount = maximumAllowAmount.all;
      result.note =
        'warning: desired amount is more than maximum allowed amount for all tax benefit fund, system will use maximum allowed amount for calculation';
    }

    // Case: Do nothing because desired amount in acceptable range
  } else {
    desiredAmount = maximumAllowAmount.all;
  }

  let fundTypeOrder;
  if (input.ageAbove45) {
    fundTypeOrder = [
      TaxSavingFundType.RMF,
      TaxSavingFundType.SSF,
      TaxSavingFundType.TESG,
    ];
  } else {
    fundTypeOrder = [
      TaxSavingFundType.SSF,
      TaxSavingFundType.RMF,
      TaxSavingFundType.TESG,
    ];
  }

  result.allocation = calculateAllocationByOrder(
    desiredAmount,
    maximumAllowAmount,
    input.riskLevel,
    fundTypeOrder,
  );

  result.reason =
    (input.ageAbove45
      ? ABOVE_45_CONSTRUCTION_LOGIC
      : BELOW_45_CONSTRUCTION_LOGIC) + FUND_SELECTION_LOGIC;

  return result;
}

export function calculateMaximumAllowAmount(
  annualIncome: number,
  alternativeRetirementFund: number,
  govPensionFund: number,
  nationalSavingFund: number,
  pensionInsurance: number,
): Type.MaximumAllowAmountEachType {
  //เพดานยอดเงินแต่ละประเภท

  // Thai ESG: ตามจริงหรือไม่เกิน 30% ของรายได้ทั้งปี และไม่เกิน 100,000 บาท
  const THAI_ESG_MAX_REVENUE_PERCENTAGE = 0.3;
  const THAI_ESG_MAX_ALLOW_AMOUNT = 300000;
  const userThaiEsgMaxAllowAmount = Math.min(
    annualIncome * THAI_ESG_MAX_REVENUE_PERCENTAGE,
    THAI_ESG_MAX_ALLOW_AMOUNT,
  );

  const MAXIMUM_ALLOW_AMOUNT_SSF_RMF = 500000;

  // กองทุนสำรองเลี้ยงชีพ / กองทุนสงเคราะห์ครูโรงเรียนเอกชน / กบข.: ตามจริงหรือไม่เกิน 15% ของเงินเดือน กรณี กบข. 30% ของเงินเดือน และไม่เกิน 500,000 บาท
  const ALTERNATIVE_FUND_MAX_REVENUE_PERCENTAGE = 0.15;
  const GOV_PENSION_MAX_REVENUE_PERCENTAGE = 0.3;
  const ALTERNATIVE_FUND_AND_GOV_PENSION_MAX_ALLOW_AMOUNT = 500000;
  const maxDeductionFromAlternativeRetirementFundAndGovPension = Math.min(
    Math.min(
      alternativeRetirementFund,
      annualIncome * ALTERNATIVE_FUND_MAX_REVENUE_PERCENTAGE,
    ) +
      Math.min(
        govPensionFund,
        annualIncome * GOV_PENSION_MAX_REVENUE_PERCENTAGE,
      ),
    ALTERNATIVE_FUND_AND_GOV_PENSION_MAX_ALLOW_AMOUNT,
  );

  // กองทุนการออมแห่งชาติ: ตามจริงหรือไม่เกิน 30,000 บาท
  const NATIONAL_SAVING_MAX_ALLOW_AMOUNT = 30000;
  const maxDeductionFromNationalSavingFund = Math.min(
    nationalSavingFund,
    NATIONAL_SAVING_MAX_ALLOW_AMOUNT,
  );

  // เบี้ยประกันชีวิตแบบบำนาญ: ตามจริงหรือไม่เกิน 15% ของรายได้ทั้งปี และไม่เกิน 200,000 บาท
  const PERNSION_INSURANCE_MAX_REVENUE_PERCENTAGE = 0.15;
  const PENSION_INSURANCE_MAX_ALLOW_AMOUNT = 200000;
  const maxDeductionFromPensionInsurance = Math.min(
    pensionInsurance,
    annualIncome * PERNSION_INSURANCE_MAX_REVENUE_PERCENTAGE,
    PENSION_INSURANCE_MAX_ALLOW_AMOUNT,
  );

  const leftOverForSSFAndRMF = Math.max(
    MAXIMUM_ALLOW_AMOUNT_SSF_RMF -
      maxDeductionFromAlternativeRetirementFundAndGovPension -
      maxDeductionFromNationalSavingFund -
      maxDeductionFromPensionInsurance,
    0,
  );

  // RMF: ตามจริงหรือไม่เกิน 30% ของรายได้ทั้งปี และเมื่อรวมกับ กองทุนสำรองเลี้ยงชีพ กองทุนสงเคราะห์ครูโรงเรียนเอกชน กบข. กองทุนการออมแห่งชาติ เบี้ยประกันชีวิตแบบบำนาญแล้วต้องไม่เกิน 500,000 บาท
  const RMF_MAX_REVENUE_PERCENTAGE = 0.3;
  const userRmfMaxAllowAmount = Math.min(
    annualIncome * RMF_MAX_REVENUE_PERCENTAGE,
    leftOverForSSFAndRMF,
  );

  // SSF: ตามจริงหรือไม่เกิน 30% ของรายได้ทั้งปี และไม่เกิน 200,000 บาท และเมื่อรวมกับ RMF กองทุนสำรองเลี้ยงชีพ กองทุนสงเคราะห์ครูโรงเรียนเอกชน กบข. กองทุนการออมแห่งชาติ เบี้ยประกันชีวิตแบบบำนาญแล้วต้องไม่เกิน 500,000 บาท
  const SSF_MAX_REVENUE_PERCENTAGE = 0.3;
  const SSF_MAX_ALLOW_AMOUNT = 200000;
  const userSsfMaxAllowAmount = Math.min(
    annualIncome * SSF_MAX_REVENUE_PERCENTAGE,
    leftOverForSSFAndRMF,
    SSF_MAX_ALLOW_AMOUNT,
  );

  const userSsfAndRmfMaxAllowAmount = Math.min(
    userSsfMaxAllowAmount + userRmfMaxAllowAmount,
    leftOverForSSFAndRMF,
  );

  // ref: https://www.itax.in.th/pedia/%e0%b8%84%e0%b9%88%e0%b8%b2%e0%b8%a5%e0%b8%94%e0%b8%ab%e0%b8%a2%e0%b9%88%e0%b8%ad%e0%b8%99/

  return {
    tesg: userThaiEsgMaxAllowAmount,
    ssf: userSsfMaxAllowAmount,
    rmf: userRmfMaxAllowAmount,
    ssfAndRmf: userSsfAndRmfMaxAllowAmount,
    all: userThaiEsgMaxAllowAmount + userSsfAndRmfMaxAllowAmount,
  };
}

function validateComboAllocationInput(input: Type.ComboAllocationInput): void {
  if (!validNumberInput(input.annualIncome)) {
    throw new Error('error: Please provide valid annual income');
  }
  if (!validNumberInput(input.alternativeRetirementFund)) {
    throw new Error(
      'error: Please provide valid alternative retirement fund data',
    );
  }
  if (!validNumberInput(input.govPensionFund)) {
    throw new Error('error: Please provide valid government pension fund data');
  }
  if (!validNumberInput(input.pensionInsurance)) {
    throw new Error('error: Please provide valid pension insurance data');
  }
  if (!validNumberInput(input.nationalSavingFund)) {
    throw new Error('error: Please provide valid national saving fund data');
  }
  if (input.desiredAmount && !validNumberInput(input.desiredAmount)) {
    throw new Error('error: Please provide valid desired amount');
  }
}

function createFundTypeAllocation(
  wholeAmount: number,
  amount: number,
  risk: RiskLevel,
  type: TaxSavingFundType,
): Type.FundTypeAllocation {
  const description = getConfigMeta(
    `${type as string}_${risk as string}_combo_description`,
  ).toString();
  const minimumAmount = getConfigMeta(`combo_minimum_investment`) as number;

  const funds: Type.FundAllocation[] = [];

  const result = {
    type,
    risk,
    amount,
    description,
    funds,
  };

  if (amount <= minimumAmount) {
    const minimumFund = getConfigMeta(
      `${type as string}_below_minimum_fund`,
    ) as string;

    result.funds.push({
      type,
      risk,
      fund: minimumFund,
      proportion: Math.round((amount / wholeAmount) * 100),
      amount,
    });
    return result;
  }

  const templateAllocation = getConfigCombo(type, risk);
  for (const item of templateAllocation) {
    const fundAmount = (item.proportion * amount) / 100;
    result.funds.push({
      type,
      risk,
      fund: item.fund,
      proportion: Math.round((fundAmount / wholeAmount) * 100),
      amount: Math.round(fundAmount),
    });
  }

  return result;
}

function getConfigMeta(key: string): string | number {
  const elem = Config.tsf.meta.find((i) => i.key === key);

  if (!elem) {
    throw new Error(`error: config meta key: ${key} not found`);
  }
  return elem.value;
}

function getConfigCombo(
  type: TaxSavingFundType,
  risk: RiskLevel,
): Type.ModelFundAllocation[] {
  const result: Type.ModelFundAllocation[] = [];

  for (const i of Config.tsf.portfolio) {
    if (i.type === (type as string) && i.risk === (risk as string)) {
      result.push({
        type,
        risk,
        fund: i.fund,
        proportion: i.proportion,
      });
    }
  }

  return result;
}

function calculateAllocationByOrder(
  desiredAmount: number,
  maximumAllowAmount: Type.MaximumAllowAmountEachType,
  riskLevel: RiskLevel,
  fundTypeOrder: TaxSavingFundType[],
): Type.FundTypeAllocation[] {
  const allocation: Type.FundTypeAllocation[] = [];

  let remainingDesiredAmount = desiredAmount;
  let allocatedSsfOrRmfAmount = 0;

  for (const [order, type] of fundTypeOrder.entries()) {
    let suggestedAmount = 0;
    if (remainingDesiredAmount > 0) {
      switch (type) {
        case TaxSavingFundType.TESG:
          suggestedAmount = Math.min(
            remainingDesiredAmount,
            maximumAllowAmount[type as keyof Type.MaximumAllowAmountEachType],
          );
          break;
        case TaxSavingFundType.RMF:
        case TaxSavingFundType.SSF:
          if (order == 0) {
            suggestedAmount = Math.min(
              remainingDesiredAmount,
              maximumAllowAmount[type as keyof Type.MaximumAllowAmountEachType],
            );
            allocatedSsfOrRmfAmount += suggestedAmount;
          } else {
            suggestedAmount = Math.min(
              remainingDesiredAmount,
              maximumAllowAmount.ssfAndRmf - allocatedSsfOrRmfAmount,
            );
          }
          break;
        default:
          continue;
      }
      if (suggestedAmount > 0) {
        allocation.push(
          createFundTypeAllocation(
            desiredAmount,
            suggestedAmount,
            riskLevel,
            type,
          ),
        );
      }
      remainingDesiredAmount -= suggestedAmount;
    }
  }

  return allocation;
}
