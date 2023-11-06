import { USER_LEVEL } from '@src/user/schemas/user.schema';
const { BRONZE, SILVER, GOLD, PLATINUM, RUBY, DIAMOND } = USER_LEVEL;
export const brokerageFeeStaking = {
  F1: {
    [BRONZE]: 0.05, //5%
    [SILVER]: 0.1, // 10%
    [GOLD]: 0.15, //15%
    [PLATINUM]: 0.2, //20%
    [RUBY]: 0.25, //25%
    [DIAMOND]: 0.3, // 30%
  },
  F2: {
    [BRONZE]: 0.0, //0%
    [SILVER]: 0.02, // 2%
    [GOLD]: 0.04, //4%
    [PLATINUM]: 0.06, //6%
    [RUBY]: 0.08, //8%
    [DIAMOND]: 0.1, // 10%
  },
  F3: {
    [BRONZE]: 0.0, //0%
    [SILVER]: 0.015, // 1.5%
    [GOLD]: 0.03, //3%
    [PLATINUM]: 0.045, //4,5%
    [RUBY]: 0.06, //6%
    [DIAMOND]: 0.075, // 7,5%
  },
  F4: {
    [BRONZE]: 0.0, //0%
    [SILVER]: 0.0, // 0%
    [GOLD]: 0.015, //1.5%
    [PLATINUM]: 0.03, //3%
    [RUBY]: 0.045, //4.5%
    [DIAMOND]: 0.06, // 6%
  },
  F5: {
    [BRONZE]: 0.0, //0%
    [SILVER]: 0.0, // 0%
    [GOLD]: 0.01, //1%
    [PLATINUM]: 0.02, //2%
    [RUBY]: 0.03, //3%
    [DIAMOND]: 0.04, // 4%
  },
  F6: {
    [BRONZE]: 0.0, //0%
    [SILVER]: 0.0, // 0%
    [GOLD]: 0.0, //0%
    [PLATINUM]: 0.01, //1%
    [RUBY]: 0.02, //2%
    [DIAMOND]: 0.03, // 3%
  },
  F7: {
    [BRONZE]: 0.0, //0%
    [SILVER]: 0.0, // 0%
    [GOLD]: 0.0, //0%
    [PLATINUM]: 0.0, //0%
    [RUBY]: 0.005, //0.5%
    [DIAMOND]: 0.01, // 1%
  },
  F8: {
    [BRONZE]: 0.0, //0%
    [SILVER]: 0.0, // 0%
    [GOLD]: 0.0, //0%
    [PLATINUM]: 0.0, //0%
    [RUBY]: 0.0, //0%
    [DIAMOND]: 0.005, // 1%
  },
};

export const brokerageFeeMarket = {
  F1: {
    [BRONZE]: 0.1, //10%
    [SILVER]: 0.2, // 20%
    [GOLD]: 0.3, //35%
    [PLATINUM]: 0.4, //40%
    [RUBY]: 0.5, //55%
    [DIAMOND]: 0.6, // 60%
  },
  F2: {
    [BRONZE]: 0.0, //0%
    [SILVER]: 0.05, //5%
    [GOLD]: 0.1, //10%
    [PLATINUM]: 0.15, //15%
    [RUBY]: 0.2, //20%
    [DIAMOND]: 0.25, // 25%
  },
  F3: {
    [BRONZE]: 0.0, //0%
    [SILVER]: 0.025, // 2,5%
    [GOLD]: 0.05, //5%
    [PLATINUM]: 0.075, //7.5%
    [RUBY]: 0.1, //10%
    [DIAMOND]: 0.125, // 12,5%
  },
  F4: {
    [BRONZE]: 0.0, //0%
    [SILVER]: 0.0, // 0%
    [GOLD]: 0.015, //1.5%
    [PLATINUM]: 0.03, //3%
    [RUBY]: 0.045, //4.5%
    [DIAMOND]: 0.06, // 6%
  },
  F5: {
    [BRONZE]: 0.0, //0%
    [SILVER]: 0.0, // 0%
    [GOLD]: 0.01, //1%
    [PLATINUM]: 0.02, //2%
    [RUBY]: 0.03, //3%
    [DIAMOND]: 0.04, // 4%
  },
  F6: {
    [BRONZE]: 0.0, //0%
    [SILVER]: 0.0, // 0%
    [GOLD]: 0.0, //0%
    [PLATINUM]: 0.0025, //0,25%
    [RUBY]: 0.005, //0.5%
    [DIAMOND]: 0.0075, // 0.75%
  },
  F7: {
    [BRONZE]: 0.0, //0%
    [SILVER]: 0.0, // 0%
    [GOLD]: 0.0, //0%
    [PLATINUM]: 0.0, //0%
    [RUBY]: 0.0025, //0,25%
    [DIAMOND]: 0.005, // 0.5%
  },
  F8: {
    [BRONZE]: 0.0, //0%
    [SILVER]: 0.0, // 0%
    [GOLD]: 0.0, //0%
    [PLATINUM]: 0.0, //0%
    [RUBY]: 0.0, //0%
    [DIAMOND]: 0.0025, // 0,25%
  },
};
