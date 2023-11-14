import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Pool, PoolSchema } from '@src/pool/schemas/pool.schema';
import { PoolRepository } from '@src/pool/repositories/pool.repository';
import { PoolService } from '@src/pool/services/pool.services';
import { PoolController } from './controllers/pool.controller';
import { UtilHelperService } from '@src/utils/helper.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Pool.name, schema: PoolSchema }])],
  providers: [PoolRepository, PoolService, UtilHelperService],
  exports: [PoolRepository, PoolService, UtilHelperService],
  controllers: [PoolController],
})
export class PoolModule {}
