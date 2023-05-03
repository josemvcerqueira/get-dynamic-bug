import {
  getObjectFields,
  JsonRpcProvider,
  testnetConnection,
} from '@mysten/sui.js';
import { DynamicFieldPage } from '@mysten/sui.js/src/types/dynamic_fields';
import { pathOr } from 'ramda';

const provider = new JsonRpcProvider(testnetConnection);

const STORAGE_OBJECT_ID =
  '0x0b7fe6779f5aa718a47279399a37a3a2f3239b69879518d6d51b592834d5aa56';

interface GetAllDynamicFieldsInternalArgs {
  cursor: null | string;
  nextPage: boolean;
  maxLength: number;
  data: DynamicFieldPage['data'];
  parentId: string;
}

const getAllDynamicFieldsInternal = async ({
  data,
  nextPage,
  maxLength,
  cursor,
  parentId,
}: GetAllDynamicFieldsInternalArgs): Promise<DynamicFieldPage['data']> => {
  const newData = await provider.getDynamicFields({
    parentId,
    cursor: cursor,
  });

  const nextData = data.concat(newData.data);

  console.log('hasNextPage is always true', nextPage);

  if (nextData.length > maxLength || !nextPage) return nextData;

  return getAllDynamicFieldsInternal({
    data: nextData,
    nextPage: newData.hasNextPage,
    cursor: newData.nextCursor,
    maxLength,
    parentId,
  });
};

const getAllDynamicFields = async (parentId: string, maxLength: number) => {
  const data = await provider.getDynamicFields({
    parentId,
  });

  return getAllDynamicFieldsInternal({
    data: data.data,
    nextPage: data.hasNextPage,
    cursor: data.nextCursor,
    maxLength,
    parentId,
  });
};

const getObjectSize = async () => {
  const object = await provider.getObject({
    id: STORAGE_OBJECT_ID,
    options: { showContent: true },
  });

  return {
    id: pathOr('', ['pools', 'fields', 'id', 'id'], getObjectFields(object)),
    size: pathOr(0, ['pools', 'fields', 'size'], getObjectFields(object)),
  };
};

const start = async () => {
  const { size, id } = await getObjectSize();

  console.log('The Pools Bag has a size of: ', size);

  const data = await getAllDynamicFields(id, size);

  console.log('We fetched an array with a length of: ', data.length);

  console.log(
    'We fetched an array with unique items of: ',
    new Set(...data.map(x => x.objectId)).size,
  );
};

void (async () => {
  await start();
})();
