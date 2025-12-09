import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileModule } from './profile/profile.module';
import { TweetModule } from './tweet/tweet.module';
import { HashtagModule } from './hashtag/hashtag.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PaginationModule } from './common/pagination/pagination.module';
import { AuthModule } from './auth/auth.module';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import envValidation from './config/env.validation';
import authConfig from './auth/config/auth.config';
import { JwtModule } from '@nestjs/jwt';

const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: !ENV ? '.env' : `.env.${ENV.trim()}`,
      load: [appConfig, databaseConfig],
      validationSchema: envValidation,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.database'),
        autoLoadEntities: configService.get('database.autoLoadEntities'),
        synchronize: configService.get('database.synchronize'), // only use in development never in production
      }),
    }),
    ProfileModule,
    TweetModule,
    HashtagModule,
    PaginationModule,
    AuthModule,
    ConfigModule.forFeature(authConfig),
    JwtModule.registerAsync(authConfig.asProvider()),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
