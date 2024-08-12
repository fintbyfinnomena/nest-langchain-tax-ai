import axios, { AxiosRequestConfig } from 'axios';
import Config from '../config/tax.chat.config';
import {
  AccountIdentifier,
  FinnoAPIResponse,
  GetBankSubscriptionsResponse,
} from 'src/types/account.types';

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
