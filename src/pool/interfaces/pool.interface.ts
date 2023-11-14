export interface IPool {
  wallet: string;
  transactionHash: string;
  ownerWallet: string;
  amount: number;
  price: number;
  roundId: string;
  ticketPrice: number;
  amountForOneTicket: number;
  poolType: string;
  amountToken: number;
  amountTicket: number;
  createTime: string;
}
