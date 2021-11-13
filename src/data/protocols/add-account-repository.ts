import {
  AccountModel,
  AddAccountModel,
} from '../usecases/add-account/db-add-account-protocols';

export interface AddAccountRepository {
  add(addAccountData: AddAccountModel): Promise<AccountModel>;
}
