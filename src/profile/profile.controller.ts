import { Body, Controller, Get, Post } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  async getAllProfiles() {
    return this.profileService.getAllProfiles()
  }

  @Post()
  async createProfile(@Body() profile: CreateProfileDto){
    return this.profileService.createProfile(profile)
  }
}
