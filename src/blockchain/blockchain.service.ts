import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ExchangeService } from '@src/exchange/services/exchange.services';
import { UserService } from '@src/user/services/user.services';
import { Contract, ethers, formatEther } from 'ethers';


@Injectable()
export class BlockchainService {
    ownerWallet: string;
    abi = [
        "event Transfer(address indexed from, address indexed to, uint amount)"
    ];
    provider;
    constructor(
        private configService: ConfigService,
        private exchangeService: ExchangeService,
        private userService: UserService,
    ) {
        this.ownerWallet = this.configService.get<string>('ownerWallet');
        this.provider = ethers.getDefaultProvider('https://bsc-dataseed.binance.org/');
        this.savePresave();
    }
    async savePresave() {

        const contract = new Contract("0x55d398326f99059fF775485246999027B3197955", this.abi, this.provider);

        contract.on("Transfer", (from, to: string, _amount, event) => {
            const amount = +formatEther(_amount)
            if (this.ownerWallet.toLowerCase() == to.toLowerCase() && amount == 6000) {

                console.log(`${from} => ${to}: ${amount}: ${event.log.transactionHash}`);

                const user = this.userService.createUser(from);
                //TODO: save transaction
            }

        });
    }
}
