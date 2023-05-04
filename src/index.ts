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
  data: DynamicFieldPage['data'];
  parentId: string;
}

const getAllDynamicFieldsInternal = async ({
  data,
  cursor,
  parentId,
}: GetAllDynamicFieldsInternalArgs): Promise<DynamicFieldPage['data']> => {
  const newData = await provider.getDynamicFields({
    parentId,
    cursor: cursor,
  });

  console.log('getDynamicFields called');

  const nextData = data.concat(newData.data);

  if (!newData.hasNextPage) return nextData;

  return getAllDynamicFieldsInternal({
    data: nextData,
    cursor: newData.nextCursor,
    parentId,
  });
};

const getAllDynamicFields = async (parentId: string) => {
  const data = await provider.getDynamicFields({
    parentId,
  });

  console.log('getDynamicFields called');

  return data.hasNextPage
    ? getAllDynamicFieldsInternal({
        data: data.data,
        cursor: data.nextCursor,
        parentId,
      })
    : data.data;
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

  const data = await getAllDynamicFields(id);

  console.log('We fetched an array with a length of: ', data.length);

  console.log(
    'We fetched an array with unique items of: ',
    new Set(data.map(x => x.objectId)).size,
  );
};

void (async () => {
  await start();
})();
