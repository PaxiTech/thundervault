import { Module } from '@nestjs/common';
import { StoreService } from '@src/store/services/store.services';
import { StoreController } from './controllers/store.controller';
import { NftModule } from '@src/nft/nft.module';
import { BlockchainModule } from '@src/blockchain/blockchain.module';

@Module({
  imports: [NftModule, BlockchainModule],
  providers: [StoreService],
  exports: [StoreService],
  controllers: [StoreController],
})
export class StoreModule {}
