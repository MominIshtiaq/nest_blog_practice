import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  public async login(user: UserDto) {
    const existingUser = await this.userService.findByEmail(user.email);

    if (!existingUser) {
      throw new UnauthorizedException({
        status: 401,
        message: 'Email or password is invalid',
      });
    }

    return 'You are logged in';
  }

  public async signup(user: CreateUserDto) {
    return await this.userService.create(user);
  }
}
