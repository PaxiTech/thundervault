import { Module } from '@nestjs/common';
import { BlockchainService } from './blockchain.service';
import { ExchangeModule } from '@src/exchange/exchange.module';

@Module({
  providers: [BlockchainService],
  imports: [ExchangeModule],
})
export class BlockchainModule { }
