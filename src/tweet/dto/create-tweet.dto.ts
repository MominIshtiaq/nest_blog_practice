import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateTweetDto {
  @IsNotEmpty()
  @IsString()
  text: string;

  @IsOptional()
  image?: string;

  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @IsOptional()
  @IsString({ each: true })
  @IsArray()
  hashtags?: string[];
}
