import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Exchange, ExchangeSchema } from '@src/exchange/schemas/exchange.schema';
import { ExchangeRepository } from '@src/exchange/repositories/exchange.repository';
import { ExchangeService } from '@src/exchange/services/exchange.services';
import { ExchangeController } from './controllers/exchange.controller';
import { UtilHelperService } from '@src/utils/helper.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Exchange.name, schema: ExchangeSchema }])],
  providers: [ExchangeRepository, ExchangeService, UtilHelperService],
  exports: [ExchangeRepository, ExchangeService, UtilHelperService],
  controllers: [ExchangeController],
})
export class ExchangeModule {}
