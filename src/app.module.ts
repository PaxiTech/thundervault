import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RouterModule } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import configuration from '@src/config/app';
import { HealthModule } from '@src/health/health.module';
import { BlockchainModule } from './blockchain/blockchain.module';
import { CommonModule } from './common/common.module';
import { ExchangeModule } from './exchange/exchange.module';
import { UserModule } from './user/user.module';

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
  ],
  controllers: [],
})
export class AppModule {}
