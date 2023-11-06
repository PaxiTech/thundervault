import { Module, Global } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Operator, OperatorSchema } from './schemas/operator.schema';
import { OperatorRepository } from './repositories/operator.repository';
import { OperatorService } from '@src/operator/services/operator.services';
import { OperatorController } from './controllers/operator.controller';
import { JwtOperatorStrategy } from '@src/operator/strategies/jwt.strategy';
import { OperatorCommand } from '@src/operator/command/operator.command';
import { NftRepository } from '@src/nft/repositories/nft.repository';
import { NftService } from '@src/nft/services/nft.services';
import { Nft, NftSchema } from '@src/nft/schemas/nft.schema';

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwtSecret'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: Operator.name, schema: OperatorSchema },
      { name: Nft.name, schema: NftSchema },
    ]),
  ],
  providers: [
    NftRepository,
    NftService,
    OperatorRepository,
    OperatorService,
    JwtOperatorStrategy,
    OperatorCommand,
  ],
  exports: [NftRepository, NftService, OperatorRepository, OperatorService, JwtOperatorStrategy],
  controllers: [OperatorController],
})
export class OperatorModule {}
