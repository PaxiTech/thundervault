import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Store, StoreSchema } from '@src/store/schemas/store.schema';
import { StoreRepository } from '@src/store/repositories/store.repository';
import { StoreService } from '@src/store/services/store.services';
import { StoreController } from './controllers/store.controller';
import { NftModule } from '@src/nft/nft.module';
import { BlockchainModule } from '@src/blockchain/blockchain.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Store.name, schema: StoreSchema }]),
    NftModule,
    forwardRef(() => BlockchainModule),
  ],
  providers: [StoreRepository, StoreService],
  exports: [StoreRepository, StoreService],
  controllers: [StoreController],
})
export class StoreModule {}
