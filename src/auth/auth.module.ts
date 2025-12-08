import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { HashingProvider } from './provider/hashing.provider';
import { BcryptProvider } from './provider/bcrypt.provider';
import { ConfigModule } from '@nestjs/config';
import authConfig from './config/auth.config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    forwardRef(() => UserModule),
    ConfigModule.forFeature(authConfig),
    /* 
    asProvider method will help us by avoiding extra boilerplate
    if we don't use this method what we have to do is
    JwtModule.registerAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            JWT_TOKEN_SECRET_KEY : configService.get('authConfig.secret'),
            JWT_TOKEN_EXPIRESIN: configService.get('authConfig.expiresIn'),
            // so on
          }),
        })
    */
    JwtModule.registerAsync(authConfig.asProvider()),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: HashingProvider,
      useClass: BcryptProvider,
    },
  ],
  exports: [HashingProvider],
})
export class AuthModule {}
