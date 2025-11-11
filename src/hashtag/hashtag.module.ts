import { Module } from '@nestjs/common';
import { HashtagService } from './hashtag.service';
import { HashtagController } from './hashtag.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HashTag } from './hashtag.entity';

@Module({
  providers: [HashtagService],
  controllers: [HashtagController],
  imports: [TypeOrmModule.forFeature([HashTag])],
  exports: [HashtagService],
})
export class HashtagModule {}
