export interface IPool {
  from: string;
  to: string; //owner wallet
  nft: string;
  transactionHash: string;
  startTime: string;
  chargeTime?: string;
  remainEarningTime?: number;
  price?: number;
  level?: number;
}
export interface IHistoryInterestPool extends IPool {
  interestTime: string;
  amount: number;
}
