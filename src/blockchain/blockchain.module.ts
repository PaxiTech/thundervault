import { Module } from '@nestjs/common';
import { BlockchainService } from './blockchain.service';
import { ExchangeModule } from '@src/exchange/exchange.module';
import { BlockchainController } from './controllers/blockchain.controller';

@Module({
  providers: [BlockchainService],
  imports: [ExchangeModule],
  controllers: [BlockchainController],
})
export class BlockchainModule {}
