export interface INft {
  token: string;
  owner: string;
  level: number;
  price: number;
  originalStakedDays: number;
  stakedDays: number;
  remainStakedDays: number;
}
