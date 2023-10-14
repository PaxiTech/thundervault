import { ExchangeType } from '@src/exchange/dtos/exchange-response.dto';
export const presaleConfig = [
  {
    id: 'round-1',
    exchangeType: ExchangeType.PRIVATE_SALE,
    startTime: '2023-10-10 00:00:00',
    startSaleTime: '2023-10-16 00:00:00',
    endTime: '2023-10-16 23:59:59',
    price: 0.1,
    ticketPrice: 6000,
    maxTicket: 10,
    maxAmount: 600000,
  },
  {
    id: 'round-2',
    exchangeType: ExchangeType.PRIVATE_SALE,
    startTime: '2023-11-01 00:00:00',
    startSaleTime: '2023-11-02 00:00:00',
    endTime: '2023-11-30 23:59:59',
    price: 0.125,
    ticketPrice: 2500,
    maxTicket: 35,
    maxAmount: 700000,
  },
  {
    id: 'round-3',
    exchangeType: ExchangeType.PRIVATE_SALE,
    startTime: '2023-12-01 00:00:00',
    startSaleTime: '2023-12-02 00:00:00',
    endTime: '2023-12-31 23:59:59',
    price: 0.15,
    ticketPrice: 1050,
    maxTicket: 100,
    maxAmount: 700000,
  },
  {
    id: 'round-4',
    exchangeType: ExchangeType.PUBLIC_SALE,
    startTime: '2024-01-01 00:00:00',
    startSaleTime: '2024-01-02 00:00:00',
    endTime: '2024-01-31 23:59:59',
    price: 0.2,
    ticketPrice: 200,
    maxTicket: 300,
    maxAmount: 300000,
  },
];
