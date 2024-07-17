import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { JwtProvider } from './providers/jwt.provider';
import { HashProvider } from './providers/hash.provider';
import { UserController } from './controller/user.controller';

@Module({
  providers: [UserService, JwtProvider, HashProvider],
  controllers: [UserController]
})
export class UserModule {}
