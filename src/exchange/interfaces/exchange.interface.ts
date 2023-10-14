export interface IExchange {
  _id: string;
  token: string;
  exchangeType: string;
  status: string;
  tokenName: string;
  tokenSymbol: string;
  price: number;
  amount: number;
  total: number;
  discountPercent: number;
  discountPrice: number;
  discountTotal: number;
  createTime: number;
  wallet: string;
  createdAt: string;
  updatedAt: string;
}
