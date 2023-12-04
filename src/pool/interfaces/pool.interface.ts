export interface IPool {
  from: string;
  to: string; //owner wallet
  nft: string;
  level?: number;
  type?: number;
  startTime: string;
  transactionHash?: string;
  chargeTime?: string;
  remainEarningTime?: number;
  price?: number;
  stakedDays?: number;
}
export interface IHistoryInterestPool extends IPool {
  interestTime: string;
  amount: number;
}
