import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RouterModule } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import * as path from 'path';
import configuration from '@src/config/app';
import { HealthModule } from '@src/health/health.module';
import { CommonModule } from './common/common.module';
import { UserModule } from './user/user.module';
import { ExchangeModule } from './exchange/exchange.module';
import { BlockchainModule } from './blockchain/blockchain.module';
import { PoolModule } from './pool/pool.module';
import { NftModule } from './nft/nft.module';
import { OperatorModule } from './operator/operator.module';
import { CommandModule } from 'nestjs-command';

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
    PoolModule,
    NftModule,
    CommandModule,
    OperatorModule,
  ],
  controllers: [],
})
export class AppModule {}
