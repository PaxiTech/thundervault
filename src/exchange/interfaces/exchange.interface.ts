export interface IExchange {
  wallet: string;
  transactionHash: string;
  ownerWallet: string;
  amount: number;
  price: number;
  roundId: string;
  ticketPrice: number;
  amountForOneTicket: number;
  exchangeType: string;
  amountToken: number;
  amountTicket: number;
  createTime: string;
  preRefWallet?: string;
  preRefAmount?: number;
}
