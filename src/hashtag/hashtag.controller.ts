import { Body, Controller, Get, Post } from '@nestjs/common';
import { HashtagService } from './hashtag.service';
import { createHashTagDto } from './dto/create-hashtag.dto';

@Controller('hashtag')
export class HashtagController {
  constructor(private readonly hashtagService: HashtagService) {}

  @Get()
  public async getAllHashTags() {
    return this.hashtagService.getAllHashTag();
  }

  @Post()
  public async create(@Body() hashtag: createHashTagDto) {
    return this.hashtagService.createHashTag(hashtag);
  }
}
