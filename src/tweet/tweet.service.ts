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
import { HashtagService } from 'src/hashtag/hashtag.service';
import { UpdateTweetDto } from './dto/update-tweet.dto';

@Injectable()
export class TweetService {
  constructor(
    private readonly userService: UserService,
    private readonly hashtagService: HashtagService,
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

    //Fetch all the hashtags based on the hashtag array
    const hashtags = await this.hashtagService.findHashTags(
      tweet.hashtags || [],
    );

    // Create the Tweet
    const newTweet = this.tweetRepository.create({
      ...tweet,
      user,
      hashtags,
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

  public async updateTweet(updateTweet: UpdateTweetDto) {
    // find the tweet
    const { id } = updateTweet;
    const tweet = await this.tweetRepository.findOne({ where: { id } });

    if (!tweet) {
      throw new NotFoundException({
        status: 404,
        message: `Tweet with ${id} not found`,
      });
    }

    //  find all hashtags
    const hashtags = await this.hashtagService.findHashTags(
      updateTweet.hashtags || [],
    );

    // Update properties of the tweet
    tweet.text = updateTweet.text ?? tweet.text;
    tweet.image = updateTweet.image ?? tweet.image;
    tweet.hashtags = hashtags;
  }
}
