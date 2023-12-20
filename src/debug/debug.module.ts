import { Module } from '@nestjs/common';
import { NftModule } from '@src/nft/nft.module';
import { DebugController } from './controllers/debug.controller';
import { ExchangeModule } from '@src/exchange/exchange.module';
import { DebugService } from './services/debug.services';

@Module({
  imports: [NftModule, ExchangeModule],
  providers: [DebugService],
  exports: [DebugService],
  controllers: [DebugController],
})
export class DebugModule {}
