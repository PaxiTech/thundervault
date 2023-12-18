import { Module } from '@nestjs/common';
import { BlockchainService } from './blockchain.service';
import { ExchangeModule } from '@src/exchange/exchange.module';
import { NftModule } from '@src/nft/nft.module';
import { PoolModule } from '@src/pool/pool.module';
import { StoreModule } from '@src/store/store.module';

@Module({
  imports: [ExchangeModule, NftModule, PoolModule, StoreModule],
  providers: [BlockchainService],
  exports: [BlockchainService],
})
export class BlockchainModule {}
