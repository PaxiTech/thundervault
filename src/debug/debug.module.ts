import { Module } from '@nestjs/common';
import { NftModule } from '@src/nft/nft.module';
import { DebugController } from './controllers/debug.controller';
import { ExchangeModule } from '@src/exchange/exchange.module';

@Module({
  imports: [NftModule, ExchangeModule],
  providers: [],
  exports: [],
  controllers: [DebugController],
})
export class DebugModule {}
