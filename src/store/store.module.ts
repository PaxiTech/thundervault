import { Module } from '@nestjs/common';
import { StoreService } from '@src/store/services/store.services';
import { StoreController } from './controllers/store.controller';
import { NftModule } from '@src/nft/nft.module';

@Module({
  imports: [NftModule],
  providers: [StoreService],
  exports: [StoreService],
  controllers: [StoreController],
})
export class StoreModule {}
