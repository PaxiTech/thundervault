import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Nft, NftSchema } from '@src/nft/schemas/nft.schema';
import { NftRepository } from '@src/nft/repositories/nft.repository';
import { NftService } from '@src/nft/services/nft.services';
import { NftController } from './controllers/nft.controller';
import { UtilHelperService } from '@src/utils/helper.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Nft.name, schema: NftSchema }])],
  providers: [NftRepository, NftService, UtilHelperService],
  exports: [NftRepository, NftService, UtilHelperService],
  controllers: [NftController],
})
export class NftModule {}
