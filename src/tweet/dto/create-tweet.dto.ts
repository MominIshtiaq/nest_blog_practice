import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTweetDto {
  @IsNotEmpty()
  @IsString()
  text: string;

  @IsOptional()
  image?: string;

  @IsOptional()
  @IsString({ each: true })
  @IsArray()
  hashtags?: string[];
}
