import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
  RequestTimeoutException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UserAlreadyExistException } from 'src/exceptions/user-already-exist.exception';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll() {
    try {
      return await this.userRepository.find({
        relations: {
          profile: true,
        },
      });
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        throw new RequestTimeoutException(
          'an error has occurred. Please try later',
          {
            description: 'Could not connect to the Database',
          },
        );
      } else {
        console.log(error);
      }
    }
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException({
        status: 404,
        message: 'User not found',
      });
    }

    return user;
  }

  async create(user: CreateUserDto) {
    try {
      const { email, username } = user;

      //Validate if a user exist with the given username
      const existingUserName = await this.userRepository.findOne({
        where: [{ username }],
      });

      // Handle the Error  / Exception
      if (existingUserName) {
        throw new UserAlreadyExistException('username', username);
      }

      //Validate if a user exist with the given email
      const existingUserEmail = await this.userRepository.findOne({
        where: [{ email }],
      });

      // Handle the Error  / Exception
      if (existingUserEmail) {
        throw new UserAlreadyExistException('email', email);
      }

      //Create the user
      const newUser = this.userRepository.create(user);

      // Saving the user to the database
      return await this.userRepository.save(newUser);
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        throw new RequestTimeoutException(
          'an error has occurred. Please try later',
          {
            description: 'Could not connect to the Database',
          },
        );
      }
      throw error;
    }
  }

  async delete(id: string) {
    await this.userRepository.delete({ id });
    return { deleted: true };
  }
}
