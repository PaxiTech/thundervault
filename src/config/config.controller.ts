import { Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

@ApiTags('config')
@Controller('configs')
export class ConfigController {
  constructor(private configService: ConfigService) {}

  @Post('/')
  async getConfig() {
    const result = {} as any;
    const configs = ['tdvAddress', 'nftAddress'];
    configs.forEach((element) => {
      result[element] = this.configService.get<string>(element);
    });
    return result;
  }
}
