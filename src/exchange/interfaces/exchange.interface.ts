export interface IExchange {
  _id: string;
  token: string;
  exchangeType: string;
  status: string;
  tokenName: string;
  tokenSymbol: string;
  price: number;
  amountTicket: number;
  amountToken: number;
  amountForOneTicket: number;
  total: number;
  discountPercent: number;
  discountPrice: number;
  discountTotal: number;
  createTime: number;
  transactionValue: number;
  transactionHash: string;
  ownerWallet: string;

  wallet: string;
  createdAt: string;
  updatedAt: string;
}
