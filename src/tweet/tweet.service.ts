import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tweet } from './tweet.entity';
import { Repository } from 'typeorm';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class TweetService {
  constructor(
    private readonly userService: UserService,
    @InjectRepository(Tweet)
    private readonly tweetRepository: Repository<Tweet>,
  ) {}

  public async createTweet(tweet: CreateTweetDto) {
    // Find user with the given userid from the user table
    const { userId } = tweet;
    const user = await this.userService.findOne(userId);

    if (!user) {
      throw new BadRequestException({
        status: 400,
        message: 'Something looks Wrong',
      });
    }

    // Create the Tweet
    const newTweet = this.tweetRepository.create({
      ...tweet,
      user: user,
    });

    // Save the Tweet
    return await this.tweetRepository.save(newTweet);
  }

  public async getUserTweets(id: string) {
    // check if the user exist
    const user = await this.userService.findOne(id);

    if (!user) {
      throw new NotFoundException({
        status: 404,
        message: 'User not found',
      });
    }

    // get all the tweets
    const tweets = await this.tweetRepository.find({
      where: { user: { id: user.id } },
      relations: ['user'],
    });

    // return all the tweets
    return tweets;
  }
}
