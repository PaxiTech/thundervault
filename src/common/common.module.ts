import { Module, Global } from '@nestjs/common';

import { AppLogger } from './services/app-logger.service';
@Global()
@Module({
  providers: [AppLogger],
  exports: [AppLogger],
})
export class CommonModule {}
