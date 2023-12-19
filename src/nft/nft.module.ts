import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Nft, NftSchema } from '@src/nft/schemas/nft.schema';
import { NftRepository } from '@src/nft/repositories/nft.repository';
import { CommissionRoi, CommissionRoiSchema } from '@src/nft/schemas/commissionfee.schema';
import { CommissionRoiRepository } from '@src/nft/repositories/commissionfee.repository';
import { NftService } from '@src/nft/services/nft.services';
import { NftController } from './controllers/nft.controller';
import { UtilHelperService } from '@src/utils/helper.service';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Nft.name, schema: NftSchema },
      { name: CommissionRoi.name, schema: CommissionRoiSchema },
    ]),
    CacheModule.register(),
  ],
  providers: [NftRepository, CommissionRoiRepository, NftService, UtilHelperService],
  exports: [NftRepository, CommissionRoiRepository, NftService, UtilHelperService],
  controllers: [NftController],
})
export class NftModule {}
