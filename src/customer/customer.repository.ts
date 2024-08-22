import { HttpException, HttpStatus } from '@nestjs/common';
import axios, { AxiosRequestConfig } from 'axios';
import {
  AccountIdentifier,
  FinnoAPIResponse,
  GetBankSubscriptionsResponse,
} from 'src/types/account.types';

export class CustomerRepo {
  private registrarBaseUrl: string;
  constructor() {
    this.registrarBaseUrl = process.env.REGISTRAR_BASE_URL;
  }
  async GetAllAccountIdentifierByUserID(
    userID: number,
  ): Promise<AccountIdentifier[]> {
    const url = `${this.registrarBaseUrl}/registrar-service/private/api/v1/customer/account-identifier`;
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

    try {
      const response =
        await axios<FinnoAPIResponse<AccountIdentifier[]>>(axiosOptions);
      return response.data.data;
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'ไม่สามารถร้องขอข้อมูลบัญชีได้',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  async GetBanksSubscription(
    userID: number,
    accountCode: string,
  ): Promise<GetBankSubscriptionsResponse> {
    const url = `${this.registrarBaseUrl}/registrar-service/private/api/v1/account/account-code/${accountCode}?scope=subscription_banks`;
    const headers = {
      'Content-Type': 'application/json',
      'Finno-User-ID': userID,
    };
    const axiosOptions: AxiosRequestConfig = {
      method: 'GET',
      url: url,
      headers,
    };

    try {
      const response =
        await axios<FinnoAPIResponse<GetBankSubscriptionsResponse>>(
          axiosOptions,
        );
      return response.data.data;
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'ไม่สามารถร้องขอข้อมูลบัญชีธนาคารได้',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }
}
