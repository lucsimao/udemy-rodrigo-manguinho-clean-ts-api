import { Collection, MongoClient } from 'mongodb';

import { AccountModel } from '../../../../domain/models';

export const MongoHelper = {
  client: {} as MongoClient,
  uri: '' as string,

  async connect(uri: string): Promise<void> {
    this.client = await MongoClient.connect(uri);
    this.uri = uri;
  },

  async disconnect() {
    await this.client.close();
    this.client = {};
  },

  async getCollection(name: string): Promise<Collection> {
    if (!!this.client) {
      await this.connect(this.uri);
    }
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
