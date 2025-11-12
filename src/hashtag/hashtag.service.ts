import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HashTag } from './hashtag.entity';
import { In, Repository } from 'typeorm';
import { createHashTagDto } from './dto/create-hashtag.dto';

@Injectable()
export class HashtagService {
  constructor(
    @InjectRepository(HashTag)
    private readonly hashTagRepository: Repository<HashTag>,
  ) {}

  async getAllHashTag() {
    return this.hashTagRepository.find();
  }

  async createHashTag(hashtag: createHashTagDto) {
    let newHashtag = this.hashTagRepository.create(hashtag);
    return await this.hashTagRepository.save(newHashtag);
  }

  async findHashTags(hashtags: string[]) {
    // We are passing the hashTags array to the "In" method import from the "typeorm"
    // This method is going to find all those hashtags whose id falls in the id which is in the hashtag array
    // This will return all the hashtags from the hashtable where the Id of hashtag matches the id present in the hashtags array
    // If we are providing an array with single Wrong hashTag id, It throws error but when we are provide and array of of multiple
    // hashTags id it creates the Tweet with all the tags which are valid and skip the others
    try {
      return await this.hashTagRepository.find({ where: { id: In(hashtags) } });
    } catch (error) {
      throw new NotFoundException({
        status: 404,
        message: 'Invalid HashTag provided',
      });
    }
  }

  async deleteHashTag(id: string) {
    await this.hashTagRepository.delete({ id });
    return { deleted: true, id };
  }

  async softDeleteHashTag(id: string) {
    await this.hashTagRepository.softDelete({ id });
    return { deleted: true, id };
  }
}
