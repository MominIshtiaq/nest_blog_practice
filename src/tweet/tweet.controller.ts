import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TweetService } from './tweet.service';
import { CreateTweetDto } from './dto/create-tweet.dto';

@Controller('tweet')
export class TweetController {
  constructor(private readonly tweetService: TweetService) {}

  @Get(':userId')
  async getUserTweets(@Param('userId') userId: string) {
    return this.tweetService.getUserTweets(userId);
  }

  @Post()
  async create(@Body() tweet: CreateTweetDto) {
    return this.tweetService.createTweet(tweet);
  }
}
