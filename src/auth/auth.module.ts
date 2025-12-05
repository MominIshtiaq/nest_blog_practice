import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { HashingProvider } from './provider/hashing.provider';
import { BcryptProvider } from './provider/bcrypt.provider';

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [AuthService, HashingProvider, BcryptProvider],
})
export class AuthModule {}
