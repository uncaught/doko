import {query} from '../Connection';

async function fixBrokenRoundNumbers(update: typeof query) {
  await update(`update rounds set data = JSON_REPLACE(data, '$.roundDuration', 7)
where id = '0fe83345-4b63-42fd-b960-5a9ee008ea7e'`);

  await update(`update games set data = JSON_REPLACE(data, '$.runNumber', 6)
where id IN (
'c9978373-d63e-472e-a1a9-95f0334d4f24',
'd8e1f301-ad5e-461a-8c98-8f1d21766e13',
'd492906f-e795-4da3-874d-9d8d7700b85e',
'1a354f45-08a4-4dd9-9149-9b9d35f7c77e'
)`);

  await update(`update games set data = JSON_REPLACE(data, '$.runNumber', 7)
where id IN (
'8f0d82ce-14d3-41b9-9358-3f8170da2a80',
'8f6be680-674f-420a-9c66-91f141fbcda4',
'5c1ed61b-f0c9-43b7-86e0-2ad205735685',
'ff13004f-3185-4171-a028-7e6cc7eb3758'
)`);

  await update(`update games set data = JSON_REPLACE(data, '$.isLastGame', TRUE)
where id ='ff13004f-3185-4171-a028-7e6cc7eb3758'`);
}

export async function run(update: typeof query) {
  console.log(`Running 004 ...`);
  await fixBrokenRoundNumbers(update);
}
