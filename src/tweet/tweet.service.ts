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
import { GetTweetQueryDto } from './dto/get-tweet-query.dto';

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

  public async getUserTweets(id: string, tweetQuery: GetTweetQueryDto) {
    // check if the user exist
    const user = await this.userService.findOne(id);

    if (!user) {
      throw new NotFoundException({
        status: 404,
        message: 'User not found',
      });
    }

    const limit = tweetQuery.limit ?? 10;
    const page = tweetQuery.page ?? 1;

    // get all the tweets
    const tweets = await this.tweetRepository.find({
      where: { user: { id: user.id } },
      relations: ['user', 'hashtags'],
      take: limit,
      // how will we specify how many records to skip for this we use a formula.
      // so  for the first page 1
      // page = 1: (page  - 1) * limit => (1-1)*10 => 0
      // page = 2: (page - 1) * limit => (2-1)*10 => 10
      skip: (page - 1) * limit,
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

    return await this.tweetRepository.save(tweet);
  }

  public async deleteTweet(id: string) {
    // When we have Uni-Directional Many-to-Many relationship.
    // So when we delete the owning relationship entity (Tweet) the entries in the Bridge table will also be deleted.
    // (Point to Remember) Tweet is the owning relationship holder/entity because it has JoinTable decorator.
    await this.tweetRepository.delete({ id });
    return { deleted: true, id };
  }
}
