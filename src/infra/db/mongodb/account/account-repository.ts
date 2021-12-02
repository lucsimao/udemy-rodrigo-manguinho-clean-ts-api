import { AccountModel } from '../../../../domain/models';
import { AddAccountModel } from '../../../../domain/use-cases';
import { AddAccountRepository } from '../../../../data/protocols/db/add-account-repository';
import { LoadAccountByEmailRepository } from '../../../../data/protocols/db/load-account-by-email-repository';
import { MongoHelper } from '../helpers/mongo-helper';
import { ObjectId } from 'bson';
import { UpdateAccessTokenRepository } from '../../../../data/protocols/db/update-access-token-repository';

export class AccountMongoRepository
  implements
    AddAccountRepository,
    LoadAccountByEmailRepository,
    UpdateAccessTokenRepository
{
  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts');

    const insertResult = await accountCollection.insertOne(accountData);
    const result = await accountCollection.findOne(insertResult.insertedId);
    return MongoHelper.map(result);
  }

  async loadByEmail(email: string): Promise<AccountModel | null> {
    const accountCollection = await MongoHelper.getCollection('accounts');
    const result = await accountCollection.findOne({ email });

    return result && MongoHelper.map(result);
  }

  async updateAccessToken(id: string, token: string): Promise<void> {
    const accountCollection = await MongoHelper.getCollection('accounts');
    await accountCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          accessToken: token,
        },
      }
    );
  }
}
