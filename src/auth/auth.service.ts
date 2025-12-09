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
import { ActiveUserType } from './interfaces/active-user-type.interface';
import { User } from 'src/user/user.entity';
import { RefreshTokenDto } from './dto/refresh-token.dto';

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

  // Common function to create both AcessToken and RefreshToken
  private async signToken<T>(userId: string, expiresIn: number, payload?: T) {
    return await this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        secret: this.authConfiguration.secret,
        expiresIn: expiresIn,
        audience: this.authConfiguration.audience,
        issuer: this.authConfiguration.issuer,
      },
    );
  }

  private async generateToken(user: User) {
    // generate Access Token
    const accessToken = await this.signToken<Partial<ActiveUserType>>(
      user.id,
      this.authConfiguration.expiresIn,
      { email: user.email },
    );

    // generate Refresh Token
    const refreshToken = await this.signToken(
      user.id,
      this.authConfiguration.refreshTokenExpiresIn,
    );

    return {
      token: accessToken,
      refreshToken,
    };
  }

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
    // second argument is the
    // const token = await this.jwtService.signAsync(
    //   {
    //     sub: existingUser.id,
    //     email: existingUser.email,
    //   },
    //   {
    //     secret: this.authConfiguration.secret,
    //     expiresIn: this.authConfiguration.expiresIn,
    //     audience: this.authConfiguration.audience,
    //     issuer: this.authConfiguration.issuer,
    //   },
    // );

    // const refreshToken = await this.jwtService.signAsync(
    //   {
    //     sub: existingUser.id,
    //   },
    //   {
    //     secret: this.authConfiguration.secret,
    //     expiresIn: this.authConfiguration.refreshTokenExpiresIn,
    //     audience: this.authConfiguration.audience,
    //     issuer: this.authConfiguration.issuer,
    //   },
    // );

    const tokens = await this.generateToken(existingUser);

    return {
      ...tokens,
      success: true,
      message: 'User Logged in successfully',
    };
  }

  public async refreshToken(refreshTokenDto: RefreshTokenDto) {
    try {
      //1. verify the refresh token
      const { sub } = await this.jwtService.verifyAsync(
        refreshTokenDto.refreshToken,
        {
          secret: this.authConfiguration.secret,
          maxAge: this.authConfiguration.refreshTokenExpiresIn,
          audience: this.authConfiguration.audience,
          issuer: this.authConfiguration.issuer,
        },
      );

      //2. find the user from the db using the ID
      const user = await this.userService.findOne(sub);

      //3. generate an access token
      return await this.generateToken(user);
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }

  public async signup(user: CreateUserDto) {
    return await this.userService.create(user);
  }

  public async validUserFromPayload(id: string) {
    return await this.userService.findOne(id);
  }
}
