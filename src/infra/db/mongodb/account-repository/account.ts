import { AccountModel } from '../../../../domain/models';
import { AddAccountModel } from '../../../../domain/use-cases';
import { AddAccountRepository } from '../../../../data/protocols/add-account-repository';
import { MongoHelper } from '../helpers/mongo-helper';

export class AccountMongoRepository implements AddAccountRepository {
  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts');

    const insertResult = await accountCollection.insertOne(accountData);
    const result = await accountCollection.findOne(insertResult.insertedId);
    return MongoHelper.map(result);
  }
}
