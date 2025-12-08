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
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly hashingProvider: HashingProvider,

    @Inject(authConfig.KEY)
    private readonly authConfiguration: ConfigType<typeof authConfig>,
    private readonly jwtService: JwtService,
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

    // first  object is that payload
    //  second argument is the
    const token = await this.jwtService.signAsync(
      {
        sub: existingUser.id,
        email: existingUser.email,
      },
      {
        secret: this.authConfiguration.secret,
        expiresIn: this.authConfiguration.expiresIn,
        audience: this.authConfiguration.audience,
        issuer: this.authConfiguration.issuer,
      },
    );

    return {
      token: token,
      success: true,
      message: 'User Logged in successfully',
    };
  }

  public async signup(user: CreateUserDto) {
    return await this.userService.create(user);
  }
}
