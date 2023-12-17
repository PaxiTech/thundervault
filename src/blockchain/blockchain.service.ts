import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IExchange } from '@src/exchange/interfaces/exchange.interface';
import { ExchangeService } from '@src/exchange/services/exchange.services';
import { UserService } from '@src/user/services/user.services';
import { NftService } from '@src/nft/services/nft.services';
import { Contract, ethers, formatEther } from 'ethers';
import * as moment from 'moment-timezone';
import { NFT_ACTION, NFT_STATUS, STORE_OWNER } from '@src/nft/schemas/nft.schema';
import { IPool } from '@src/pool/interfaces/pool.interface';
import { PoolService } from '@src/pool/services/pool.services';
import { ActionDto } from '@src/nft/dtos/action.dto';
@Injectable()
export class BlockchainService {
  ownerWallet: string;
  ownerNftWallet: string;
  nftAddress: string;
  tdvAddress: string;
  usdtAddress = '0x55d398326f99059fF775485246999027B3197955';
  abiTransferEvent = ['event Transfer(address indexed from, address indexed to, uint amount)'];
  abiNft = [
    'function getTokenLevel(uint256) public view returns (uint256)',
    'event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)',
    'event Staked(uint256 indexed tokenId, address indexed address)',
    'event Unstaked(uint256 indexed tokenId, address indexed address)',
    'function getStakeInfo(uint256 tokenId) public view returns (address owner, uint256 startTime, uint256 stakedDays)',
  ];
  providerAnkr;
  providerBsc;
  constructor(
    private configService: ConfigService,
    private exchangeService: ExchangeService,
    private userService: UserService,
    private nftService: NftService,
    private poolService: PoolService,
  ) {
    this.ownerWallet = this.configService.get<string>('ownerWallet');
    this.ownerNftWallet = this.configService.get<string>('ownerNftWallet');
    this.nftAddress = this.configService.get<string>('nftAddress');
    this.tdvAddress = this.configService.get<string>('tdvAddress');
    this.providerAnkr = ethers.getDefaultProvider(
      'https://rpc.ankr.com/bsc/5604b43661ba48f6ab7ef4b9970d5cd9b4fdb42357944ed24ca44374d640c604',
    );

    // mainnet
    // this.providerBsc = ethers.getDefaultProvider('https://bsc-dataseed.binance.org/');
    // testnet
    //this.providerBsc = ethers.getDefaultProvider('https://data-seed-prebsc-1-s1.binance.org:8545/');
    this.savePresave();
    // this.onWatchNft();
    // this.getRateTokenUsdt();
  }
  async savePresave() {
    const contract = new Contract(this.usdtAddress, this.abiTransferEvent, this.providerAnkr);

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

  async onWatchNft() {
    console.log('nft address', this.nftAddress);

    const contract = new Contract(this.nftAddress, this.abiNft, this.providerBsc);

    // because Ankr provider limit call
    const contractBsc = new Contract(this.nftAddress, this.abiNft, this.providerBsc);
    contract.on('Transfer', (from, to: string, tokenId, event) => {
      // has minted
      if (
        to.toLowerCase() == this.ownerNftWallet.toLowerCase() &&
        from.toLowerCase() == '0x0000000000000000000000000000000000000000'
      ) {
        contractBsc
          .getFunction('getTokenLevel')(tokenId)
          .then((level) => {
            // TODO: save new nft
            // /nft/{level}/{tokenId}.json
            this.nftService.generateNft(from, tokenId, level);
          });
      }
      // has burned
      else if (to.toLowerCase() == '0x0000000000000000000000000000000000000000') {
        // TODO: delete nft
        // xóa luôn json file không hay chỉ cần đưa về store?
        // tạm thời trả về store.
        this.nftService.updateNftOwner(tokenId, STORE_OWNER, NFT_STATUS.STORE);
      }

      //TODO: update nft owner = to
      contractBsc
        .getFunction('getTokenLevel')(tokenId)
        .then((level) => async () => {
          //get cache price nft
          const cache_key = `${from}-${level}`;
          const price = await this.nftService.cacheGetKey(cache_key);
          //kiểm tra xem user có tồn tại cache không.
          if (price) {
            //cập nhật owner, price, status
            this.nftService.updateNftOwner(tokenId, from, NFT_STATUS.WALLET, price);
            await this.nftService.cacheDelKey(cache_key);
          }
        });
    });

    contract.on('Staked', (tokenId, address, event) => {
      contract.getStakeInfo(tokenId).then((info) => async () => {
        const owner = info[0];
        const startTime = info[1];
        const stakedDays = info[2];

        //TODO: update nft staked
        const actionDto: ActionDto = {
          fromWallet: owner,
          nft: tokenId,
          action: NFT_ACTION.staking,
          status: NFT_STATUS.STAKING,
        };
        const updateData = {
          startTime: startTime,
          chargeTime: startTime,
          stakedDays: stakedDays,
        };
        const nftInfo = await this.nftService.stakingNft(actionDto, updateData);
        const poolData: IPool = {
          from: owner,
          to: address,
          nft: tokenId,
          startTime: startTime,
          chargeTime: startTime,
          stakedDays: stakedDays,
          transactionHash: event.log.transactionHash,
        };
        this.poolService.processStaking(poolData);
      });
    });
    contract.on('Unstaked', (tokenId, address, event) => {
      contract.getStakeInfo(tokenId).then((info) => async () => {
        const owner = info[0];
        const startTime = info[1];
        const stakedDays = info[2];

        const actionDto: ActionDto = {
          fromWallet: owner,
          nft: tokenId,
          action: NFT_ACTION.unStaking,
          status: NFT_STATUS.STAKING,
        };
        const updateData = {
          startTime: startTime,
          chargeTime: startTime,
          stakedDays: stakedDays,
        };
        const nftInfo = await this.nftService.unStakingNft(actionDto, updateData);
      });
    });
  }

  async getRateTokenUsdt(): Promise<number> {
    const pancakeRouterAddress = '0x10ED43C718714eb63d5aA57B78B54704E256024E';
    const pancakeRouterAbi = [
      'function getAmountsOut(uint256 amountIn, address[] memory path) internal view returns (uint256[] memory amounts)',
    ];
    const pancakeRouterContract = new ethers.Contract(
      pancakeRouterAddress,
      pancakeRouterAbi,
      this.providerAnkr,
    );

    const amountIn = ethers.parseUnits('1');
    const path = [this.usdtAddress, this.tdvAddress];
    const amounts = await pancakeRouterContract.getAmountsOut(amountIn, path);
    const rate = formatEther(amounts[1]);

    return parseFloat(rate);
  }
}
