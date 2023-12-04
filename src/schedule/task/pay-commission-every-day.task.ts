import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AppLogger } from '@src/common/services/app-logger.service';
import { PoolService } from '@src/pool/services/pool.services';

@Injectable()
export class PayCommissionEveryDayTask {
  constructor(private readonly appLogger: AppLogger, private readonly poolService: PoolService) {}

  // vào lúc 0h mỗi ngày.
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  // @Cron(CronExpression.EVERY_10_SECONDS)
  async handleCron() {
    this.appLogger.log('Pay commission every day');
    console.log('Pay commission every day');
    await this.poolService.processCommissionFeeEveryDay();
  }
}
