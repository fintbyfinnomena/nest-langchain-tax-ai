import { getFundFussySearch } from './utils/tools/fundInfo.tools';

async function dude() {
  const result = await getFundFussySearch('one-ugg-a');
  console.log(result);
}

dude();
