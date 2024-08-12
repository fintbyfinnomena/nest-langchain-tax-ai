import axios, { AxiosRequestConfig } from 'axios';
import Config from '../config/tax.chat.config';

interface AccountIdentifier {
  account_type: string;
  account_code: string;
}

interface BankAccount {
  id: number;
  bank_code: string;
  bank_name: string;
  bank_name_th: string;
  icon: string;
  bank_account_no: string;
  bank_account_name: string;
  bank_account_type: string;
  branch_name: string;
  bank_branch_name_en: string;
  bank_branch: string;
  masked_bank_account_no: string;
  is_main: boolean;
  created_at: string;
  updated_at: string;
}

interface GetBankSubscriptionsResponse {
  subscription_banks: BankAccount[];
}

interface Order {
  id: number;
  order_date: string;
  order_type: string;
  fund: string;
  unit_type: string;
  amount: number;
  bank_name: string;
  bank_account_no: string;
  consents: string[];
}
interface BatchPayload {
  ref: string;
  type: string;
  batch_type: string;
  orders: Order[];
}

interface FinnoAPIResponse<T> {
  status: boolean;
  service_code: string;
  data: T;
  error_code: string;
  error_message: string;
}

export class OrderRepo {
  private registrarBaseUrl: string;
  constructor() {
    this.registrarBaseUrl = Config.registrarBaseUrl;
  }
  async GetAllAccountIdentifierByUserID(
    userID: number,
  ): Promise<AccountIdentifier[]> {
    const url = `${this.registrarBaseUrl}/private/api/v1/customer/account-identifier`;
    const headers = {
      'Content-Type': 'application/json',
      'Finno-User-ID': userID,
    };
    const bodyReq = {
      finnomena_id: userID,
    };

    const axiosOptions: AxiosRequestConfig = {
      method: 'POST',
      url: url,
      headers,
      data: bodyReq,
    };

    const response =
      await axios<FinnoAPIResponse<AccountIdentifier[]>>(axiosOptions);
    return response.data.data;
  }

  async GetBanksSubscription(
    userID: number,
    accountCode: string,
  ): Promise<GetBankSubscriptionsResponse> {
    const url = `${this.registrarBaseUrl}/private/api/v1/account/account-code/${accountCode}?scope=subscription_banks`;
    const headers = {
      'Content-Type': 'application/json',
      'Finno-User-ID': userID,
    };
    const axiosOptions: AxiosRequestConfig = {
      method: 'GET',
      url: url,
      headers,
    };

    const response =
      await axios<FinnoAPIResponse<GetBankSubscriptionsResponse>>(axiosOptions);
    return response.data.data;
  }
}
