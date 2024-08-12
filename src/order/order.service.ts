import { BatchPayload } from 'src/types/order.types';
import { BatchOrderDto } from './dto/order.dto';
import { OrderRepo } from './order.repository';
import { AccountIdentifier, BankAccount } from 'src/types/account.types';
import { v4 as uuidv4 } from 'uuid';

export class OrderService {
  private readonly orderRepo: OrderRepo;
  constructor() {
    this.orderRepo = new OrderRepo();
  }

  public async GenerateBatchOrderPayload(
    userID: number,
    batchReq: BatchOrderDto,
  ): Promise<BatchPayload> {
    const accountIdentifiers =
      await this.orderRepo.GetAllAccountIdentifierByUserID(userID);
    const segregateAccount =
      getSegregateAccountFormAccountList(accountIdentifiers);
    const banks = await this.orderRepo.GetBanksSubscription(
      userID,
      segregateAccount.account_code,
    );
    const mainBank = getMainBankFromBanks(banks.subscription_banks);
    const response = mapToBatchPayload(segregateAccount, mainBank, batchReq);
    return response;
  }
}

function getSegregateAccountFormAccountList(
  accountIdentifiers: AccountIdentifier[],
): AccountIdentifier {
  const account = accountIdentifiers.find(
    (i) => i.account_type === 'segregate',
  );
  if (!account) {
    throw new Error('Segregate account not found');
  }
  return account;
}

function getMainBankFromBanks(banks: BankAccount[]): BankAccount {
  const mainBank = banks.find((i) => i.is_main === true);
  if (!mainBank) {
    throw new Error('Main bank not found');
  }
  return mainBank;
}

function mapToBatchPayload(
  segregateAccount: AccountIdentifier,
  mainBank: BankAccount,
  batchReq: BatchOrderDto,
): BatchPayload {
  const cartRef = uuidv4();
  const date = new Date().toISOString();
  const orders = batchReq.orders.map((order, index) => {
    return {
      id: index + 1,
      order_date: date,
      order_type: 'buy',
      fund: order.fund_short_code,
      unit_type: 'baht',
      amount: order.amount,
      bank_name: mainBank.bank_name,
      bank_account_no: mainBank.bank_account_no,
    };
  });

  return {
    ref: cartRef,
    type: 'batch',
    batch_type: 'taxi',
    orders,
  };
}
