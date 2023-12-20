import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as moment from 'moment-timezone';

@Injectable()
export class UtilHelperService {
  constructor(private configService: ConfigService) {}

  public getCurrentTime() {
    const currentTime = this.configService.get<string>('currentTime');
    return currentTime
      ? moment(currentTime).format('YYYY-MM-DD HH:mm:ss')
      : moment().format('YYYY-MM-DD HH:mm:ss');
  }
  public calculateEarningValue(price: number, currentBrokerageFeeStaking: any) {
    return price * currentBrokerageFeeStaking;
  }
  public getNftRankFromLevel(level: number): number {
    return Math.ceil(level / 3);
  }
}
