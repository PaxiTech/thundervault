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
    this.provider = ethers.getDefaultProvider(
      'https://rpc.ankr.com/bsc/5604b43661ba48f6ab7ef4b9970d5cd9b4fdb42357944ed24ca44374d640c604',
    );
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
}
