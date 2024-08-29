export interface AccountIdentifier {
  account_type: string;
  account_code: string;
}

export interface BankAccount {
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

export interface GetBankSubscriptionsResponse {
  subscription_banks: BankAccount[];
}

export interface FinnoAPIResponse<T> {
  status: boolean;
  service_code: string;
  data: T;
  error_code: string;
  error_message: string;
}
