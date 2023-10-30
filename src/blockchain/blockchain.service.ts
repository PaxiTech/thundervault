import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IExchange } from '@src/exchange/interfaces/exchange.interface';
import { ExchangeService } from '@src/exchange/services/exchange.services';
import { UserService } from '@src/user/services/user.services';
import { Contract, ethers, formatEther } from 'ethers';
import * as moment from 'moment-timezone';
@Injectable()
export class BlockchainService {
  ownerWallet: string;
  abi = ['event Transfer(address indexed from, address indexed to, uint amount)'];
  provider;
  constructor(
    private configService: ConfigService,
    private exchangeService: ExchangeService,
    private userService: UserService,
  ) {
    this.ownerWallet = this.configService.get<string>('ownerWallet');
    this.provider = ethers.getDefaultProvider('https://bsc-dataseed.binance.org/');
    this.savePresave();
  }
  async savePresave() {
    const contract = new Contract(
      '0x55d398326f99059fF775485246999027B3197955',
      this.abi,
      this.provider,
    );

    contract.on('Transfer', (from, to: string, _amount, event) => {
      const amount = +formatEther(_amount);
      if (this.ownerWallet.toLowerCase() == to.toLowerCase() && amount == 6000) {
        console.log(`${from} => ${to}: ${amount}: ${event.log.transactionHash}`);

        //update or insert user
        this.userService.upsertUser(from);
        //get current presave
        const currentPreSale = this.exchangeService.getCurrentPreSale();
        //create exchange
        const createData: IExchange = {
          wallet: from,
          transactionHash: event.log.transactionHash,
          ownerWallet: to,
          amount: amount,
          roundId: currentPreSale?.id,
          price: currentPreSale?.price,
          ticketPrice: currentPreSale?.ticketPrice,
          amountForOneTicket: currentPreSale?.amountForOneTicket,
          exchangeType: currentPreSale?.exchangeType,
          amountToken: currentPreSale?.amountForOneTicket,
          amountTicket: 1,
          createTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        };
        this.exchangeService.createExchange(createData);
      }
    });
  }

  //debug function
  async debugSavePresave() {
    const amount = 6000;
    const from = '0x8894E0a0c962CB723c1976a4421c95949bE2D4E3';
    const to = this.configService.get<string>('ownerWallet');
    const transactionHash = '0xf5a2d2fa815b4dd3758851fc074af2e91bf801448750d92491f3cb4fb1769d6f';

    if (this.ownerWallet.toLowerCase() == to.toLowerCase() && amount == 6000) {
      console.log(`${from} => ${to}: ${amount}: ${transactionHash}`);

      //update or insert user
      this.userService.upsertUser(from);
      //get current presave
      const currentPreSale = this.exchangeService.getCurrentPreSale();
      //create exchange
      const createData: IExchange = {
        wallet: from,
        transactionHash: transactionHash,
        ownerWallet: to,
        amount: amount,
        roundId: currentPreSale?.id,
        price: currentPreSale?.price,
        ticketPrice: currentPreSale?.ticketPrice,
        amountForOneTicket: currentPreSale?.amountForOneTicket,
        exchangeType: currentPreSale?.exchangeType,
        amountToken: currentPreSale?.amountForOneTicket,
        amountTicket: 1,
        createTime: moment().format('YYYY-MM-DD HH:mm:ss'),
      };
      this.exchangeService.createExchange(createData);
    }
  }
}
