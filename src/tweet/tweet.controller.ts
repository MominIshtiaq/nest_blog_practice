import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TweetService } from './tweet.service';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { UpdateTweetDto } from './dto/update-tweet.dto';
import { GetTweetQueryDto } from './dto/get-tweet-query.dto';

@Controller('tweet')
export class TweetController {
  constructor(private readonly tweetService: TweetService) {}

  @Get(':userId')
  async getUserTweets(
    @Param('userId') userId: string,
    @Query() tweetQuery: GetTweetQueryDto,
  ) {
    return this.tweetService.getUserTweets(userId, tweetQuery);
  }

  @Post()
  async create(@Body() tweet: CreateTweetDto) {
    return this.tweetService.createTweet(tweet);
  }

  @Patch()
  async update(@Body() updateTweet: UpdateTweetDto) {
    return this.tweetService.updateTweet(updateTweet);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.tweetService.deleteTweet(id);
  }
}
