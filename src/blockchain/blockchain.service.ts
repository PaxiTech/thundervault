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
  ownerNftWallet: string;
  nftAddress: string;
  abiTransferEvent = ['event Transfer(address indexed from, address indexed to, uint amount)'];
  abiNft = [
    'function getTokenLevel(uint256) public view returns (uint256)',
    'event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)',
  ];
  providerAnkr;
  providerBsc;
  constructor(
    private configService: ConfigService,
    private exchangeService: ExchangeService,
    private userService: UserService,
  ) {
    this.ownerWallet = this.configService.get<string>('ownerWallet');
    this.ownerNftWallet = this.configService.get<string>('ownerNftWallet');
    this.nftAddress = this.configService.get<string>('nftAddress');
    // this.providerAnkr = ethers.getDefaultProvider(
    //   'https://rpc.ankr.com/bsc/5604b43661ba48f6ab7ef4b9970d5cd9b4fdb42357944ed24ca44374d640c604',
    // );

    // testnet
    this.providerBsc = ethers.getDefaultProvider(
      'https://data-seed-prebsc-1-s1.binance.org:8545',
    );
    this.savePresave();
  }
  async savePresave() {
    const contract = new Contract(
      '0x55d398326f99059fF775485246999027B3197955',
      this.abiTransferEvent,
      this.providerAnkr,
    );

    contract.on('Transfer', (from, to: string, _amount, event) => {
      const amount = +formatEther(_amount);
      //get current presave
      const currentPreSale = this.exchangeService.getCurrentPreSale();
      if (
        this.ownerWallet.toLowerCase() == to.toLowerCase() &&
        amount == currentPreSale.ticketPrice
      ) {
        console.log(`${from} => ${to}: ${amount}: ${event.log.transactionHash}`);

        //update or insert user
        this.userService.upsertUser(from);

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

  async onMintNft() {
    const contract = new Contract(
      this.nftAddress,
      this.abiNft,
      this.providerAnkr,
    );

    // because Ankr provider limit call
    const contractBsc = new Contract(
      this.nftAddress,
      this.abiNft,
      this.providerBsc,
    );
    contract.on('Transfer', (from, to: string, tokenId, event) => {
      if (to == this.ownerNftWallet) {
        contractBsc.getFunction('getTokenLevel')(tokenId).then((level) => {
          // save new nft
          // /nft/{level}/{tokenId}.json
        });
      }
    });
  }
}
