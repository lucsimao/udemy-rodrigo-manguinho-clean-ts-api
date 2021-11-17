import { Collection, MongoClient } from 'mongodb';

import { AccountModel } from '../../../../domain/models';

export const MongoHelper = {
  client: {} as MongoClient,

  async connect(uri: string): Promise<void> {
    this.client = await MongoClient.connect(uri);
  },

  async disconnect() {
    await this.client.close();
  },

  async getCollection(name: string): Promise<Collection> {
    return await this.client.db().collection(name);
  },

  map(account: any): AccountModel {
    if (!!account) {
      const { _id, ...accountWithoutId } = account;
      const result = {
        id: _id,
        ...accountWithoutId,
      } as AccountModel;
      return result;
    }
    throw Error('');
  },
};
