import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { HashingProvider } from './provider/hashing.provider';
import { type ConfigType } from '@nestjs/config';
import authConfig from './config/auth.config';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,

    @Inject(authConfig.KEY)
    private readonly authConfiguration: ConfigType<typeof authConfig>,

    private readonly hashingProvider: HashingProvider,
  ) {}

  public async login(user: UserDto) {
    const existingUser = await this.userService.findByUsername(user.username);

    const validPassword = await this.hashingProvider.comparePassword(
      user.password,
      existingUser.password,
    );

    if (!validPassword) {
      throw new UnauthorizedException({
        status: 401,
        message: 'Email or password is invalid',
      });
    }

    return {
      data: existingUser,
      success: true,
      message: 'User Logged in successfully',
    };
  }

  public async signup(user: CreateUserDto) {
    return await this.userService.create(user);
  }
}
