import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from './profile.entity';
import { Repository } from 'typeorm';
import { CreateProfileDto } from './dto/create-profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  async getAllProfiles() {
    return await this.profileRepository.find({
      relations: {
        user: true
      }
    });
  }

  async createProfile(profile: CreateProfileDto) {
    const { firstName, lastName, gender, dateofBirth, bio, profileImage } =
      profile;
    const newProfile = this.profileRepository.create({
      firstName,
      lastName,
      gender,
      dateofBirth,
      bio,
      profileImage,
    });
    return await this.profileRepository.save(newProfile);
  }
}
