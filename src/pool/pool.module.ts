import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Pool, PoolSchema } from '@src/pool/schemas/pool.schema';
import { PoolStaking, PoolStakingSchema } from '@src/pool/schemas/pool.staking.schema';
import { PoolRepository } from '@src/pool/repositories/pool.repository';
import { PoolStakingRepository } from '@src/pool/repositories/pool.staking.repository';
import { PoolService } from '@src/pool/services/pool.services';
import { PoolController } from './controllers/pool.controller';
import { UtilHelperService } from '@src/utils/helper.service';
import { NftModule } from '@src/nft/nft.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Pool.name, schema: PoolSchema },
      { name: PoolStaking.name, schema: PoolStakingSchema },
    ]),
    NftModule,
  ],
  providers: [PoolRepository, PoolStakingRepository, PoolService, UtilHelperService],
  exports: [PoolRepository, PoolStakingRepository, PoolService, UtilHelperService],
  controllers: [PoolController],
})
export class PoolModule {}
