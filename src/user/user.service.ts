import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { ConflictException } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async create(user: CreateUserDto) {
    const { username, email, password } = user;
    //Validate if a user exisit with the given email
    const userDetail = await this.userRepository.findOne({ where: { email } });

    // Handle the Error  / Exception
    if (userDetail) {
      throw new ConflictException({
        statusCode: 409,
        message: 'User already exist',
      });
    }

    //Create the user
    const newUser = this.userRepository.create({
      username,
      email,
      password,
    });

    // Saving the user to the database
    return await this.userRepository.save(newUser);
  }
}
