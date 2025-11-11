import { PartialType } from '@nestjs/mapped-types';
import { CreateTweetDto } from './create-tweet.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateTweetDto extends PartialType(CreateTweetDto) {
  @IsNotEmpty()
  @IsString()
  id: string;
}
