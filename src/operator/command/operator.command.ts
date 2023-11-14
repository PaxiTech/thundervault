import { Command, Positional, Option } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { OperatorService } from '@src/operator/services/operator.services';

@Injectable()
export class OperatorCommand {
  constructor(private readonly operator: OperatorService) {}

  //EX npx nestjs-command create:operator paxi-lanchpad@gmail.com -p 123456 -n Admin
  @Command({
    command: 'create:operator <email>',
    describe: 'Creating an operator',
  })
  async create(
    @Positional({
      name: 'email',
      describe: 'the email',
      type: 'string',
    })
    email: string,

    @Option({
      name: 'password',
      describe: 'the password',
      type: 'string',
      alias: 'p',
      required: true,
    })
    password: string,

    @Option({
      name: 'fullName',
      describe: 'the fullName',
      type: 'string',
      alias: 'n',
      default: 'Admin',
      required: false,
    })
    fullName: string,
  ) {
    await this.operator.createSeedOperator({
      email,
      password,
      fullName,
    });
  }
}
