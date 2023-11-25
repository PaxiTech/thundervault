import { Module } from '@nestjs/common';
import { BlockchainService } from './blockchain.service';
import { ExchangeModule } from '@src/exchange/exchange.module';
import { NftModule } from '@src/nft/nft.module';
import { PoolModule } from '@src/pool/pool.module';

@Module({
  providers: [BlockchainService],
  imports: [ExchangeModule, NftModule, PoolModule],
})
export class BlockchainModule {}
