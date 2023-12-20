import { Module } from '@nestjs/common';
import { MarketService } from '@src/market/services/market.services';
import { MarketController } from './controllers/market.controller';
import { NftModule } from '@src/nft/nft.module';

@Module({
  imports: [NftModule],
  providers: [MarketService],
  exports: [MarketService],
  controllers: [MarketController],
})
export class MarketModule {}
