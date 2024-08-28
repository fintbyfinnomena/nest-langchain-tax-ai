import { getRedisClient } from 'src/redis/client';
import { getGGSheet } from 'src/gg_sheet/client';
import { DateTime } from 'luxon';
import { getConfig } from 'src/config/tax.chat.config';
type InvestmentView = {
  group: string;
  assetClass: string;
  gauge: number;
  recommendation: string;
  view: string;
  action: string;
  updateAsOf: Date;
  previousRecommendation: string;
  gaugeChange: number;
};
const redisInvestmentViewKey = 'investment_view';
const redisInvestmentViewUpdateTime = 'investment_view_updated_at';
const updateIntervalMinute = 30;

export const getAllInvestmentViews = async (): Promise<string | null> => {
  try {
    const updatedTime = await GetLatestUpdateTime();

    if (
      !updatedTime ||
      updatedTime < DateTime.now().minus({ minutes: updateIntervalMinute })
    ) {
      await UpdateInvestmentView();
    }

    const investmentViews = await getRedisClient().get(redisInvestmentViewKey);
    return investmentViews;
  } catch (e) {
    console.error(e);
    return null;
  }
};

const GetLatestUpdateTime = async (): Promise<DateTime | null> => {
  const latestUpdateTime = await getRedisClient().get(
    redisInvestmentViewUpdateTime,
  );
  return latestUpdateTime ? DateTime.fromISO(latestUpdateTime) : null;
};

const getInvestmentViewFromGGSheet = async (): Promise<InvestmentView[]> => {
  const ggSheet = await getGGSheet(getConfig().investmentViewWorksheetId);
  console.error(getConfig().investmentViewWorksheetId);
  console.error(getConfig().investmentViewSheetId);
  const investmentViewData =
    await ggSheet.sheetsById[getConfig().investmentViewSheetId].getRows();

  const investmentViews = investmentViewData.map((row) => {
    return {
      group: row.get('Group'),
      assetClass: row.get('Asset Class'),
      gauge: row.get('Gauge'),
      recommendation: row.get('Recommendations'),
      view: row.get('Investment View'),
      action: row.get('Action'),
      updateAsOf: DateTime.fromFormat(row.get('update as of'), 'MMM-dd-yy'),
      previousRecommendation: row.get('Previous Recommendations'),
      gaugeChange: row.get('gauge change'),
    };
  });

  return investmentViews;
};

const UpdateInvestmentView = async (): Promise<void> => {
  const views = await getInvestmentViewFromGGSheet();
  await getRedisClient().set(redisInvestmentViewKey, JSON.stringify(views));
  await getRedisClient().set(
    redisInvestmentViewUpdateTime,
    DateTime.now().toISO(),
  );
};
