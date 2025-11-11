import { Module } from '@nestjs/common';
import { TweetService } from './tweet.service';
import { TweetController } from './tweet.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tweet } from './tweet.entity';
import { UserModule } from 'src/user/user.module';
import { HashtagModule } from 'src/hashtag/hashtag.module';

@Module({
  providers: [TweetService],
  controllers: [TweetController],
  imports: [TypeOrmModule.forFeature([Tweet]), UserModule, HashtagModule],
})
export class TweetModule {}
