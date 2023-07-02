import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface CryptocurrencyInterface {
  id?: string;
  name: string;
  gas_fee: number;
  user_id?: string;
  created_at?: any;
  updated_at?: any;

  user?: UserInterface;
  _count?: {};
}

export interface CryptocurrencyGetQueryInterface extends GetQueryInterface {
  id?: string;
  name?: string;
  user_id?: string;
}
