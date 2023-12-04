import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RouterModule } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import configuration from '@src/config/app';
import { HealthModule } from '@src/health/health.module';
import { CommandModule } from 'nestjs-command';
import { BlockchainModule } from './blockchain/blockchain.module';
import { CommonModule } from './common/common.module';
import { ExchangeModule } from './exchange/exchange.module';
import { NftModule } from './nft/nft.module';
// import { PoolModule } from './pool/pool.module';
import { UserModule } from './user/user.module';
import { StoreModule } from './store/store.module';
import { DebugModule } from './debug/debug.module';
import { MarketModule } from './market/market.module';
import { ScheduleModule } from './schedule/schedule.module';
import { ScheduleModule as CoreScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    HealthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('mongodbUrl'),
      }),
    }),
    CommonModule,
    UserModule,
    RouterModule.register([
      {
        path: 'exchange',
        module: ExchangeModule,
      },
    ]),
    ExchangeModule,
    BlockchainModule,
    // PoolModule,
    NftModule,
    CommandModule,
    StoreModule,
    DebugModule,
    MarketModule,
    ScheduleModule,
    CoreScheduleModule.forRoot(),
  ],
  controllers: [],
})
export class AppModule {}
