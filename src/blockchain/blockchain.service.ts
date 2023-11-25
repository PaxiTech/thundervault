import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IExchange } from '@src/exchange/interfaces/exchange.interface';
import { ExchangeService } from '@src/exchange/services/exchange.services';
import { INft } from '@src/nft/interfaces/nft.interface';
import { NftService } from '@src/nft/services/nft.services';
import { IPool } from '@src/pool/interfaces/pool.interface';
import { PoolService } from '@src/pool/services/pool.services';
import { UserService } from '@src/user/services/user.services';
import { Contract, ethers, formatEther } from 'ethers';
import * as moment from 'moment-timezone';
@Injectable()
export class BlockchainService {
  ownerWallet: string;
  stakingOwnerWallet: string;
  marketOwnerWallet: string;
  abi = ['event Transfer(address indexed from, address indexed to, uint amount)'];
  provider;
  constructor(
    private configService: ConfigService,
    private exchangeService: ExchangeService,
    private userService: UserService,
    private nftService: NftService,
    private poolService: PoolService,
  ) {
    this.ownerWallet = this.configService.get<string>('ownerWallet');
    this.stakingOwnerWallet = this.configService.get<string>('stakingOwnerWallet');
    this.marketOwnerWallet = this.configService.get<string>('marketOwnerWallet');
    this.provider = ethers.getDefaultProvider(
      'https://rpc.ankr.com/bsc/5604b43661ba48f6ab7ef4b9970d5cd9b4fdb42357944ed24ca44374d640c604',
    );
    //save presave
    this.savePresave();
    //staking
    // this.staking();
    //market
    // this.sendToMarket();
  }
  async savePresave() {
    const contract = new Contract(
      '0x55d398326f99059fF775485246999027B3197955',
      this.abi,
      this.provider,
    );

    contract.on('Transfer', async (from, to: string, _amount, event) => {
      const amount = +formatEther(_amount);
      //get current presave
      const currentPreSale = this.exchangeService.getCurrentPreSale();
      if (
        this.ownerWallet.toLowerCase() == to.toLowerCase() &&
        amount == currentPreSale.ticketPrice
      ) {
        console.log(`${from} => ${to}: ${amount}: ${event.log.transactionHash}`);

        //update or insert user
        const userInfo = await this.userService.upsertUser(from);

        //create exchange
        let createData: IExchange = {
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
        //process for presale ref
        if (currentPreSale?.isPreRef && userInfo?.preRefCode) {
          const preRefUser = await this.userService.getUserInfoByPreRefCode(userInfo?.preRefCode);
          if (preRefUser) {
            createData = {
              ...createData,
              preRefAmount: currentPreSale?.preRefAmount,
              preRefWallet: preRefUser.wallet,
            };
          }
        }
        this.exchangeService.createExchange(createData);
      }
    });
  }

  // //hàm tạo nft
  // async mintNft() {
  //   const mintNftAbi = [
  //     'event Mint(address indexed owner, address indexed token, uint level uint price)',
  //   ];
  //   const mintNftContract = new Contract(
  //     '0x55d398326f99059fF775485246999027B3197955',
  //     mintNftAbi,
  //     this.provider,
  //   );

  //   mintNftContract.on('Mint', async (owner, token, level, price, event) => {
  //     console.log(`min nft ${owner}  ${token}: ${level}}`);

  //     //update or insert user
  //     await this.userService.upsertUser(owner);

  //     const metaData = this.nftService.getMetadata(level);
  //     //create Nft
  //     const createData: INft = {
  //       token: token,
  //       owner: owner,
  //       level: level,
  //       price: price,
  //       earningTime: metaData?.earningTime,
  //       remainEarningTime: metaData?.earningTime,
  //     };
  //     this.nftService.generateNft({ ...createData, metaData: metaData });
  //   });
  // }
  async staking() {
    const mintNftAbi = [
      'event Transfer(address indexed from,address indexed to, address indexed token, unit price)',
    ];
    const mintNftContract = new Contract(
      '0x55d398326f99059fF775485246999027B3197955',
      mintNftAbi,
      this.provider,
    );

    mintNftContract.on('Transfer', async (from, to, token, price, event) => {
      if (this.stakingOwnerWallet.toLowerCase() == to.toLowerCase()) {
        console.log(`staking ${from} => ${to}: ${token}: ${price}: ${event.log.transactionHash}`);

        //get token
        const nft = await this.nftService.getNftInfo(token);
        if (!nft) {
          console.log(`nft was not found :${token}`);
        }
        //update or insert user
        await this.userService.upsertUser(from);

        //create starking
        const createData: IPool = {
          from: from,
          to: to,
          nft: token,
          price: price,
          level: nft?.level,
          remainEarningTime: nft?.remainEarningTime,
          transactionHash: event.log.transactionHash,
          startTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        };
        this.poolService.staking(createData);
      }
    });
  }

  async sendToMarket() {
    const mintNftAbi = [
      'event Transfer(address indexed from,address indexed to, address indexed token)',
    ];
    const mintNftContract = new Contract(
      '0x55d398326f99059fF775485246999027B3197955',
      mintNftAbi,
      this.provider,
    );

    mintNftContract.on('Transfer', async (from, to, token, level, event) => {
      if (this.stakingOwnerWallet.toLowerCase() == to.toLowerCase()) {
        console.log(`staking ${from} => ${to}: ${token}: ${event.log.transactionHash}`);

        //get token
        const nft = await this.nftService.getNftInfo(token);
        if (!nft) {
          console.log(`nft was not found :${token}`);
        }
        //update or insert user
        await this.userService.upsertUser(from);

        //create starking
        // const createData: IPool = {
        //   from: from,
        //   to: to,
        //   nft: token,
        //   level: nft?.level,
        //   remainEarningTime: nft?.remainEarningTime,
        //   transactionHash: event.log.transactionHash,
        //   startTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        // };
        // this.poolService.staking(createData);
      }
    });
  }
}
