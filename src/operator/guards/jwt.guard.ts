import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthenticationOperatorGuard extends AuthGuard('operator-jwt') {}
