export interface Order {
  id: number;
  order_date: string;
  order_type: string;
  fund: string;
  unit_type: string;
  amount: number;
  bank_name: string;
  bank_account_no: string;
}
export interface BatchPayload {
  ref: string;
  type: string;
  batch_type: string;
  orders: Order[];
}
