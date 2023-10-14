import { ExchangeType } from '@src/exchange/dtos/exchange-response.dto';
export const presaleConfig = [
  {
    id: 'round-1',
    exchangeType: ExchangeType.PRIVATE_SALE,
    startTime: '2023-10-10 00:00:00',
    startSaleTime: '2023-10-16 00:00:00',
    endTime: '2023-10-16 23:59:59',
    price: 0.1,
    maxAmount: 600000,
  },
  {
    id: 'round-2',
    exchangeType: ExchangeType.PRIVATE_SALE,
    startTime: '2023-11-01 00:00:00',
    startSaleTime: '2023-11-02 00:00:00',
    endTime: '2023-11-16 23:59:59',
    price: 0.1,
    maxAmount: 400000,
  },
];
