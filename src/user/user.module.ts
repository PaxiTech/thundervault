import { Module, Global } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User, UserSchema } from './schemas/user.schema';
import { UserRepository } from './repositories/user.repository';
import { UserService } from './services/user.services';
import { UserController } from './controllers/user/user.controller';
import { JwtStrategy } from '@src/user/strategies/jwt.strategy';
import { ExchangeModule } from '@src/exchange/exchange.module';
import { NftModule } from '@src/nft/nft.module';

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwtSecret'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ExchangeModule,
    NftModule,
  ],
  providers: [UserRepository, UserService, JwtStrategy],
  exports: [UserRepository, UserService, JwtStrategy],
  controllers: [UserController],
})
export class UserModule {}
