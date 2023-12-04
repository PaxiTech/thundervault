import { Module } from '@nestjs/common';
import { PayCommissionEveryDayTask } from './task/pay-commission-every-day.task';
import { PoolModule } from '@src/pool/pool.module';
@Module({
  imports: [PoolModule],
  providers: [PayCommissionEveryDayTask],
  exports: [],
  controllers: [],
})
export class ScheduleModule {}
